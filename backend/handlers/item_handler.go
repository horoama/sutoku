package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetItems はカテゴリごとにグループ化されたアイテム一覧を取得します。
func GetItems(c *gin.Context) {
	var categories []models.Category
	if err := database.DB.Preload("Items").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// CreateItemTemplate は新しくカスタムなアイテムテンプレートを作成します。
func CreateItemTemplate(c *gin.Context) {
	var input struct {
		Name        string `json:"name"`
		CategoryID  string `json:"categoryId"`
		DefaultDays int    `json:"defaultDays"`
		StorageType string `json:"storageType"`
		FamilyID    string `json:"familyId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
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
// システムのテンプレートの場合は、家族用の新しいカスタムテンプレートとして複製します。
func UpdateItemTemplate(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		Name        string `json:"name"`
		DefaultDays int    `json:"defaultDays"`
		StorageType string `json:"storageType"`
		FamilyID    string `json:"familyId"`
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
		// 共通のシステムテンプレートは上書きせず、家族用のカスタムテンプレートとして新規作成(複製)する
		// これにより、デフォルトの名称や日数を各家庭に合わせてパーソナライズできる
		newTemplate := models.ItemTemplate{
			Name:        input.Name,
			CategoryID:  template.CategoryID,
			DefaultDays: input.DefaultDays,
			StorageType: input.StorageType,
			ImageURL:    template.ImageURL,
			IsSystem:    false,
			FamilyID:    &input.FamilyID,
		}

		if err := database.DB.Create(&newTemplate).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to duplicate item template"})
			return
		}
		c.JSON(http.StatusOK, newTemplate)
		return
	}

	// すでに家族固有のカスタムテンプレートになっている場合は、そのまま上書き更新する
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

	c.JSON(http.StatusOK, template)
}
