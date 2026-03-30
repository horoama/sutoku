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

	meatCategory := models.Category{Name: "Meat & Seafood"}
	vegCategory := models.Category{Name: "Produce"}
	dairyCategory := models.Category{Name: "Dairy & Eggs"}
	pantryCategory := models.Category{Name: "Pantry"}
	bakeryCategory := models.Category{Name: "Bakery"}
	seasoningCategory := models.Category{Name: "Seasoning & Spices"}
	carbsCategory := models.Category{Name: "Carbohydrates"}

	database.DB.Create(&meatCategory)
	database.DB.Create(&vegCategory)
	database.DB.Create(&dairyCategory)
	database.DB.Create(&pantryCategory)
	database.DB.Create(&bakeryCategory)
	database.DB.Create(&seasoningCategory)
	database.DB.Create(&carbsCategory)

	itemTemplates := []models.ItemTemplate{
		// Meat & Seafood
		{Name: "Chicken Breast", CategoryID: meatCategory.ID, DefaultDays: 3, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Chicken"},
		{Name: "Pork Belly", CategoryID: meatCategory.ID, DefaultDays: 4, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Pork"},
		{Name: "Ground Beef", CategoryID: meatCategory.ID, DefaultDays: 2, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Beef"},
		{Name: "Salmon Fillet", CategoryID: meatCategory.ID, DefaultDays: 2, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Salmon"},
		{Name: "Canned Tuna", CategoryID: meatCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Tuna"},

		// Produce
		{Name: "Romaine Lettuce", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Lettuce"},
		{Name: "Carrots", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Carrots"},
		{Name: "Gala Apples", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Apples"},
		{Name: "Avocados", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Avocado"},
		{Name: "Vine Tomatoes", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Tomato"},
		{Name: "Onions", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Onion"},
		{Name: "Garlic", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Garlic"},
		{Name: "Potatoes", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Potato"},
		{Name: "Spinach", CategoryID: vegCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Spinach"},
		{Name: "Bananas", CategoryID: vegCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Banana"},

		// Dairy & Eggs
		{Name: "Whole Milk", CategoryID: dairyCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Milk"},
		{Name: "Organic Eggs", CategoryID: dairyCategory.ID, DefaultDays: 21, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Eggs"},
		{Name: "Greek Yogurt", CategoryID: dairyCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Yogurt"},
		{Name: "Salted Butter", CategoryID: dairyCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Butter"},
		{Name: "Cheddar Cheese", CategoryID: dairyCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Cheese"},

		// Bakery
		{Name: "Sourdough Loaf", CategoryID: bakeryCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bread"},
		{Name: "Bagels", CategoryID: bakeryCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bagel"},
		{Name: "Tortillas", CategoryID: bakeryCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Tortilla"},

		// Carbohydrates
		{Name: "White Rice", CategoryID: carbsCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Rice"},
		{Name: "Pasta", CategoryID: carbsCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Pasta"},
		{Name: "Oats", CategoryID: carbsCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Oats"},

		// Seasoning & Spices
		{Name: "Salt", CategoryID: seasoningCategory.ID, DefaultDays: 730, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Salt"},
		{Name: "Black Pepper", CategoryID: seasoningCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Pepper"},
		{Name: "Soy Sauce", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Soy+Sauce"},
		{Name: "Olive Oil", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Olive+Oil"},
		{Name: "Sugar", CategoryID: seasoningCategory.ID, DefaultDays: 730, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Sugar"},
		{Name: "Ketchup", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Ketchup"},
		{Name: "Mayonnaise", CategoryID: seasoningCategory.ID, DefaultDays: 90, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Mayo"},
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

// Create a new custom ItemTemplate
func CreateItemTemplate(c *gin.Context) {
	var input struct {
		Name        string `json:"name"`
		CategoryID  string `json:"categoryId"`
		DefaultDays int    `json:"defaultDays"`
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
		IsSystem:    false,
		FamilyID:    &input.FamilyID,
	}

	if err := database.DB.Create(&template).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item template"})
		return
	}

	c.JSON(http.StatusOK, template)
}

// Create User & Family (Setup)
func SetupUser(c *gin.Context) {
	var family models.Family
	if err := database.DB.Where("name = ?", "Test Family").First(&family).Error; err != nil {
		family = models.Family{Name: "Test Family", InviteCode: "HEARTH-2024-LARDER"}
		database.DB.Create(&family)
	}

	var user models.User
	if err := database.DB.Where("email = ?", "test@example.com").First(&user).Error; err != nil {
		user = models.User{
			Name:     "Test User",
			Email:    "test@example.com",
			FamilyID: &family.ID,
			Role:     "admin",
		}
		database.DB.Create(&user)
	}

	// Make sure we have family members for the UI
	var count int64
	database.DB.Model(&models.User{}).Where("family_id = ?", family.ID).Count(&count)
	if count < 3 {
		member1 := models.User{Name: "Sarah Mitchell", Email: "sarah@example.com", FamilyID: &family.ID, Role: "admin"}
		member2 := models.User{Name: "James Mitchell", Email: "james@example.com", FamilyID: &family.ID, Role: "member"}
		member3 := models.User{Name: "Maya Mitchell", Email: "maya@example.com", FamilyID: &family.ID, Role: "member"}
		database.DB.FirstOrCreate(&member1, models.User{Email: "sarah@example.com"})
		database.DB.FirstOrCreate(&member2, models.User{Email: "james@example.com"})
		database.DB.FirstOrCreate(&member3, models.User{Email: "maya@example.com"})
	}

	c.JSON(http.StatusOK, gin.H{
		"user":   user,
		"family": family,
	})
}

// Get Kanban Lists grouped by status
func GetLists(c *gin.Context) {
	familyID := c.Param("familyId")

	var shoppingItems []models.ShoppingItem
	if err := database.DB.Preload("ItemTemplate").Where("family_id = ?", familyID).Order("updated_at desc").Find(&shoppingItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shopping items"})
		return
	}

	var fridgeItems []models.FridgeItem
	if err := database.DB.Preload("ItemTemplate").Where("family_id = ?", familyID).Order("updated_at desc").Find(&fridgeItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch fridge items"})
		return
	}

	shopping := []models.ShoppingItem{}
	fridge := []models.FridgeItem{}
	consumed := []models.FridgeItem{}

	for _, item := range shoppingItems {
		shopping = append(shopping, item) // Includes both PENDING and BOUGHT
	}

	for _, item := range fridgeItems {
		if item.Status == "ACTIVE" {
			fridge = append(fridge, item)
		} else if item.Status == "CONSUMED" {
			consumed = append(consumed, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"SHOPPING": shopping,
		"FRIDGE":   fridge,
		"CONSUMED": consumed,
	})
}

// Add Item to List (Default: PENDING ShoppingItem)
func AddListItem(c *gin.Context) {
	var input struct {
		FamilyID       string  `json:"familyId"`
		UserID         string  `json:"userId"`
		ItemTemplateID string  `json:"itemTemplateId"`
		Priority       string  `json:"priority"`
		Note           *string `json:"note"`
		Status         string  `json:"status"` // legacy support, determines if Shopping or Fridge
		Type           string  `json:"type"`   // "shopping" or "fridge"
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.Type == "" {
		if input.Status == "FRIDGE" || input.Status == "ACTIVE" {
			input.Type = "fridge"
		} else {
			input.Type = "shopping"
		}
	}

	var template models.ItemTemplate
	database.DB.First(&template, "id = ?", input.ItemTemplateID)

	if input.Type == "fridge" {
		now := time.Now()
		item := models.FridgeItem{
			FamilyID:       input.FamilyID,
			ItemTemplateID: input.ItemTemplateID,
			Status:         "ACTIVE",
			StartedAt:      &now,
		}

		if err := database.DB.Create(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add fridge item"})
			return
		}

		database.DB.Preload("ItemTemplate").First(&item, "id = ?", item.ID)

		if input.UserID != "" {
			logEntry := models.ActivityLog{
				FamilyID: input.FamilyID,
				UserID:   input.UserID,
				Action:   "stocked",
				Entity:   template.Name,
				Tags:     "ACTIVE",
			}
			database.DB.Create(&logEntry)
		}

		c.JSON(http.StatusOK, item)
		return
	}

	// Shopping Item
	if input.Priority == "" {
		input.Priority = "NORMAL"
	}

	item := models.ShoppingItem{
		FamilyID:       input.FamilyID,
		ItemTemplateID: input.ItemTemplateID,
		Status:         "PENDING",
		Priority:       input.Priority,
		Note:           input.Note,
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add shopping item"})
		return
	}

	database.DB.Preload("ItemTemplate").First(&item, "id = ?", item.ID)

	if input.UserID != "" {
		logEntry := models.ActivityLog{
			FamilyID: input.FamilyID,
			UserID:   input.UserID,
			Action:   "added",
			Entity:   template.Name,
			Tags:     "PENDING," + input.Priority,
		}
		database.DB.Create(&logEntry)
	}

	c.JSON(http.StatusOK, item)
}

// Move item between lists or update fields
func UpdateListItem(c *gin.Context) {
	itemID := c.Param("id")
	var input struct {
		Status   string     `json:"status"`
		Type     string     `json:"type"` // "shopping" or "fridge"
		Priority string     `json:"priority"`
		Note     *string    `json:"note"`
		UserID   string     `json:"userId"`
		EndDate  *time.Time `json:"endDate"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Figure out if it's a shopping item or fridge item to update
	var shoppingItem models.ShoppingItem
	if err := database.DB.Preload("ItemTemplate").Where("id = ?", itemID).First(&shoppingItem).Error; err == nil {
		updates := map[string]interface{}{}
		actionLogged := ""

		if input.Status != "" && input.Status != shoppingItem.Status {
			updates["status"] = input.Status
			if input.Status == "BOUGHT" {
				now := time.Now()
				updates["bought_at"] = &now
				actionLogged = "bought"

				// Additionally, create a FridgeItem for this bought item
				fridgeItem := models.FridgeItem{
					FamilyID:       shoppingItem.FamilyID,
					ItemTemplateID: shoppingItem.ItemTemplateID,
					Status:         "ACTIVE",
					StartedAt:      &now,
				}
				database.DB.Create(&fridgeItem)
			}
		}

		if input.Priority != "" && input.Priority != shoppingItem.Priority {
			updates["priority"] = input.Priority
		}

		if input.Note != nil {
			updates["note"] = input.Note
		}

		if err := database.DB.Model(&shoppingItem).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shopping item"})
			return
		}

		database.DB.Preload("ItemTemplate").First(&shoppingItem, "id = ?", shoppingItem.ID)

		if actionLogged != "" && input.UserID != "" {
			logEntry := models.ActivityLog{
				FamilyID: shoppingItem.FamilyID,
				UserID:   input.UserID,
				Action:   actionLogged,
				Entity:   shoppingItem.ItemTemplate.Name,
			}
			database.DB.Create(&logEntry)
		}

		c.JSON(http.StatusOK, shoppingItem)
		return
	}

	var fridgeItem models.FridgeItem
	if err := database.DB.Preload("ItemTemplate").Where("id = ?", itemID).First(&fridgeItem).Error; err == nil {
		updates := map[string]interface{}{}
		actionLogged := ""

		if input.Status != "" && input.Status != fridgeItem.Status {
			updates["status"] = input.Status
			if input.Status == "CONSUMED" {
				actionLogged = "consumed"
			}
		}

		if input.EndDate != nil {
			updates["end_date"] = input.EndDate
		}

		if err := database.DB.Model(&fridgeItem).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update fridge item"})
			return
		}

		database.DB.Preload("ItemTemplate").First(&fridgeItem, "id = ?", fridgeItem.ID)

		if actionLogged != "" && input.UserID != "" {
			logEntry := models.ActivityLog{
				FamilyID: fridgeItem.FamilyID,
				UserID:   input.UserID,
				Action:   actionLogged,
				Entity:   fridgeItem.ItemTemplate.Name,
			}
			database.DB.Create(&logEntry)
		}

		c.JSON(http.StatusOK, fridgeItem)
		return
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
}

// Get Family Members
func GetFamilyMembers(c *gin.Context) {
	familyID := c.Param("familyId")
	var users []models.User

	if err := database.DB.Where("family_id = ?", familyID).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch members"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// Get Activity Logs
func GetActivityLogs(c *gin.Context) {
	familyID := c.Param("familyId")
	var logs []models.ActivityLog

	if err := database.DB.Preload("User").Where("family_id = ?", familyID).Order("created_at desc").Limit(100).Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// Delete item
func DeleteListItem(c *gin.Context) {
	itemID := c.Param("id")

	// Try deleting from ShoppingItem
	res1 := database.DB.Where("id = ?", itemID).Delete(&models.ShoppingItem{})
	res2 := database.DB.Where("id = ?", itemID).Delete(&models.FridgeItem{})

	if res1.Error != nil && res2.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
		return
	}

	if res1.RowsAffected == 0 && res2.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
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
