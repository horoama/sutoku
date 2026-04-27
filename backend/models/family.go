package models

// Family はユーザーが所属する家族（グループ）を表す構造体です。
type Family struct {
	Base
	Name          string             `json:"name"`                   // 家族名
	InviteCode    string             `gorm:"unique" json:"inviteCode"`// 招待コード（ユニーク）
	Users         []User             `json:"users,omitempty"`        // 家族に所属するユーザー一覧
	ShoppingItems []ShoppingListItem `gorm:"foreignKey:FamilyID" json:"shoppingItems,omitempty"`// 家族の買い物リストアイテム
	StockItems    []StockItem        `gorm:"foreignKey:FamilyID" json:"stockItems,omitempty"`  // 家族のストックアイテム
	Messages      []ChatMessage      `json:"messages,omitempty"`     // 家族内のチャットメッセージ
	Activities    []ActivityLog      `json:"activities,omitempty"`   // 家族のアクティビティログ
}
