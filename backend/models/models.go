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
	CustomerName string    `json:"customerName"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	OrderType    string    `json:"orderType"` // "Pickup" or "Delivery"
	Address      string    `json:"address"`
	TotalAmount  float64   `json:"totalAmount"`
	ItemsJSON    string    `json:"itemsJson"` // serialized list of items
	Status       string    `json:"status"`    // "Pending", "Completed", "Cancelled"
	CreatedAt    time.Time `json:"createdAt"`
}
