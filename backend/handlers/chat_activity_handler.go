package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetActivityLogs は家族のアクティビティログ一覧を取得します。
func GetActivityLogs(c *gin.Context) {
	familyID := c.Param("familyId")
	var logs []models.ActivityLog

	if err := database.DB.Preload("User").Where("family_id = ?", familyID).Order("created_at desc").Limit(100).Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

// GetChatMessages は家族のチャットメッセージ一覧を取得します。
func GetChatMessages(c *gin.Context) {
	familyID := c.Param("familyId")
	var messages []models.ChatMessage

	if err := database.DB.Preload("User").Where("family_id = ?", familyID).Order("created_at desc").Limit(50).Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// SendChatMessage は新しいチャットメッセージを送信（保存）します。
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
