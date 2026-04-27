package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetItems は指定された家族向けのカテゴリとアイテム（システム提供＋家族独自）の一覧を取得します。
func GetItems(c *gin.Context) {
	familyID := c.Query("familyId")
	if familyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "familyId is required"})
		return
	}

	var categories []models.Category
	if err := database.DB.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	// 家族用とシステム用（ソースIDでオーバーライドされていないもの）を取得
	// Rawクエリを使用するため、論理削除(deleted_at IS NULL)を明示的に指定する
	var templates []models.ProductTemplate
	err := database.DB.Raw(`
		SELECT * FROM product_templates
		WHERE family_id = ? AND deleted_at IS NULL
		UNION
		SELECT * FROM product_templates
		WHERE family_id IS NULL AND deleted_at IS NULL
		AND id NOT IN (
			SELECT source_template_id FROM product_templates
			WHERE family_id = ? AND source_template_id IS NOT NULL AND deleted_at IS NULL
		)
	`, familyID, familyID).Scan(&templates).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch templates"})
		return
	}

	// カテゴリーごとに分類
	categoryMap := make(map[string]*models.Category)
	for i := range categories {
		categories[i].Items = []models.ProductTemplate{}
		categoryMap[categories[i].ID] = &categories[i]
	}

	for _, tmpl := range templates {
		if cat, exists := categoryMap[tmpl.CategoryID]; exists {
			cat.Items = append(cat.Items, tmpl)
		}
	}

	var result []models.Category
	for _, cat := range categories {
		result = append(result, *categoryMap[cat.ID])
	}

	c.JSON(http.StatusOK, result)
}

// CreateItemTemplate は新しくカスタムなアイテムテンプレートを作成します。
func CreateItemTemplate(c *gin.Context) {
	var input struct {
		Name                   string `json:"name"`
		CategoryID             string `json:"categoryId"`
		DefaultExpiryDays      int    `json:"defaultExpiryDays"`
		DefaultStorageLocation string `json:"defaultStorageLocation"`
		Memo                   string `json:"memo"`
		FamilyID               string `json:"familyId"`
		CreatedByID            string `json:"createdById"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	template := models.ProductTemplate{
		Name:                   input.Name,
		CategoryID:             input.CategoryID,
		DefaultExpiryDays:      input.DefaultExpiryDays,
		DefaultStorageLocation: input.DefaultStorageLocation,
		Memo:                   input.Memo,
		FamilyID:               &input.FamilyID,
		CreatedByID:            &input.CreatedByID,
	}

	if err := database.DB.Create(&template).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item template"})
		return
	}

	c.JSON(http.StatusOK, template)
}

// UpdateItemTemplate はアイテムテンプレートを更新します。
// システムのテンプレートの場合は、家族用の新しいカスタムテンプレートとして複製します。
func UpdateItemTemplate(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		Name                   string `json:"name"`
		DefaultExpiryDays      int    `json:"defaultExpiryDays"`
		DefaultStorageLocation string `json:"defaultStorageLocation"`
		Memo                   string `json:"memo"`
		FamilyID               string `json:"familyId"`
		CreatedByID            string `json:"createdById"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var template models.ProductTemplate
	if err := database.DB.First(&template, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item template not found"})
		return
	}

	if template.FamilyID == nil {
		// Create a new custom template for the family
		newTemplate := models.ProductTemplate{
			Name:                   input.Name,
			CategoryID:             template.CategoryID,
			DefaultExpiryDays:      input.DefaultExpiryDays,
			DefaultStorageLocation: input.DefaultStorageLocation,
			Memo:                   input.Memo,
			ImageURL:               template.ImageURL,
			FamilyID:               &input.FamilyID,
			CreatedByID:            &input.CreatedByID,
			SourceTemplateID:       &template.ID,
		}

		if err := database.DB.Create(&newTemplate).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to duplicate item template"})
			return
		}
		c.JSON(http.StatusOK, newTemplate)
		return
	}

	// Update existing custom template
	if err := database.DB.Model(&template).Updates(models.ProductTemplate{
		Name:                   input.Name,
		DefaultExpiryDays:      input.DefaultExpiryDays,
		DefaultStorageLocation: input.DefaultStorageLocation,
		Memo:                   input.Memo,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item template"})
		return
	}

	c.JSON(http.StatusOK, template)
}
