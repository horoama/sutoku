package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base は各モデルの基本となる構造体です。
// GORMのデフォルトIDの代わりにUUIDを使用します。
type Base struct {
	ID        string         `gorm:"type:uuid;primary_key;" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// BeforeCreate はGORMのフックで、レコード作成前にUUIDを生成して設定します。
func (base *Base) BeforeCreate(tx *gorm.DB) error {
	if base.ID == "" {
		base.ID = uuid.New().String()
	}
	return nil
}
