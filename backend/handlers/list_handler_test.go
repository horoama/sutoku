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
	"github.com/stretchr/testify/assert"
)

func TestGetLists(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	family := models.Family{Name: "Test Family"}
	database.DB.Create(&family)
	user := models.User{Name: "Test User", FamilyID: &family.ID}
	database.DB.Create(&user)

	template := models.ProductTemplate{Name: "Milk"}
	database.DB.Create(&template)

	shopItem := models.ShoppingListItem{FamilyID: family.ID, TemplateID: template.ID, Status: "pending", AddedByID: user.ID}
	database.DB.Create(&shopItem)

	stockItem := models.StockItem{FamilyID: family.ID, TemplateID: template.ID, AddedByID: user.ID, StorageLocation: "FRIDGE"}
	database.DB.Create(&stockItem)

	router := gin.New()
	router.GET("/lists/:familyId", handlers.GetLists)

	req, _ := http.NewRequest(http.MethodGet, "/lists/"+family.ID, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Contains(t, response, "shopping")
	assert.Contains(t, response, "stock")
}
