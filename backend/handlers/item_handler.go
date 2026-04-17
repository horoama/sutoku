package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ItemResponse はマージ済みのアイテムのレスポンス構造体です。
type ItemResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	CategoryID  string `json:"categoryId"`
	DefaultDays int    `json:"defaultDays"`
	ImageURL    string `json:"imageUrl"`
	IsSystem    bool   `json:"isSystem"`
	FamilyID    *string `json:"familyId,omitempty"`
	StorageType string `json:"storageType"`
	// Override specific fields
	IsCustomized bool   `json:"isCustomized"`
	DefaultNote  string `json:"defaultNote,omitempty"`
}

// CategoryResponse はマージ済みのアイテムを含むカテゴリのレスポンス構造体です。
type CategoryResponse struct {
	ID    string         `json:"id"`
	Name  string         `json:"name"`
	Items []ItemResponse `json:"items"`
}

// GetItems はカテゴリごとにグループ化されたアイテム一覧を取得します。
// 指定された familyId に基づいてシステムマスタへのオーバーライドと家族独自アイテムをマージして返します。
func GetItems(c *gin.Context) {
	familyID := c.Query("familyId")

	// 1. カテゴリ一覧の取得
	var dbCategories []models.Category
	if err := database.DB.Find(&dbCategories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	// 2. アイテム一覧とオーバーライドを結合して取得
	type mergedItem struct {
		models.ItemTemplate
		OverrideCustomDays *int   `gorm:"column:custom_days"`
		OverrideDefaultNote string `gorm:"column:default_note"`
		OverrideIsHidden   *bool  `gorm:"column:is_hidden"`
		OverrideID         *string `gorm:"column:override_id"`
	}

	var rawItems []mergedItem
	query := database.DB.Table("item_templates").
		Select("item_templates.*, family_item_overrides.id as override_id, family_item_overrides.custom_days, family_item_overrides.default_note, family_item_overrides.is_hidden").
		Joins("LEFT JOIN family_item_overrides ON family_item_overrides.item_template_id = item_templates.id AND family_item_overrides.family_id = ?", familyID)

	if familyID != "" {
		query = query.Where("item_templates.is_system = ? OR item_templates.family_id = ?", true, familyID)
	} else {
		query = query.Where("item_templates.is_system = ?", true)
	}

	if err := query.Find(&rawItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	// 3. カテゴリごとのアイテムリストへのマッピング
	categoryMap := make(map[string][]ItemResponse)
	for _, item := range rawItems {
		// IsHidden == true のものは除外
		if item.OverrideIsHidden != nil && *item.OverrideIsHidden {
			continue
		}

		days := item.DefaultDays
		isCustomized := false
		defaultNote := ""

		if item.OverrideID != nil {
			isCustomized = true
			if item.OverrideCustomDays != nil {
				days = *item.OverrideCustomDays
			}
			defaultNote = item.OverrideDefaultNote
		}

		resItem := ItemResponse{
			ID:           item.ID,
			Name:         item.Name,
			CategoryID:   item.CategoryID,
			DefaultDays:  days,
			ImageURL:     item.ImageURL,
			IsSystem:     item.IsSystem,
			FamilyID:     item.FamilyID,
			StorageType:  item.StorageType,
			IsCustomized: isCustomized,
			DefaultNote:  defaultNote,
		}

		categoryMap[item.CategoryID] = append(categoryMap[item.CategoryID], resItem)
	}

	// 4. レスポンスの構築
	var response []CategoryResponse
	for _, cat := range dbCategories {
		items := categoryMap[cat.ID]
		if items == nil {
			items = []ItemResponse{} // Return empty array instead of null
		}
		response = append(response, CategoryResponse{
			ID:    cat.ID,
			Name:  cat.Name,
			Items: items,
		})
	}

	c.JSON(http.StatusOK, response)
}

// CreateItemTemplate は新しくカスタムなアイテムテンプレートを作成します。
func CreateItemTemplate(c *gin.Context) {
	var input struct {
		Name        string `json:"name"`
		CategoryID  string `json:"categoryId"`
		DefaultDays int    `json:"defaultDays"`
		FamilyID    string `json:"familyId"`
		StorageType string `json:"storageType"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.StorageType == "" {
		input.StorageType = "FRIDGE"
	}

	template := models.ItemTemplate{
		Name:        input.Name,
		CategoryID:  input.CategoryID,
		DefaultDays: input.DefaultDays,
		StorageType: input.StorageType,
		IsSystem:    false,
		FamilyID:    &input.FamilyID,
	}

	if err := database.DB.Create(&template).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item template"})
		return
	}

	c.JSON(http.StatusOK, template)
}

// UpdateItemTemplate はアイテムテンプレートを更新します。
// システムのテンプレートの場合は、複製ではなく FamilyItemOverride レコードを作成または更新します。
func UpdateItemTemplate(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		Name        string `json:"name"`
		DefaultDays int    `json:"defaultDays"`
		FamilyID    string `json:"familyId"`
		StorageType string `json:"storageType"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var template models.ItemTemplate
	if err := database.DB.First(&template, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item template not found"})
		return
	}

	if template.IsSystem {
		// Create or update FamilyItemOverride
		var override models.FamilyItemOverride
		err := database.DB.Where("item_template_id = ? AND family_id = ?", template.ID, input.FamilyID).First(&override).Error

		if err == nil {
			// Update existing override
			if err := database.DB.Model(&override).Updates(models.FamilyItemOverride{
				CustomDays: &input.DefaultDays,
			}).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item override"})
				return
			}
		} else {
			// Create new override
			override = models.FamilyItemOverride{
				FamilyID:       input.FamilyID,
				ItemTemplateID: template.ID,
				CustomDays:     &input.DefaultDays,
			}
			if err := database.DB.Create(&override).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item override"})
				return
			}
		}

		// Return merged format
		res := ItemResponse{
			ID:           template.ID,
			Name:         template.Name,
			CategoryID:   template.CategoryID,
			DefaultDays:  input.DefaultDays,
			ImageURL:     template.ImageURL,
			IsSystem:     template.IsSystem,
			FamilyID:     template.FamilyID,
			StorageType:  template.StorageType,
			IsCustomized: true,
			DefaultNote:  override.DefaultNote,
		}

		c.JSON(http.StatusOK, res)
		return
	}

	// Update existing custom template
	updates := map[string]interface{}{
		"name":         input.Name,
		"default_days": input.DefaultDays,
	}
	if input.StorageType != "" {
		updates["storage_type"] = input.StorageType
	}

	if err := database.DB.Model(&template).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item template"})
		return
	}

	// Return merged format for custom item
	res := ItemResponse{
		ID:           template.ID,
		Name:         input.Name, // Use updated name
		CategoryID:   template.CategoryID,
		DefaultDays:  input.DefaultDays, // Use updated days
		ImageURL:     template.ImageURL,
		IsSystem:     template.IsSystem,
		FamilyID:     template.FamilyID,
		IsCustomized: false,
	}

	c.JSON(http.StatusOK, res)
}
