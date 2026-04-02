package models

// User はアプリケーションのユーザーを表す構造体です。
type User struct {
	Base
	Name      string        `json:"name"`                                 // ユーザー名
	Email     string        `gorm:"unique" json:"email"`                  // メールアドレス（ユニーク）
	FamilyID  *string       `gorm:"type:uuid" json:"familyId"`            // 所属する家族のID
	Family    *Family       `json:"family,omitempty"`                     // 所属する家族のデータ
	Messages  []ChatMessage `json:"messages,omitempty"`                   // ユーザーが送信したメッセージ
	Role      string        `gorm:"default:'member'" json:"role"`         // 役割 ("admin", "member", "guest")
	AvatarURL string        `json:"avatarUrl"`                            // アバター画像のURL
}
