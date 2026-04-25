package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetLists は買い物リスト、冷蔵庫、消費済みアイテムをグループ化して取得します。
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
		if item.Status != "PURCHASED" {
			shopping = append(shopping, item) // Includes both PENDING and BOUGHT, but hides PURCHASED
		}
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

// AddListItem はリスト（買い物または冷蔵庫）にアイテムを追加します。
func AddListItem(c *gin.Context) {
	var input struct {
		FamilyID       string     `json:"familyId"`
		UserID         string     `json:"userId"`
		ItemTemplateID string     `json:"itemTemplateId"`
		Priority       string     `json:"priority"`
		Note           *string    `json:"note"`
		Status         string     `json:"status"` // legacy support, determines if Shopping or Fridge
		Type           string     `json:"type"`   // "shopping" or "fridge"
		EndDate        *time.Time `json:"endDate"`
		Location       string     `json:"location"`
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
		var item models.FridgeItem

		err := database.DB.Where("family_id = ? AND item_template_id = ? AND status = ?", input.FamilyID, input.ItemTemplateID, "ACTIVE").First(&item).Error
		if err == nil {
			// Update existing item
			item.StartedAt = &now
			if input.EndDate != nil {
				item.EndDate = input.EndDate
			}
			if input.Location != "" {
				item.Location = input.Location
			}
			if err := database.DB.Save(&item).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update existing fridge item"})
				return
			}
		} else {
			// Create new item
			item = models.FridgeItem{
				FamilyID:       input.FamilyID,
				ItemTemplateID: input.ItemTemplateID,
				Status:         "ACTIVE",
				StartedAt:      &now,
				DefaultDays:    template.DefaultDays,
				Location:       "FRIDGE",
			}
			if input.Location != "" {
				item.Location = input.Location
			}
			if input.EndDate != nil {
				item.EndDate = input.EndDate
			}

			if err := database.DB.Create(&item).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add fridge item"})
				return
			}
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

// UpdateListItem はリスト内のアイテムのステータスや属性を更新します。
func UpdateListItem(c *gin.Context) {
	itemID := c.Param("id")
	var input struct {
		Status         string     `json:"status"`
		Type           string     `json:"type"` // "shopping" or "fridge"
		Priority       string     `json:"priority"`
		Note           *string    `json:"note"`
		UserID         string     `json:"userId"`
		EndDate        *time.Time `json:"endDate"`
		ItemTemplateID string     `json:"itemTemplateId"`
		Location       string     `json:"location"`
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
				actionLogged = "checked"
			} else if input.Status == "PURCHASED" {
				now := time.Now()
				updates["bought_at"] = &now
				actionLogged = "bought"

				// Create a FridgeItem when sent to fridge ("PURCHASED" or similar explicit state)
				var existingFridgeItem models.FridgeItem
				err := database.DB.Where("family_id = ? AND item_template_id = ? AND status = ?", shoppingItem.FamilyID, shoppingItem.ItemTemplateID, "ACTIVE").First(&existingFridgeItem).Error

				if err == nil {
					// Update existing item
					existingFridgeItem.StartedAt = &now
					if input.EndDate != nil {
						existingFridgeItem.EndDate = input.EndDate
					}
					database.DB.Save(&existingFridgeItem)
				} else {
					// Create new item
					fridgeItem := models.FridgeItem{
						FamilyID:       shoppingItem.FamilyID,
						ItemTemplateID: shoppingItem.ItemTemplateID,
						Status:         "ACTIVE",
						StartedAt:      &now,
						DefaultDays:    shoppingItem.ItemTemplate.DefaultDays,
					}
					if input.EndDate != nil {
						fridgeItem.EndDate = input.EndDate
					}
					database.DB.Create(&fridgeItem)
				}
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

		if input.Location != "" && input.Location != fridgeItem.Location {
			updates["location"] = input.Location
		}

		if input.ItemTemplateID != "" && input.ItemTemplateID != fridgeItem.ItemTemplateID {
			updates["item_template_id"] = input.ItemTemplateID
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

// DeleteListItem はアイテムを削除します。（買い物と冷蔵庫から削除を試みます）
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
