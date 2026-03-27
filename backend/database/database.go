package database

import (
	"log"

	"backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	db, err := gorm.Open(sqlite.Open("data/dev.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Migrate the schema
	err = db.AutoMigrate(
		&models.User{},
		&models.Family{},
		&models.Category{},
		&models.ItemTemplate{},
		&models.ListItem{},
		&models.ChatMessage{},
	)
	if err != nil {
		log.Fatal("Failed to auto migrate database:", err)
	}

	DB = db
}
