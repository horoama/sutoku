package testutil

import (
	"log"

	"backend/database"
	"backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// SetupTestDB initializes an in-memory SQLite database for testing.
func SetupTestDB() {
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to test database: %v", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Family{},
		&models.Category{},
		&models.ItemTemplate{},
		&models.FridgeItem{},
		&models.ShoppingItem{},
		&models.ActivityLog{},
		&models.ChatMessage{},
	)
	if err != nil {
		log.Fatalf("Failed to auto migrate test database: %v", err)
	}

	database.DB = db
}

// ClearTables removes all data from the tables to ensure a clean state for each test.
func ClearTables() {
	if database.DB == nil {
		return
	}
	tables := []interface{}{
		&models.ChatMessage{},
		&models.ActivityLog{},
		&models.ShoppingItem{},
		&models.FridgeItem{},
		&models.ItemTemplate{},
		&models.Category{},
		&models.User{},
		&models.Family{},
	}
	for _, table := range tables {
		database.DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(table)
	}
}
