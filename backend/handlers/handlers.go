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
	var items []models.ListItem

	if err := database.DB.Preload("ItemTemplate").Where("family_id = ?", familyID).Order("updated_at desc").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lists"})
		return
	}

	shopping := []models.ListItem{}
	fridge := []models.ListItem{}
	consumed := []models.ListItem{}

	for _, item := range items {
		switch item.Status {
		case "SHOPPING":
			shopping = append(shopping, item)
		case "FRIDGE":
			fridge = append(fridge, item)
		case "CONSUMED":
			consumed = append(consumed, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"SHOPPING": shopping,
		"FRIDGE":   fridge,
		"CONSUMED": consumed,
	})
}

// Add Item to List (Default: SHOPPING)
func AddListItem(c *gin.Context) {
	var input struct {
		FamilyID       string  `json:"familyId"`
		UserID         string  `json:"userId"`
		ItemTemplateID string  `json:"itemTemplateId"`
		Priority       string  `json:"priority"`
		Note           *string `json:"note"`
		Status         string  `json:"status"`
		Location       string  `json:"location"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.Status == "" {
		input.Status = "SHOPPING"
	}

	if input.Priority == "" {
		input.Priority = "NORMAL"
	}

	if input.Location == "" {
		input.Location = "FRIDGE"
	}

	item := models.ListItem{
		FamilyID:       input.FamilyID,
		ItemTemplateID: input.ItemTemplateID,
		Status:         input.Status,
		Priority:       input.Priority,
		Note:           input.Note,
		Location:       input.Location,
	}

	var template models.ItemTemplate
	database.DB.First(&template, "id = ?", input.ItemTemplateID)

	// Auto-calculate expiration date if directly added to fridge/pantry
	if input.Status == "FRIDGE" {
		exp := time.Now().AddDate(0, 0, template.DefaultDays)
		item.ExpirationDate = &exp
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item"})
		return
	}

	database.DB.Preload("ItemTemplate").First(&item, "id = ?", item.ID)

	// Log the activity if userID is provided
	if input.UserID != "" {
		action := "added"
		if input.Status == "FRIDGE" {
			action = "stocked"
		}

		logEntry := models.ActivityLog{
			FamilyID: input.FamilyID,
			UserID:   input.UserID,
			Action:   action,
			Entity:   template.Name,
			Tags:     input.Status + "," + input.Priority,
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
		Price    *float64   `json:"price"`
		Quantity *int       `json:"quantity"`
		Location string     `json:"location"`
		Priority string     `json:"priority"`
		Note     *string    `json:"note"`
		UserID   string     `json:"userId"`
		ExpDate  *time.Time `json:"expirationDate"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var item models.ListItem
	if err := database.DB.Preload("ItemTemplate").Where("id = ?", itemID).First(&item).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	updates := map[string]interface{}{}
	actionLogged := ""

	if input.Status != "" && input.Status != item.Status {
		updates["status"] = input.Status

		// When moving to FRIDGE, set Expiration Date if it doesn't have one
		if input.Status == "FRIDGE" {
			actionLogged = "bought"
			if item.ExpirationDate == nil {
				exp := time.Now().AddDate(0, 0, item.ItemTemplate.DefaultDays)
				updates["expiration_date"] = exp
			}
		}

		// When moving to CONSUMED, set quantity and price if provided
		if input.Status == "CONSUMED" {
			actionLogged = "consumed"
			if input.Quantity != nil {
				updates["quantity"] = *input.Quantity
			}
			if input.Price != nil {
				updates["price"] = *input.Price
			}
		}
	} else {
		// Just updating fields without moving
		if input.Quantity != nil {
			updates["quantity"] = *input.Quantity
		}
		if input.Price != nil {
			updates["price"] = *input.Price
		}
	}

	if input.Location != "" && input.Location != item.Location {
		updates["location"] = input.Location
		actionLogged = "moved"
	}

	if input.Priority != "" && input.Priority != item.Priority {
		updates["priority"] = input.Priority
	}

	if input.ExpDate != nil {
		updates["expiration_date"] = input.ExpDate
		actionLogged = "marked_expiring"
	}

	if err := database.DB.Model(&item).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}

	database.DB.Preload("ItemTemplate").First(&item, "id = ?", item.ID)

	if actionLogged != "" && input.UserID != "" {
		logEntry := models.ActivityLog{
			FamilyID: item.FamilyID,
			UserID:   input.UserID,
			Action:   actionLogged,
			Entity:   item.ItemTemplate.Name,
			Amount:   input.Price,
		}
		database.DB.Create(&logEntry)
	}

	c.JSON(http.StatusOK, item)
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

	if err := database.DB.Where("id = ?", itemID).Delete(&models.ListItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
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
