package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.POST("/seed", handlers.SeedData)
		api.GET("/items", handlers.GetItems)
		api.POST("/item-templates", handlers.CreateItemTemplate)
		api.PUT("/item-templates/:id", handlers.UpdateItemTemplate)
		api.POST("/setup-user", handlers.SetupUser)

		api.GET("/family/:familyId/members", handlers.GetFamilyMembers)
		api.GET("/family/:familyId/logs", handlers.GetActivityLogs)

		api.GET("/lists/:familyId", handlers.GetLists)

		api.POST("/items", handlers.AddListItem)
		api.PUT("/items/:id", handlers.UpdateListItem)
		api.DELETE("/items/:id", handlers.DeleteListItem)

		api.GET("/chat/:familyId", handlers.GetChatMessages)
		api.POST("/chat", handlers.SendChatMessage)
	}
}
