package handlers_test

import (
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

func TestGetItems(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	// テストデータの準備
	cat := models.Category{Name: "Dairy"}
	database.DB.Create(&cat)

	itemTemplate := models.ItemTemplate{
		CategoryID:  cat.ID,
		Name:        "Milk",
		DefaultDays: 7,
	}
	database.DB.Create(&itemTemplate)

	router := gin.New()
	router.GET("/items", handlers.GetItems)

	req, _ := http.NewRequest("GET", "/items", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status code %d, but got %d", http.StatusOK, w.Code)
	}

	var categories []handlers.CategoryResponse
	if err := json.Unmarshal(w.Body.Bytes(), &categories); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if len(categories) != 1 {
		t.Fatalf("Expected 1 category, got %d", len(categories))
	}

	if categories[0].Name != "Dairy" {
		t.Errorf("Expected category 'Dairy', got '%s'", categories[0].Name)
	}

	if len(categories[0].Items) != 1 {
		t.Fatalf("Expected 1 item template in category, got %d", len(categories[0].Items))
	}

	if categories[0].Items[0].Name != "Milk" {
		t.Errorf("Expected item 'Milk', got '%s'", categories[0].Items[0].Name)
	}
}
