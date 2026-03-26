package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base model to handle UUIDs
type Base struct {
	ID        string         `gorm:"type:uuid;primary_key;" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Base) BeforeCreate(tx *gorm.DB) error {
	if base.ID == "" {
		base.ID = uuid.New().String()
	}
	return nil
}

type User struct {
	Base
	Name     string        `json:"name"`
	Email    string        `gorm:"unique" json:"email"`
	FamilyID *string       `gorm:"type:uuid" json:"familyId"`
	Family   *Family       `json:"family,omitempty"`
	Messages []ChatMessage `json:"messages,omitempty"`
}

type Family struct {
	Base
	Name            string            `json:"name"`
	Users           []User            `json:"users,omitempty"`
	ShoppingItems   []ShoppingItem    `json:"shoppingItems,omitempty"`
	FridgeItems     []FridgeItem      `json:"fridgeItems,omitempty"`
	PurchaseHistory []PurchaseHistory `json:"purchaseHistory,omitempty"`
	Messages        []ChatMessage     `json:"messages,omitempty"`
}

type Category struct {
	ID    string         `gorm:"type:uuid;primary_key;" json:"id"`
	Name  string         `json:"name"`
	Items []ItemTemplate `json:"items,omitempty"`
}

func (category *Category) BeforeCreate(tx *gorm.DB) error {
	if category.ID == "" {
		category.ID = uuid.New().String()
	}
	return nil
}

type ItemTemplate struct {
	ID              string            `gorm:"type:uuid;primary_key;" json:"id"`
	Name            string            `json:"name"`
	CategoryID      string            `gorm:"type:uuid" json:"categoryId"`
	Category        Category          `json:"category,omitempty"`
	DefaultDays     int               `gorm:"default:7" json:"defaultDays"`
	IsSystem        bool              `gorm:"default:true" json:"isSystem"`
	FamilyID        *string           `gorm:"type:uuid" json:"familyId"`
	ShoppingItems   []ShoppingItem    `json:"shoppingItems,omitempty"`
	FridgeItems     []FridgeItem      `json:"fridgeItems,omitempty"`
	PurchaseHistory []PurchaseHistory `json:"purchaseHistory,omitempty"`
}

func (item *ItemTemplate) BeforeCreate(tx *gorm.DB) error {
	if item.ID == "" {
		item.ID = uuid.New().String()
	}
	return nil
}

type ShoppingItem struct {
	Base
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`
	Family         Family       `json:"family,omitempty"`
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"`
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`
	Priority       string       `gorm:"default:'TODAY'" json:"priority"`
	Note           *string      `json:"note"`
	IsPurchased    bool         `gorm:"default:false" json:"isPurchased"`
}

type FridgeItem struct {
	ID             string       `gorm:"type:uuid;primary_key;" json:"id"`
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`
	Family         Family       `json:"family,omitempty"`
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"`
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`
	Location       string       `gorm:"default:'FRIDGE'" json:"location"`
	ExpirationDate time.Time    `json:"expirationDate"`
	AddedAt        time.Time    `gorm:"autoCreateTime" json:"addedAt"`
}

func (fridgeItem *FridgeItem) BeforeCreate(tx *gorm.DB) error {
	if fridgeItem.ID == "" {
		fridgeItem.ID = uuid.New().String()
	}
	return nil
}

type PurchaseHistory struct {
	ID             string       `gorm:"type:uuid;primary_key;" json:"id"`
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`
	Family         Family       `json:"family,omitempty"`
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"`
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`
	PurchasedAt    time.Time    `gorm:"autoCreateTime" json:"purchasedAt"`
	Price          *float64     `json:"price"`
	Quantity       int          `gorm:"default:1" json:"quantity"`
}

func (purchase *PurchaseHistory) BeforeCreate(tx *gorm.DB) error {
	if purchase.ID == "" {
		purchase.ID = uuid.New().String()
	}
	return nil
}

type ChatMessage struct {
	ID        string    `gorm:"type:uuid;primary_key;" json:"id"`
	FamilyID  string    `gorm:"type:uuid" json:"familyId"`
	Family    Family    `json:"family,omitempty"`
	UserID    string    `gorm:"type:uuid" json:"userId"`
	User      User      `json:"user,omitempty"`
	Text      string    `json:"text"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

func (chat *ChatMessage) BeforeCreate(tx *gorm.DB) error {
	if chat.ID == "" {
		chat.ID = uuid.New().String()
	}
	return nil
}
