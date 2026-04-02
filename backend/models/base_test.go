package models_test

import (
	"testing"

	"backend/models"
	"backend/testutil"
	"backend/database"
)

func TestBaseBeforeCreateHook(t *testing.T) {
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	// ユーザーモデルを作成して、BeforeCreateが呼び出されID（UUID）が付与されるかテストする
	user := models.User{
		Name:  "Test User",
		Email: "test@example.com",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}

	if user.ID == "" {
		t.Errorf("Expected ID to be populated with UUID, but got empty string")
	}
}
