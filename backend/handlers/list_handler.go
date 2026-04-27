package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetLists は買い物リスト、ストック、消費済みアイテムをグループ化して取得します。
func GetLists(c *gin.Context) {
	familyID := c.Param("familyId")

	var shoppingItems []models.ShoppingListItem
	if err := database.DB.Preload("Template").Preload("AddedBy").Where("family_id = ? AND status IN ('pending', 'checked')", familyID).Order("updated_at desc").Find(&shoppingItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shopping items"})
		return
	}

	var stockItems []models.StockItem
	if err := database.DB.Preload("Template").Preload("AddedBy").Where("family_id = ?", familyID).Order("updated_at desc").Find(&stockItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stock items"})
		return
	}

	stock := []models.StockItem{}
	consumed := []models.StockItem{}

	for _, item := range stockItems {
		if item.ConsumedAt == nil {
			stock = append(stock, item)
		} else {
			consumed = append(consumed, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"shopping": shoppingItems,
		"fridge":   stock, // 互換性のためキー名を維持
		"stock":    stock,
		"consumed": consumed,
	})
}

// AddShoppingItem は買い物リストにアイテムを追加します。
func AddShoppingItem(c *gin.Context) {
	var input struct {
		FamilyID     string `json:"familyId"`
		TemplateID   string `json:"templateId"`
		Priority     string `json:"priority"`
		PurchaseMemo string `json:"purchaseMemo"`
		StoreHint    string `json:"storeHint"`
		AddedByID    string `json:"addedById"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.Priority == "" {
		input.Priority = "medium"
	}

	item := models.ShoppingListItem{
		FamilyID:     input.FamilyID,
		TemplateID:   input.TemplateID,
		AddedByID:    input.AddedByID,
		Priority:     input.Priority,
		PurchaseMemo: input.PurchaseMemo,
		StoreHint:    input.StoreHint,
		Status:       "pending",
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to shopping list"})
		return
	}

	// Eager load template for response
	database.DB.Preload("Template").First(&item, "id = ?", item.ID)

	c.JSON(http.StatusOK, item)
}

// UpdateShoppingItemStatus は買い物リストのアイテムのステータスを更新します。
// checked の場合は CheckedAt を設定します。
func UpdateShoppingItemStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var item models.ShoppingListItem
	if err := database.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	item.Status = input.Status
	if input.Status == "checked" {
		now := time.Now()
		item.CheckedAt = &now
	} else if input.Status == "pending" {
		item.CheckedAt = nil
	}

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, item)
}

// MoveToStock は買い物リストのアイテム（checked状態）をストックに移動させます。
func MoveToStock(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		AddedByID string `json:"addedById"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var shopItem models.ShoppingListItem
	if err := database.DB.Preload("Template").First(&shopItem, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Shopping item not found"})
		return
	}

	if shopItem.Status != "checked" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only checked items can be moved to stock"})
		return
	}

	// Move to Stock
	stockItem := models.StockItem{
		FamilyID:       shopItem.FamilyID,
		TemplateID:     shopItem.TemplateID,
		ShoppingItemID: &shopItem.ID,
		AddedByID:      input.AddedByID,
	}

	tx := database.DB.Begin()

	if err := tx.Create(&stockItem).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create stock item"})
		return
	}

	shopItem.Status = "moved"
	if err := tx.Save(&shopItem).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shopping item status"})
		return
	}

	tx.Commit()

	// Load relationships for response
	database.DB.Preload("Template").First(&stockItem, "id = ?", stockItem.ID)

	c.JSON(http.StatusOK, stockItem)
}

// AddStockItem は手動でストックにアイテムを追加します。
func AddStockItem(c *gin.Context) {
	var input struct {
		FamilyID        string `json:"familyId"`
		TemplateID      string `json:"templateId"`
		AddedByID       string `json:"addedById"`
		StorageLocation string `json:"storageLocation"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	item := models.StockItem{
		FamilyID:        input.FamilyID,
		TemplateID:      input.TemplateID,
		AddedByID:       input.AddedByID,
		StorageLocation: input.StorageLocation,
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add stock item"})
		return
	}

	database.DB.Preload("Template").First(&item, "id = ?", item.ID)

	c.JSON(http.StatusOK, item)
}

// ConsumeStockItem はストックのアイテムを消費済みにします。
func ConsumeStockItem(c *gin.Context) {
	id := c.Param("id")

	var item models.StockItem
	if err := database.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stock item not found"})
		return
	}

	now := time.Now()
	item.ConsumedAt = &now

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to consume item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

// DeleteShoppingItem は買い物リストのアイテムを削除します。
func DeleteShoppingItem(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.ShoppingListItem{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete shopping item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// DeleteStockItem はストックのアイテムを削除します。
func DeleteStockItem(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.StockItem{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete stock item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// UpdateShoppingItem は買い物リストのアイテムを更新します。
func UpdateShoppingItem(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Priority     string `json:"priority"`
		PurchaseMemo string `json:"purchaseMemo"`
		StoreHint    string `json:"storeHint"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var item models.ShoppingListItem
	if err := database.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if input.Priority != "" {
		item.Priority = input.Priority
	}
	item.PurchaseMemo = input.PurchaseMemo
	item.StoreHint = input.StoreHint

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shopping item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

// UpdateStockItem はストックのアイテムを個別に更新します。
func UpdateStockItem(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		StorageLocation string     `json:"storageLocation"`
		ExpiryDate      *time.Time `json:"expiryDate"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var item models.StockItem
	if err := database.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if input.StorageLocation != "" {
		item.StorageLocation = input.StorageLocation
	}
	if input.ExpiryDate != nil {
		item.ExpiryDate = input.ExpiryDate
	}

	if err := database.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock item"})
		return
	}

	c.JSON(http.StatusOK, item)
}
