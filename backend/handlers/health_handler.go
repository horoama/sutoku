package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck はサーバーの稼働状態を確認するエンドポイントです。
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
