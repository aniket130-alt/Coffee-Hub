package models

import (
	"time"
)

// SiteSettings stores global, softcoded site configuration
type SiteSettings struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	SiteName         string    `json:"siteName"`
	LogoURL          string    `json:"logoUrl"`
	HeroHeading      string    `json:"heroHeading"`
	HeroSubheading   string    `json:"heroSubheading"`
	HeroImageURL     string    `json:"heroImageUrl"`
	HeroBtnText      string    `json:"heroBtnText"`
	HeroBtnLink      string    `json:"heroBtnLink"`
	AboutHeading     string    `json:"aboutHeading"`
	AboutSubheading  string    `json:"aboutSubheading"`
	AboutStory1      string    `json:"aboutStory1"`
	AboutStory2      string    `json:"aboutStory2"`
	AboutStory3      string    `json:"aboutStory3"`
	AboutImageURL    string    `json:"aboutImageUrl"`
	AboutBtnText     string    `json:"aboutBtnText"`
	Phone            string    `json:"phone"`
	Email            string    `json:"email"`
	Address          string    `json:"address"`
	ContactNote      string    `json:"contactNote"`
	SocialTwitter    string    `json:"socialTwitter"`
	SocialFacebook   string    `json:"socialFacebook"`
	SocialInstagram  string    `json:"socialInstagram"`
	SocialYoutube    string    `json:"socialYoutube"`
	SocialPinterest  string    `json:"socialPinterest"`
	FooterCreditName string    `json:"footerCreditName"`
	FooterCreditLink string    `json:"footerCreditLink"`
	CopyrightText    string    `json:"copyrightText"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// Category represents top categories cards
type Category struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	ImageURL  string    `json:"imageUrl"`
	SortOrder int       `json:"sortOrder"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// MenuItem represents coffee/food items in the menu section
type MenuItem struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	Price         float64   `json:"price"`
	OriginalPrice float64   `json:"originalPrice"`
	Rating        int       `json:"rating"` // 1 to 5
	ImageURL      string    `json:"imageUrl"`
	Description   string    `json:"description"`
	IsAvailable   bool      `json:"isAvailable"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// Product represents packaged coffee beans and branded items
type Product struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Name          string    `json:"name"`
	Price         float64   `json:"price"`
	OriginalPrice float64   `json:"originalPrice"`
	ImageURL      string    `json:"imageUrl"`
	Description   string    `json:"description"`
	Badge         string    `json:"badge"` // e.g. "Popular", "Bestseller", "New"
	IsAvailable   bool      `json:"isAvailable"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// GalleryItem represents image gallery items
type GalleryItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	ImageURL  string    `json:"imageUrl"`
	SortOrder int       `json:"sortOrder"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// BlogPost represents news/blog entries
type BlogPost struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	Date      string    `json:"date"`
	Summary   string    `json:"summary"`
	Content   string    `json:"content"`
	ImageURL  string    `json:"imageUrl"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// User represents customer accounts
type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Name          string    `json:"name"`
	Email         string    `gorm:"uniqueIndex" json:"email"`
	Password      string    `json:"-"` // Omit password in JSON responses
	Phone         string    `json:"phone"`
	AddressesJSON string    `json:"addressesJson"` // Serialized JSON array of saved addresses
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// Hub represents coffee store branches / hubs
type Hub struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	City      string    `json:"city"`
	Pincode   string    `json:"pincode"`
	Phone     string    `json:"phone"`
	ImageURL  string    `json:"imageUrl"`
	Hours     string    `json:"hours"`
	IsActive  bool      `json:"isActive"`
	CreatedAt time.Time `json:"createdAt"`
}

// ContactMessage records inquiries submitted through the contact form
type ContactMessage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Message   string    `json:"message"`
	IsRead    bool      `json:"isRead"`
	CreatedAt time.Time `json:"createdAt"`
}

// Order represents customer cart orders
type Order struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       *uint     `json:"userId"`
	CustomerName string    `json:"customerName"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	OrderType    string    `json:"orderType"` // "Delivery", "Dine-in", or "Pickup"
	TableNo      string    `json:"tableNo"`   // Applicable when OrderType is "Dine-in"
	Address      string    `json:"address"`
	HubName      string    `json:"hubName"`   // Nearest or selected coffee hub
	TotalAmount  float64   `json:"totalAmount"`
	ItemsJSON    string    `json:"itemsJson"` // serialized list of items
	Status       string    `json:"status"`    // "Pending", "Preparing", "Completed", "Cancelled"
	CreatedAt    time.Time `json:"createdAt"`
}
