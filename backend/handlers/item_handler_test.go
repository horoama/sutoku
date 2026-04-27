package handlers_test

import (
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

func TestGetItems(t *testing.T) {
	gin.SetMode(gin.TestMode)
	testutil.SetupTestDB()
	defer testutil.ClearTables()

	family := models.Family{Name: "Test Family"}
	database.DB.Create(&family)

	category := models.Category{Name: "Test Category"}
	database.DB.Create(&category)

	template := models.ProductTemplate{
		Name:                   "System Item",
		CategoryID:             category.ID,
		DefaultExpiryDays:      3,
		DefaultStorageLocation: "FRIDGE",
		Memo:                   "",
	}
	database.DB.Create(&template)

	router := gin.New()
	router.GET("/items", handlers.GetItems)

	req, _ := http.NewRequest(http.MethodGet, "/items?familyId="+family.ID, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
