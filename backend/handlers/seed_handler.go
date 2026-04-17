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

	meatCategory := models.Category{Name: "meat_seafood"}
	vegCategory := models.Category{Name: "produce"}
	dairyCategory := models.Category{Name: "dairy_eggs"}
	pantryCategory := models.Category{Name: "pantry"}
	bakeryCategory := models.Category{Name: "bakery"}
	seasoningCategory := models.Category{Name: "seasoning_spices"}
	carbsCategory := models.Category{Name: "carbohydrates"}

	database.DB.Create(&meatCategory)
	database.DB.Create(&vegCategory)
	database.DB.Create(&dairyCategory)
	database.DB.Create(&pantryCategory)
	database.DB.Create(&bakeryCategory)
	database.DB.Create(&seasoningCategory)
	database.DB.Create(&carbsCategory)

	itemTemplates := []models.ItemTemplate{
		// Meat & Seafood
		{Name: "chicken_breast", CategoryID: meatCategory.ID, DefaultDays: 3, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Chicken"},
		{Name: "pork_belly", CategoryID: meatCategory.ID, DefaultDays: 4, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Pork"},
		{Name: "ground_beef", CategoryID: meatCategory.ID, DefaultDays: 2, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Beef"},
		{Name: "salmon_fillet", CategoryID: meatCategory.ID, DefaultDays: 2, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Salmon"},
		{Name: "canned_tuna", CategoryID: meatCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/FFDFD3/000000?text=Tuna"},

		// Produce
		{Name: "romaine_lettuce", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Lettuce"},
		{Name: "carrots", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Carrots"},
		{Name: "gala_apples", CategoryID: vegCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Apples"},
		{Name: "avocados", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Avocado"},
		{Name: "vine_tomatoes", CategoryID: vegCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Tomato"},
		{Name: "onions", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Onion"},
		{Name: "garlic", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Garlic"},
		{Name: "potatoes", CategoryID: vegCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Potato"},
		{Name: "spinach", CategoryID: vegCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Spinach"},
		{Name: "bananas", CategoryID: vegCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/E2F0CB/000000?text=Banana"},

		// Dairy & Eggs
		{Name: "whole_milk", CategoryID: dairyCategory.ID, DefaultDays: 7, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Milk"},
		{Name: "organic_eggs", CategoryID: dairyCategory.ID, DefaultDays: 21, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Eggs"},
		{Name: "greek_yogurt", CategoryID: dairyCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Yogurt"},
		{Name: "salted_butter", CategoryID: dairyCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Butter"},
		{Name: "cheddar_cheese", CategoryID: dairyCategory.ID, DefaultDays: 30, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4F1DE/000000?text=Cheese"},

		// Bakery
		{Name: "sourdough_loaf", CategoryID: bakeryCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bread"},
		{Name: "bagels", CategoryID: bakeryCategory.ID, DefaultDays: 5, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Bagel"},
		{Name: "tortillas", CategoryID: bakeryCategory.ID, DefaultDays: 14, IsSystem: true, ImageURL: "https://placehold.co/150x150/F4A261/000000?text=Tortilla"},

		// Carbohydrates
		{Name: "white_rice", CategoryID: carbsCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Rice"},
		{Name: "pasta", CategoryID: carbsCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Pasta"},
		{Name: "oats", CategoryID: carbsCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/E9ECEF/000000?text=Oats"},

		// Seasoning & Spices
		{Name: "salt", CategoryID: seasoningCategory.ID, DefaultDays: 730, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Salt"},
		{Name: "black_pepper", CategoryID: seasoningCategory.ID, DefaultDays: 365, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Pepper"},
		{Name: "soy_sauce", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Soy+Sauce"},
		{Name: "olive_oil", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Olive+Oil"},
		{Name: "sugar", CategoryID: seasoningCategory.ID, DefaultDays: 730, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Sugar"},
		{Name: "ketchup", CategoryID: seasoningCategory.ID, DefaultDays: 180, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Ketchup"},
		{Name: "mayonnaise", CategoryID: seasoningCategory.ID, DefaultDays: 90, IsSystem: true, ImageURL: "https://placehold.co/150x150/D3D3D3/000000?text=Mayo"},
	}

	database.DB.Create(&itemTemplates)

	c.JSON(http.StatusOK, gin.H{"message": "Seed successful"})
}
