package handlers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SeedData はデータベースに初期カテゴリやデフォルトのアイテムテンプレートを登録します。
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
		{Name: "Chicken Breast", CategoryID: meatCategory.ID, DefaultDays: 3, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Chicken"},
		{Name: "Pork Belly", CategoryID: meatCategory.ID, DefaultDays: 4, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Pork"},
		{Name: "Ground Beef", CategoryID: meatCategory.ID, DefaultDays: 2, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Beef"},
		{Name: "Salmon Fillet", CategoryID: meatCategory.ID, DefaultDays: 2, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Salmon"},
		{Name: "Canned Tuna", CategoryID: meatCategory.ID, DefaultDays: 365, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Tuna"},

		// Produce
		{Name: "Romaine Lettuce", CategoryID: vegCategory.ID, DefaultDays: 7, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Lettuce"},
		{Name: "Carrots", CategoryID: vegCategory.ID, DefaultDays: 14, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Carrots"},
		{Name: "Gala Apples", CategoryID: vegCategory.ID, DefaultDays: 14, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Apples"},
		{Name: "Avocados", CategoryID: vegCategory.ID, DefaultDays: 7, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Avocado"},
		{Name: "Vine Tomatoes", CategoryID: vegCategory.ID, DefaultDays: 7, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Tomato"},
		{Name: "Onions", CategoryID: vegCategory.ID, DefaultDays: 30, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Onion"},
		{Name: "Garlic", CategoryID: vegCategory.ID, DefaultDays: 30, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Garlic"},
		{Name: "Potatoes", CategoryID: vegCategory.ID, DefaultDays: 30, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Potato"},
		{Name: "Spinach", CategoryID: vegCategory.ID, DefaultDays: 5, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Spinach"},
		{Name: "Bananas", CategoryID: vegCategory.ID, DefaultDays: 5, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Banana"},

		// Dairy & Eggs
		{Name: "Whole Milk", CategoryID: dairyCategory.ID, DefaultDays: 7, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Milk"},
		{Name: "Organic Eggs", CategoryID: dairyCategory.ID, DefaultDays: 21, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Eggs"},
		{Name: "Greek Yogurt", CategoryID: dairyCategory.ID, DefaultDays: 14, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Yogurt"},
		{Name: "Salted Butter", CategoryID: dairyCategory.ID, DefaultDays: 30, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Butter"},
		{Name: "Cheddar Cheese", CategoryID: dairyCategory.ID, DefaultDays: 30, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Cheese"},

		// Bakery
		{Name: "Sourdough Loaf", CategoryID: bakeryCategory.ID, DefaultDays: 5, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bread"},
		{Name: "Bagels", CategoryID: bakeryCategory.ID, DefaultDays: 5, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bagel"},
		{Name: "Tortillas", CategoryID: bakeryCategory.ID, DefaultDays: 14, StorageType: "STOCK", IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Tortilla"},

		// Carbohydrates
		{Name: "White Rice", CategoryID: carbsCategory.ID, DefaultDays: 180, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Rice"},
		{Name: "Pasta", CategoryID: carbsCategory.ID, DefaultDays: 365, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Pasta"},
		{Name: "Oats", CategoryID: carbsCategory.ID, DefaultDays: 180, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Oats"},

		// Seasoning & Spices
		{Name: "Salt", CategoryID: seasoningCategory.ID, DefaultDays: 730, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Salt"},
		{Name: "Black Pepper", CategoryID: seasoningCategory.ID, DefaultDays: 365, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Pepper"},
		{Name: "Soy Sauce", CategoryID: seasoningCategory.ID, DefaultDays: 180, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Soy+Sauce"},
		{Name: "Olive Oil", CategoryID: seasoningCategory.ID, DefaultDays: 180, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Olive+Oil"},
		{Name: "Sugar", CategoryID: seasoningCategory.ID, DefaultDays: 730, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Sugar"},
		{Name: "Ketchup", CategoryID: seasoningCategory.ID, DefaultDays: 180, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Ketchup"},
		{Name: "Mayonnaise", CategoryID: seasoningCategory.ID, DefaultDays: 90, StorageType: "PANTRY", IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Mayo"},
	}

	database.DB.Create(&itemTemplates)

	c.JSON(http.StatusOK, gin.H{"message": "Seed successful"})
}
