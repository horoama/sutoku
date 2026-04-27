package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// StockItem は購入済み商品の在庫を表す構造体です。
type StockItem struct {
	Base
	FamilyID         string            `gorm:"type:uuid" json:"familyId"`
	Family           *Family           `json:"family,omitempty"`
	TemplateID       string            `gorm:"type:uuid" json:"templateId"`
	Template         *ProductTemplate  `gorm:"foreignKey:TemplateID" json:"template,omitempty"`
	ShoppingItemID   *string           `gorm:"type:uuid" json:"shoppingItemId"`
	ShoppingItem     *ShoppingListItem `gorm:"foreignKey:ShoppingItemID" json:"shoppingItem,omitempty"`
	AddedByID        string            `gorm:"type:uuid" json:"addedById"`
	AddedBy          *User             `gorm:"foreignKey:AddedByID" json:"addedBy,omitempty"`
	StorageLocation  string            `json:"storageLocation"`
	ExpiryDate       *time.Time        `json:"expiryDate"` // 消費期限
	ConsumedAt       *time.Time        `json:"consumedAt"` // 消費した日時
}

// BeforeCreate はGORMのフックで、レコード作成前にUUIDを設定し、
// 未設定の場合はTemplateからデフォルト値を取得して設定します。
func (s *StockItem) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	if s.TemplateID != "" {
		var template ProductTemplate
		if err := tx.First(&template, "id = ?", s.TemplateID).Error; err == nil {
			if s.StorageLocation == "" {
				s.StorageLocation = template.DefaultStorageLocation
			}
			if s.ExpiryDate == nil && template.DefaultExpiryDays > 0 {
				expiry := time.Now().AddDate(0, 0, template.DefaultExpiryDays)
				s.ExpiryDate = &expiry
			}
		}
	}
	return nil
}

// ShoppingListItem はショッピングリストのアイテムを表す構造体です。
type ShoppingListItem struct {
	Base
	FamilyID     string           `gorm:"type:uuid" json:"familyId"`
	Family       *Family          `json:"family,omitempty"`
	TemplateID   string           `gorm:"type:uuid" json:"templateId"`
	Template     *ProductTemplate `gorm:"foreignKey:TemplateID" json:"template,omitempty"`
	AddedByID    string           `gorm:"type:uuid" json:"addedById"`
	AddedBy      *User            `gorm:"foreignKey:AddedByID" json:"addedBy,omitempty"`
	Priority     string           `gorm:"default:'medium'" json:"priority"` // 'high' / 'medium' / 'low'
	PurchaseMemo string           `json:"purchaseMemo"`                     // 購入時のメモ
	StoreHint    string           `json:"storeHint"`                        // どこで買うか
	Status       string           `gorm:"default:'pending'" json:"status"`  // 'pending' / 'checked' / 'moved'
	CheckedAt    *time.Time       `json:"checkedAt"`                        // チェック（仮購入済み）にした日時
}

// BeforeCreate はGORMのフックで、買い物アイテム作成前にUUIDを生成して設定します。
func (s *ShoppingListItem) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}
