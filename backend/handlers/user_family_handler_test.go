package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/database"
	"backend/handlers"
	"backend/models"
	"backend/testutil"

	"github.com/gin-gonic/gin"
)

func TestSetupUser_NewUser(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	router := gin.New()
	router.POST("/setup-user", handlers.SetupUser)

	payload := map[string]interface{}{
		"email":     "test@example.com",
		"name":      "Test User",
		"avatarUrl": "http://example.com/avatar.jpg",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/setup-user", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status code %d, but got %d", http.StatusOK, w.Code)
	}

	var response struct {
		User   models.User   `json:"user"`
		Family models.Family `json:"family"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if response.User.Email != "test@example.com" {
		t.Errorf("Expected email test@example.com, got %s", response.User.Email)
	}
	if response.Family.Name != "Test Family" {
		t.Errorf("Expected family name 'Test Family', got %s", response.Family.Name)
	}

	// Ensure they are correctly saved in DB
	var dbUser models.User
	if err := database.DB.Where("email = ?", "test@example.com").First(&dbUser).Error; err != nil {
		t.Errorf("Failed to find user in db")
	}
}
