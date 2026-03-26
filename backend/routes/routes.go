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
		api.POST("/setup-user", handlers.SetupUser)

		api.POST("/shopping", handlers.AddShoppingItem)
		api.GET("/shopping/:familyId", handlers.GetShoppingList)
		api.POST("/shopping/:id/purchase", handlers.PurchaseShoppingItem)

		api.GET("/history/:familyId", handlers.GetPurchaseHistory)

		api.GET("/fridge/:familyId", handlers.GetFridgeItems)

		api.GET("/chat/:familyId", handlers.GetChatMessages)
		api.POST("/chat", handlers.SendChatMessage)
	}
}
