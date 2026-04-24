package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"backend/database"
	"backend/handlers"
	"backend/models"
	"backend/testutil"

	"github.com/gin-gonic/gin"
)

func TestGetLists(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	family := models.Family{Name: "Test Family"}
	database.DB.Create(&family)

	template := models.ItemTemplate{Name: "Apple"}
	database.DB.Create(&template)

	// Shopping item (PENDING)
	database.DB.Create(&models.ShoppingItem{
		FamilyID:       family.ID,
		ItemTemplateID: template.ID,
		Status:         "PENDING",
	})

	// Stock item (ACTIVE)
	now := time.Now()
	database.DB.Create(&models.StockItem{
		FamilyID:       family.ID,
		ItemTemplateID: template.ID,
		Status:         "ACTIVE",
		StartedAt:      &now,
	})

	router := gin.New()
	router.GET("/family/:familyId/lists", handlers.GetLists)

	req, _ := http.NewRequest("GET", "/family/"+family.ID+"/lists", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status code %d, but got %d", http.StatusOK, w.Code)
	}

	var response map[string][]map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if len(response["SHOPPING"]) != 1 {
		t.Errorf("Expected 1 SHOPPING item, got %d", len(response["SHOPPING"]))
	}

	if len(response["STOCK"]) != 1 {
		t.Errorf("Expected 1 STOCK item, got %d", len(response["STOCK"]))
	}
}

func TestAddListItem_Shopping(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	family := models.Family{Name: "Test Family"}
	database.DB.Create(&family)
	user := models.User{Name: "User 1", FamilyID: &family.ID}
	database.DB.Create(&user)
	template := models.ItemTemplate{Name: "Milk"}
	database.DB.Create(&template)

	router := gin.New()
	router.POST("/list/add", handlers.AddListItem)

	payload := map[string]interface{}{
		"familyId":       family.ID,
		"userId":         user.ID,
		"itemTemplateId": template.ID,
		"type":           "shopping",
		"priority":       "HIGH",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/list/add", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status code %d, but got %d", http.StatusOK, w.Code)
	}

	var createdItem models.ShoppingItem
	if err := database.DB.First(&createdItem).Error; err != nil {
		t.Fatalf("Item not created in database: %v", err)
	}
	if createdItem.Status != "PENDING" {
		t.Errorf("Expected PENDING status, got %s", createdItem.Status)
	}
	if createdItem.Priority != "HIGH" {
		t.Errorf("Expected HIGH priority, got %s", createdItem.Priority)
	}
}

func TestAddListItem_InvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	router := gin.New()
	router.POST("/list/add", handlers.AddListItem)

	// 不正なJSONフォーマット
	invalidJSON := []byte(`{"familyId": "123", "type": "shopping",`)

	req, _ := http.NewRequest("POST", "/list/add", bytes.NewBuffer(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("Expected status code %d, but got %d", http.StatusBadRequest, w.Code)
	}
}

func TestUpdateListItem_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	router := gin.New()
	router.PUT("/list/item/:id", handlers.UpdateListItem)

	payload := map[string]interface{}{
		"status": "PURCHASED",
	}
	body, _ := json.Marshal(payload)

	// 存在しないUUIDを指定
	req, _ := http.NewRequest("PUT", "/list/item/non-existent-id", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("Expected status code %d, but got %d", http.StatusNotFound, w.Code)
	}
}

func TestDeleteListItem_NotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	router := gin.New()
	router.DELETE("/list/item/:id", handlers.DeleteListItem)

	req, _ := http.NewRequest("DELETE", "/list/item/non-existent-id", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("Expected status code %d, but got %d", http.StatusNotFound, w.Code)
	}
}
