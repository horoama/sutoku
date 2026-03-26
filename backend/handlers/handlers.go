package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthCheck endpoint
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Seed the initial data
func SeedData(c *gin.Context) {
	var count int64
	database.DB.Model(&models.Category{}).Count(&count)

	if count > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Already seeded"})
		return
	}

	meatCategory := models.Category{Name: "肉類"}
	vegCategory := models.Category{Name: "野菜類"}
	dairyCategory := models.Category{Name: "乳製品"}

	database.DB.Create(&meatCategory)
	database.DB.Create(&vegCategory)
	database.DB.Create(&dairyCategory)

	itemTemplates := []models.ItemTemplate{
		{Name: "牛肉", CategoryID: meatCategory.ID, DefaultDays: 3, IsSystem: true},
		{Name: "豚肉", CategoryID: meatCategory.ID, DefaultDays: 3, IsSystem: true},
		{Name: "キャベツ", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true},
		{Name: "にんじん", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true},
		{Name: "牛乳", CategoryID: dairyCategory.ID, DefaultDays: 7, IsSystem: true},
	}

	database.DB.Create(&itemTemplates)

	c.JSON(http.StatusOK, gin.H{"message": "Seed successful"})
}

// Get Items grouped by Categories
func GetItems(c *gin.Context) {
	var categories []models.Category
	if err := database.DB.Preload("Items").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// Create User & Family (Setup)
func SetupUser(c *gin.Context) {
	var family models.Family
	if err := database.DB.Where("name = ?", "Test Family").First(&family).Error; err != nil {
		family = models.Family{Name: "Test Family"}
		database.DB.Create(&family)
	}

	var user models.User
	if err := database.DB.Where("email = ?", "test@example.com").First(&user).Error; err != nil {
		user = models.User{
			Name:     "Test User",
			Email:    "test@example.com",
			FamilyID: &family.ID,
		}
		database.DB.Create(&user)
	}

	c.JSON(http.StatusOK, gin.H{
		"user":   user,
		"family": family,
	})
}

// Add to Shopping List
func AddShoppingItem(c *gin.Context) {
	var input struct {
		FamilyID       string  `json:"familyId"`
		ItemTemplateID string  `json:"itemTemplateId"`
		Priority       string  `json:"priority"`
		Note           *string `json:"note"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Priority fallback
	if input.Priority == "" {
		input.Priority = "TODAY"
	}

	item := models.ShoppingItem{
		FamilyID:       input.FamilyID,
		ItemTemplateID: input.ItemTemplateID,
		Priority:       input.Priority,
		Note:           input.Note,
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item"})
		return
	}

	// Fetch with relationship to match previous response
	database.DB.Preload("ItemTemplate").First(&item, "id = ?", item.ID)
	c.JSON(http.StatusOK, item)
}

// Get Shopping List
func GetShoppingList(c *gin.Context) {
	familyID := c.Param("familyId")
	var items []models.ShoppingItem

	if err := database.DB.Preload("ItemTemplate").Where("family_id = ? AND is_purchased = ?", familyID, false).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shopping list"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// Move Shopping Item to Fridge (Purchase)
func PurchaseShoppingItem(c *gin.Context) {
	itemID := c.Param("id")
	var shoppingItem models.ShoppingItem

	if err := database.DB.Preload("ItemTemplate").Where("id = ?", itemID).First(&shoppingItem).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}

	tx := database.DB.Begin()

	// Update Shopping Item
	if err := tx.Model(&shoppingItem).Update("is_purchased", true).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}

	// Create Fridge Item
	expirationDate := time.Now().AddDate(0, 0, shoppingItem.ItemTemplate.DefaultDays)
	fridgeItem := models.FridgeItem{
		FamilyID:       shoppingItem.FamilyID,
		ItemTemplateID: shoppingItem.ItemTemplateID,
		ExpirationDate: expirationDate,
		Location:       "FRIDGE",
	}
	if err := tx.Create(&fridgeItem).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to fridge"})
		return
	}

	// Record Purchase History
	purchaseHistory := models.PurchaseHistory{
		FamilyID:       shoppingItem.FamilyID,
		ItemTemplateID: shoppingItem.ItemTemplateID,
		Quantity:       1,
	}
	if err := tx.Create(&purchaseHistory).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record history"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Moved to fridge and history recorded"})
}

// Get Purchase History
func GetPurchaseHistory(c *gin.Context) {
	familyID := c.Param("familyId")
	var history []models.PurchaseHistory

	if err := database.DB.Preload("ItemTemplate").Where("family_id = ?", familyID).Order("purchased_at desc").Find(&history).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
		return
	}

	c.JSON(http.StatusOK, history)
}

// Get Fridge Items
func GetFridgeItems(c *gin.Context) {
	familyID := c.Param("familyId")
	var items []models.FridgeItem

	if err := database.DB.Preload("ItemTemplate").Where("family_id = ?", familyID).Order("expiration_date asc").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch fridge items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// Get Chat Messages
func GetChatMessages(c *gin.Context) {
	familyID := c.Param("familyId")
	var messages []models.ChatMessage

	if err := database.DB.Preload("User").Where("family_id = ?", familyID).Order("created_at desc").Limit(50).Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// Send Chat Message
func SendChatMessage(c *gin.Context) {
	var input struct {
		FamilyID string `json:"familyId"`
		UserID   string `json:"userId"`
		Text     string `json:"text"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	message := models.ChatMessage{
		FamilyID: input.FamilyID,
		UserID:   input.UserID,
		Text:     input.Text,
	}

	if err := database.DB.Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	database.DB.Preload("User").First(&message, "id = ?", message.ID)
	c.JSON(http.StatusOK, message)
}
