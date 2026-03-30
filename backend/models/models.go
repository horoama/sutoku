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
	Role     string        `gorm:"default:'member'" json:"role"` // "admin", "member", "guest"
	AvatarURL string       `json:"avatarUrl"`
}

type Family struct {
	Base
	Name       string        `json:"name"`
	InviteCode string        `gorm:"unique" json:"inviteCode"`
	Users         []User         `json:"users,omitempty"`
	ShoppingItems []ShoppingItem `json:"shoppingItems,omitempty"`
	FridgeItems   []FridgeItem   `json:"fridgeItems,omitempty"`
	Messages      []ChatMessage  `json:"messages,omitempty"`
	Activities []ActivityLog `json:"activities,omitempty"`
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
	ID          string     `gorm:"type:uuid;primary_key;" json:"id"`
	Name        string     `json:"name"`
	CategoryID  string     `gorm:"type:uuid" json:"categoryId"`
	Category    Category   `json:"category,omitempty"`
	DefaultDays int        `gorm:"default:7" json:"defaultDays"`
	ImageURL    string     `json:"imageUrl"`
	IsSystem    bool       `gorm:"default:true" json:"isSystem"`
	FamilyID      *string        `gorm:"type:uuid" json:"familyId"`
	ShoppingItems []ShoppingItem `json:"shoppingItems,omitempty"`
	FridgeItems   []FridgeItem   `json:"fridgeItems,omitempty"`
}

func (item *ItemTemplate) BeforeCreate(tx *gorm.DB) error {
	if item.ID == "" {
		item.ID = uuid.New().String()
	}
	return nil
}

type FridgeItem struct {
	Base
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`
	Family         Family       `json:"family,omitempty"`
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"`
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`

	Status      string     `gorm:"default:'ACTIVE'" json:"status"` // "ACTIVE", "CONSUMED"
	StartedAt   *time.Time `json:"startedAt"`
	EndDate     *time.Time `json:"endDate"`
	DefaultDays int        `json:"defaultDays"`
}

// BeforeCreate will set a UUID, and initialize DefaultDays from ItemTemplate if not set.
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

type ShoppingItem struct {
	Base
	FamilyID       string       `gorm:"type:uuid" json:"familyId"`
	Family         Family       `json:"family,omitempty"`
	ItemTemplateID string       `gorm:"type:uuid" json:"itemTemplateId"`
	ItemTemplate   ItemTemplate `json:"itemTemplate,omitempty"`

	Priority string     `gorm:"default:'NORMAL'" json:"priority"` // "TODAY", "URGENT", "NORMAL", "LOW"
	Status   string     `gorm:"default:'PENDING'" json:"status"`  // "PENDING", "BOUGHT"
	Note     *string    `json:"note"`
	BoughtAt *time.Time `json:"boughtAt"`
}

func (s *ShoppingItem) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

type ActivityLog struct {
	ID        string    `gorm:"type:uuid;primary_key;" json:"id"`
	FamilyID  string    `gorm:"type:uuid;index" json:"familyId"`
	Family    Family    `json:"family,omitempty"`
	UserID    string    `gorm:"type:uuid;index" json:"userId"`
	User      User      `json:"user,omitempty"`
	Action    string    `json:"action"` // e.g., "added", "bought", "marked_expiring", "cleared"
	Entity    string    `json:"entity"` // e.g., "Organic Whole Milk", "Produce Drawer"
	Amount    *float64  `json:"amount"` // e.g., cost, null if N/A
	Tags      string    `json:"tags"`   // JSON or comma separated e.g. "GROCERIES, URGENT"
	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
}

func (log *ActivityLog) BeforeCreate(tx *gorm.DB) error {
	if log.ID == "" {
		log.ID = uuid.New().String()
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
