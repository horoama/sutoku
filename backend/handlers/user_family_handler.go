package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SetupUser は初期ユーザーおよび家族（テスト環境用）を作成または取得します。
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

// GetFamilyMembers は指定された家族IDに属するメンバー一覧を取得します。
func GetFamilyMembers(c *gin.Context) {
	familyID := c.Param("familyId")
	var users []models.User

	if err := database.DB.Where("family_id = ?", familyID).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch members"})
		return
	}

	c.JSON(http.StatusOK, users)
}
