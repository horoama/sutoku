package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Category はアイテムのカテゴリーを表す構造体です。
type Category struct {
	ID    string         `gorm:"type:uuid;primary_key;" json:"id"` // カテゴリーID
	Name  string         `json:"name"`                             // カテゴリー名
	Items []ItemTemplate `json:"items,omitempty"`                  // このカテゴリーに属するアイテムテンプレート
}

// BeforeCreate はカテゴリー作成前にUUIDを生成して設定します。
func (category *Category) BeforeCreate(tx *gorm.DB) error {
	if category.ID == "" {
		category.ID = uuid.New().String()
	}
	return nil
}

// ItemTemplate は買い物リストや冷蔵庫に追加するアイテムの雛形（テンプレート）を表す構造体です。
type ItemTemplate struct {
	ID            string         `gorm:"type:uuid;primary_key;" json:"id"` // テンプレートID
	Name          string         `json:"name"`                             // アイテム名
	CategoryID    string         `gorm:"type:uuid" json:"categoryId"`      // 所属するカテゴリーのID
	Category      Category       `json:"category,omitempty"`               // 所属するカテゴリーデータ
	DefaultDays   int            `gorm:"default:7" json:"defaultDays"`     // デフォルトの消費期限（日数）
	StorageType   string         `gorm:"default:'FRIDGE'" json:"storageType"` // 保存先 ("FRIDGE" または "PANTRY")
	ImageURL      string         `json:"imageUrl"`                         // アイテムの画像URL
	IsSystem      bool           `gorm:"default:true" json:"isSystem"`     // システムデフォルトのアイテムかどうか
	FamilyID      *string        `gorm:"type:uuid" json:"familyId"`        // カスタムアイテムの場合の家族ID
	ShoppingItems []ShoppingItem `json:"shoppingItems,omitempty"`          // このテンプレートを使用した買い物アイテム
	FridgeItems   []FridgeItem   `json:"fridgeItems,omitempty"`            // このテンプレートを使用した冷蔵庫アイテム
}

// BeforeCreate はアイテムテンプレート作成前にUUIDを生成して設定します。
func (item *ItemTemplate) BeforeCreate(tx *gorm.DB) error {
	if item.ID == "" {
		item.ID = uuid.New().String()
	}
	return nil
}
