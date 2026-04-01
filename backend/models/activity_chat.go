package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ActivityLog は家族内のアクション（アイテム追加、購入など）を記録するログ構造体です。
type ActivityLog struct {
	ID        string    `gorm:"type:uuid;primary_key;" json:"id"` // ログID
	FamilyID  string    `gorm:"type:uuid;index" json:"familyId"`  // 対象家族のID
	Family    Family    `json:"family,omitempty"`                 // 対象家族データ
	UserID    string    `gorm:"type:uuid;index" json:"userId"`    // アクションを行ったユーザーのID
	User      User      `json:"user,omitempty"`                   // アクションを行ったユーザーデータ
	Action    string    `json:"action"`                           // アクションの種類（例: "added", "bought", "consumed"）
	Entity    string    `json:"entity"`                           // 対象のエンティティ名（例: "牛乳"）
	Amount    *float64  `json:"amount"`                           // 金額や量（該当しない場合はnull）
	Tags      string    `json:"tags"`                             // JSONまたはカンマ区切りのタグ（例: "GROCERIES, URGENT"）
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`  // 作成日時
}

// BeforeCreate はログ作成前にUUIDを生成して設定します。
func (log *ActivityLog) BeforeCreate(tx *gorm.DB) error {
	if log.ID == "" {
		log.ID = uuid.New().String()
	}
	return nil
}

// ChatMessage は家族間のチャットメッセージを表す構造体です。
type ChatMessage struct {
	ID        string    `gorm:"type:uuid;primary_key;" json:"id"` // メッセージID
	FamilyID  string    `gorm:"type:uuid" json:"familyId"`        // 送信先家族のID
	Family    Family    `json:"family,omitempty"`                 // 送信先家族データ
	UserID    string    `gorm:"type:uuid" json:"userId"`          // 送信したユーザーのID
	User      User      `json:"user,omitempty"`                   // 送信したユーザーデータ
	Text      string    `json:"text"`                             // メッセージ内容
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`  // 送信日時
}

// BeforeCreate はチャットメッセージ作成前にUUIDを生成して設定します。
func (chat *ChatMessage) BeforeCreate(tx *gorm.DB) error {
	if chat.ID == "" {
		chat.ID = uuid.New().String()
	}
	return nil
}
