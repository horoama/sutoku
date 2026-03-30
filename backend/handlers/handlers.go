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

	database.DB.Create(&meatCategory)
	database.DB.Create(&vegCategory)
	database.DB.Create(&dairyCategory)
	database.DB.Create(&pantryCategory)
	database.DB.Create(&bakeryCategory)

	itemTemplates := []models.ItemTemplate{
		{Name: "Chicken Breast", CategoryID: meatCategory.ID, DefaultDays: 3, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZR6nYSfMTCPcm0DIbg822mhirC4zMNFYoUguvKybrMEkhyAxfsGIDfA9Hh5ZTg5egiXRUnmOrD5GETy2V8xYtcO89Gz-897f1OM-FREuoFP_Yizc3J2abYW6XgMTGdx0xmo7_uWPE6cPwXYNI45NJRDGna3hpf3IraWlYLgJCJL30iqR_BGk9Xevjvt5X2HmacO2NDiLy18mZYjg-hDClgCN2lZn5WZIhnGAEwhou9ZKbfAh6JpOTSxId5bcSo2lby1wRJnb0isOR"},
		{Name: "Romaine Lettuce", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA21PhyN_KyriPgkdWJ23qVHr99lipQBpzwLjfaKrudlApUatqdrxgSlBdfOhBONz1Y4zXapCZ8rW6wMgez0guCKVrfncwI0VYw3Hazvxi3h5hoXN4MCf5sKjYmMbf4uferEYOPmptb_2mdfbtbsaB1lbv8KiKIHF3acMpEwy_57TpHtUcyR7TwP5X2OPhh4m0616OkJVHv7CbNmF37J7GiXjcoqym7-_movAuqmmb76IhOkjQiDA6Yd3vccmGr_kNKKoc5isnuY4h"},
		{Name: "Carrots", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmEf1ocDbLzrqvFcRqmDJYImVFoG6qLxez3ejH-JIh0Vgpds626uOk6aHB_Q51lKEDLavremHnpZocce_zztN0IFPnof8Yu0AjAqauU1DlRIzlDHZn2C-8XJSV6MnkqArAhqcS3fLI8vpKPvA6jl9DEnSqrWqo97z3wgRaqNfGKQtermU53zBDDfhXRXFqn7i9KCr1o5P3ZTD8ZoQQy0z3-pzEB_Uk2aqBemhNprppUSzDXxCiEBYXb_ium0O5kIJjJVlOS86jv_98"},
		{Name: "Gala Apples", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtaJkj1EDExPCp2WlkpD2HY_9syXTGXTxhzTXz0SDAbe6xZ_yjuXsO0mRUoPcIHD5zTBRKYa9Fi0imCVfxtuJElDBDvFHFYiSjY6Ab1QLcFKNb0Iqz-8jCIqPzUMjfPOTErVo8zRCGRrc1lkT8q8evOeE6Apzf-vRrQnXAmQYqip2TDTl5lJJZP1BUb7JJ9tvzjxKkw9uZoHR2Avj608YkLtpQUP3gxgr-QqlvHlws3pU9YmMMkiq3jGvj7_0Fzr0wO9sUrDgGN9GF"},
		{Name: "Avocados", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIRJooNZM5JMscAsEkuZWyc4a2E85IjQccqEefMIf67cQbCGcUFbxE7mfcemFdPo5FobUZcSWjJh_Ru6cBEJJMZ2UG8EcAlT8HuR8pc1MQ0YI-hv5Hlm2S76FY10aQURROao-mTkq4Lv2AKbYMq2f5I9Hq1mHw5ip2nyuPqOGpw3-DhzBAyn4Ivn2rnqEiE3sQkdS-GJfUCoUznGe0CLYZGQoLznm2mgvxDwwqrq9uSJyKqfHujMXvzpWnfTPlRGYTrvIJyAzIZmgj"},
		{Name: "Vine Tomatoes", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8kkp34mw6Wt-qiNyZaQFhf9wlTQKDGN2ziPMQZR3fzr3ExFv4FIlfbsxBidCVtIZNjCWcNU1TPZ70zHUqDb9yhTSR0K8B2Uqw4GXL6E5PIituNp2IqeFYAT8U0_yT8Hwhvd1gAZ9eqPh6hfPnFa3seJhLm1hKcy1T1X64oMd0ltH3p4Idp7ES7_IMVgc-xZBZtBA6-KE9Q1uy5WqgudOQ7hzrSfW7NsZobszgdw89_yl2CJtPiP3__exBSrmbViOtqs4Eogyogc8Y"},
		{Name: "Whole Milk", CategoryID: dairyCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkGOc_Ap1YySmuNl3pCJUekeTLWcXTSOfVgu9or9HXIMe8oMKuoKMMC3d7YYBRDe1JnSdFUiisAe5iEzcjv1G52KlfIyTNAQ5qM47yYbzYncfrZh2w4ATZMxXVS2OtqlxzrCAeCfFOlUg24HljQx5rOZqVjKvqT5XikxmJfKAdr0uo5e6Ibs8lxfbVEiLbLs98SiDBWowlv58JkjDLIPZqP0FBHuo8_rgIf4qQRLqG87A7HqvdFgW_2GQj2FF9AKhbSwLgBxQ26ZdH"},
		{Name: "Organic Eggs", CategoryID: dairyCategory.ID, DefaultDays: 21, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSLzYs2y0wrPXChIsW32ulotHgEUxbCtpkuUjICxa7xGzKRcwuUPvGiYLwhoIMkvSxlV0dBMFTetPgSjlN6feLIsEkrCkS6AaWU4eSbCFfuAKeyZA0PidqaU_5cNJXonB_VyaWYJp58Gum1xqkvqCXJXi4YY1twokTlemJ_FmIzMvhewQD5EaGt3RXH9rSH80pPzB5TebM5ZfUjVZQDy1yPOINJcpRIP8qE5VDDERDE6576JjgiYlTBZ140JENDYV-qbk1TzDQFL0x"},
		{Name: "Greek Yogurt", CategoryID: dairyCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQzoIZZWjwL2nAxOc9m01GsuFBOG7ZSxAMJieeTtgjvLBsY8c1UXPgAaks5wKdcWtCo10Pa6NxwD-a0aKB9HxRF8AEph_Dc5dSoy9LwmruaoKEEZvYaURWpmT-h-cGhitk2JWDuKQCjZEHMIRiK--5cLFEQroQnV72JxE_JExKytMkMtx2OPmWvoHhPNgSqkpxSPaSExveFDza0PRb7Eq2DJiBKMBKQt8m2VuSbt8qsTYpT5DD-2SIZvQk-6Rcq9KLMK6vU03yfNYp"},
		{Name: "Salted Butter", CategoryID: dairyCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5c4XfDQYmlHRDMRocrW3tJi3GPMoYEP20wVWBlo-h_81YYd-XedM58S3xLPCwgYPo-FZF2pJFpr3U6Z-wLJfB25JRTBODucpAfj90Z4xUW07PztUVhbdzhvILqoICSNy8A_xPNhU-6pF4b1IvgZxJqqsURmLkOlnqTJ4qZz9iMVxBKaXYEo8MHCIaSff_95X3HxERQbOtR7Pdi8TjqEornVr03YswfcHL13WPATv8sU_el5khXbzH1_lSoD5VpeaI3rDOodIjqGrV"},
		{Name: "Sourdough Loaf", CategoryID: bakeryCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm56M2nO3h2qsoH2HfjNIHlpwtAo6kjNJ_DP618AZ-R4oJmNboYnZ9aegn0_nbxZLxooNSBaCjSVcLnjLA2yZOW5cecV19zSF2LtNeEH7mVfuT6sGxsSXWNR6u4chrXzoSnCcVEMA258u-1MLBYA5IFHWeHMJjoH-XK6t3M9gm2SZot3cFfsML0azHS_HgJXxNPWxJ60ApBzPzZnizNyUwwws0-xViDS8pQ-FRhA8cQvmV-uiJopjqpMS4YnS9oNBz_QJurUD7VXnb"},
		{Name: "Basmati Rice", CategoryID: pantryCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdiPNMuGIrO991dNKvSCXfJOo5S0RlZ5lQBRXPhhKsI_Iij8GZDnUAajCxXt2t5DNdGO7S492bnB6OhbEyxr7kmKy-JsPZeJWDGrq82LmcKevkAsfRISoBxMdJJEZ3wMMotUatTJ5ZVplz0Vs6sHkqJ_5CvxdYtOvMJ8X-rq2eFSzhNx5rVfDIm0QOoZpsSjMW_197DqzGW-vU8lAw3k6nqlVN_isCtzWKtCRS_dX6zg9jkLpKzsh-V5SpSZZnmQCX4qaKJlgHsljx"},
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
