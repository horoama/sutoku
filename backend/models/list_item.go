package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// FridgeItem は冷蔵庫（または食糧庫）に保管されている実際のアイテムを表す構造体です。
type FridgeItem struct {
	Base
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`       // 所有する家族のID
	Family         Family       `json:"family,omitempty"`                // 所有する家族データ
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"` // 元となるアイテムテンプレートのID
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`          // 元となるアイテムテンプレートデータ

	Status      string     `gorm:"default:'ACTIVE'" json:"status"`   // ステータス ("ACTIVE", "CONSUMED")
	StartedAt   *time.Time `json:"startedAt"`                        // 保管開始日時
	EndDate     *time.Time `json:"endDate"`                          // 消費期限（または目標日時）
	DefaultDays int        `json:"defaultDays"`                      // 消費期限の目安日数
	Location    string     `gorm:"default:'FRIDGE'" json:"location"` // 保存先 ("FRIDGE", "PANTRY")
	SortOrder   float64    `gorm:"default:0" json:"sortOrder"`       // 並び順
}

// BeforeCreate はGORMのフックで、レコード作成前にUUIDを設定し、
// DefaultDaysが未設定の場合はItemTemplateからデフォルト日数を取得して設定します。
func (f *FridgeItem) BeforeCreate(tx *gorm.DB) error {
	if f.ID == "" {
		f.ID = uuid.New().String()
	}
	if f.DefaultDays == 0 && f.ItemTemplateID != "" {
		var template ItemTemplate
		if err := tx.First(&template, "id = ?", f.ItemTemplateID).Error; err == nil {
			f.DefaultDays = template.DefaultDays
		}
	}
	return nil
}

// ShoppingItem は買い物リストに追加されているアイテムを表す構造体です。
type ShoppingItem struct {
	Base
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`       // 所有する家族のID
	Family         Family       `json:"family,omitempty"`                // 所有する家族データ
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"` // 元となるアイテムテンプレートのID
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`          // 元となるアイテムテンプレートデータ

	Priority  string     `gorm:"default:'NORMAL'" json:"priority"` // 優先度 ("TODAY", "URGENT", "NORMAL", "LOW")
	Status    string     `gorm:"default:'PENDING'" json:"status"`  // ステータス ("PENDING", "BOUGHT", "PURCHASED")
	Note      *string    `json:"note"`                             // メモ書き
	BoughtAt  *time.Time `json:"boughtAt"`                         // 購入日時
	SortOrder float64    `gorm:"default:0" json:"sortOrder"`       // 並び順
}

// BeforeCreate はGORMのフックで、買い物アイテム作成前にUUIDを生成して設定します。
func (s *ShoppingItem) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}
