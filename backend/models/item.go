package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Category はアイテムのカテゴリーを表す構造体です。
type Category struct {
	ID    string            `gorm:"type:uuid;primary_key;" json:"id"` // カテゴリーID
	Name  string            `json:"name"`                             // カテゴリー名
	Items []ProductTemplate `gorm:"foreignKey:CategoryID" json:"items,omitempty"` // このカテゴリーに属するアイテムテンプレート
}

// BeforeCreate はカテゴリー作成前にUUIDを生成して設定します。
func (category *Category) BeforeCreate(tx *gorm.DB) error {
	if category.ID == "" {
		category.ID = uuid.New().String()
	}
	return nil
}

// ProductTemplate は商品のマスターデータを表す構造体です。
type ProductTemplate struct {
	Base
	FamilyID               *string            `gorm:"type:uuid" json:"familyId"`                  // NULLはシステム提供テンプレート
	Family                 *Family            `json:"family,omitempty"`
	CreatedByID            *string            `gorm:"type:uuid" json:"createdById"`               // NULLはシステム提供テンプレート
	CreatedBy              *User              `gorm:"foreignKey:CreatedByID" json:"createdBy,omitempty"`
	SourceTemplateID       *string            `gorm:"type:uuid" json:"sourceTemplateId"`          // システムテンプレートをベースに作成した場合のID
	SourceTemplate         *ProductTemplate   `gorm:"foreignKey:SourceTemplateID" json:"sourceTemplate,omitempty"`
	Name                   string             `json:"name"`                                       // 商品名
	DefaultExpiryDays      int                `json:"defaultExpiryDays"`                          // デフォルトの消費期限（日数）
	DefaultStorageLocation string             `json:"defaultStorageLocation"`                     // デフォルトの保管場所（例: 冷蔵庫、パントリー）
	Memo                   string             `json:"memo"`                                       // メモ
	ImageURL               string             `json:"imageUrl"`                                   // 商品画像URL
	CategoryID             string             `gorm:"type:uuid" json:"categoryId"`                // 所属するカテゴリーのID
	Category               *Category          `json:"category,omitempty"`
	ShoppingListItems      []ShoppingListItem `gorm:"foreignKey:TemplateID" json:"shoppingListItems,omitempty"`
	StockItems             []StockItem        `gorm:"foreignKey:TemplateID" json:"stockItems,omitempty"`
}

// BeforeCreate はアイテムテンプレート作成前にUUIDを生成して設定します。
func (item *ProductTemplate) BeforeCreate(tx *gorm.DB) error {
	if item.ID == "" {
		item.ID = uuid.New().String()
	}
	return nil
}
