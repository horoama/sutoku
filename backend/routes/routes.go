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

		api.POST("/shopping-items", handlers.AddShoppingItem)
		api.PUT("/shopping-items/:id", handlers.UpdateShoppingItem)
		api.PUT("/shopping-items/:id/status", handlers.UpdateShoppingItemStatus)
		api.POST("/shopping-items/:id/move", handlers.MoveToStock)
		api.DELETE("/shopping-items/:id", handlers.DeleteShoppingItem)

		api.POST("/stock-items", handlers.AddStockItem)
		api.PUT("/stock-items/:id", handlers.UpdateStockItem)
		api.PUT("/stock-items/:id/consume", handlers.ConsumeStockItem)
		api.DELETE("/stock-items/:id", handlers.DeleteStockItem)

		api.GET("/chat/:familyId", handlers.GetChatMessages)
		api.POST("/chat", handlers.SendChatMessage)
	}
}
