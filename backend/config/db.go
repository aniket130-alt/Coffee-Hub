package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"coffeeshop-backend/models"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB initializes database connection with PostgreSQL first, and pure-Go SQLite fallback
func InitDB() *gorm.DB {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		host := os.Getenv("DB_HOST")
		if host == "" {
			host = "localhost"
		}
		user := os.Getenv("DB_USER")
		if user == "" {
			user = "postgres"
		}
		password := os.Getenv("DB_PASSWORD")
		if password == "" {
			password = "postgres"
		}
		dbname := os.Getenv("DB_NAME")
		if dbname == "" {
			dbname = "coffeeshop"
		}
		port := os.Getenv("DB_PORT")
		if port == "" {
			port = "5432"
		}
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC", host, user, password, dbname, port)
	}

	// Attempt connection to PostgreSQL
	log.Println("[DB] Connecting to PostgreSQL...")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})

	if err != nil {
		log.Printf("[DB] Warning: PostgreSQL connection failed: %v", err)
		log.Println("[DB] Falling back to embedded persistent database (coffeeshop.db)...")
		log.Println("[DB] (To connect to PostgreSQL later, set the DATABASE_URL environment variable)")

		db, err = gorm.Open(sqlite.Open("coffeeshop.db"), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err != nil {
			log.Fatalf("[DB] Fatal error: Failed to initialize embedded database: %v", err)
		}
		log.Println("[DB] Connected successfully to embedded database (coffeeshop.db).")
	} else {
		log.Println("[DB] Connected successfully to PostgreSQL.")
	}

	DB = db

	// Auto-migrate tables
	err = DB.AutoMigrate(
		&models.SiteSettings{},
		&models.Category{},
		&models.MenuItem{},
		&models.Product{},
		&models.GalleryItem{},
		&models.BlogPost{},
		&models.ContactMessage{},
		&models.Order{},
	)
	if err != nil {
		log.Fatalf("[DB] Migration failed: %v", err)
	}
	log.Println("[DB] Schema auto-migrated successfully.")

	// Seed initial data if database is empty
	SeedData()

	return DB
}

// SeedData populates initial softcoded data matching the original website template
func SeedData() {
	var settingsCount int64
	DB.Model(&models.SiteSettings{}).Count(&settingsCount)

	if settingsCount == 0 {
		log.Println("[DB] Seeding initial softcoded content...")
		initialSettings := models.SiteSettings{
			SiteName:         "Coffee Shop",
			LogoURL:          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80",
			HeroHeading:      "Start Your Day With a\nFresh Coffee",
			HeroSubheading:   "Experience artisanal coffee brewed to perfection from hand-selected beans sourced across the world.",
			HeroImageURL:     "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=80",
			HeroBtnText:      "Shop Now",
			HeroBtnLink:      "#menu",
			AboutHeading:     "About Us",
			AboutSubheading:  "What Makes Our Coffee Special?",
			AboutStory1:      "We roast small-batch specialty coffee with meticulous attention to origin, profile, and flavor balance. Every single bean is carefully selected to guarantee an unforgettable morning ritual.",
			AboutStory2:      "From single-origin Ethiopian varieties to rich velvet espresso blends, our brewmasters craft each cup with passionate precision and sustainable sourcing practices.",
			AboutStory3:      "Step inside our warm, aromatic cafe or order your favorite beans straight to your door. Freshness, community, and pure craft.",
			AboutImageURL:    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80",
			AboutBtnText:     "Learn More",
			Phone:            "+91 00000 00000",
			Email:            "coffeeshop@gmail.com",
			Address:          "Shahpur Jat, Delhi, India",
			ContactNote:      "Visit us anytime or send us your feedback and custom catering inquiries.",
			SocialTwitter:    "https://twitter.com",
			SocialFacebook:   "https://facebook.com",
			SocialInstagram:  "https://instagram.com",
			SocialYoutube:    "https://youtube.com",
			SocialPinterest:  "https://pinterest.com",
			FooterCreditName: "Aniket",
			FooterCreditLink: "#",
			CopyrightText:    "© Copyright Coffee Shop. All Rights Reserved",
			UpdatedAt:        time.Now(),
		}
		DB.Create(&initialSettings)

		// Seed Top Categories
		categories := []models.Category{
			{
				Title:     "Hot Brews & Espresso",
				ImageURL:  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80",
				SortOrder: 1,
			},
			{
				Title:     "Cold Brews & Frappes",
				ImageURL:  "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
				SortOrder: 2,
			},
			{
				Title:     "Artisanal Pastries",
				ImageURL:  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
				SortOrder: 3,
			},
		}
		for _, cat := range categories {
			DB.Create(&cat)
		}

		// Seed Menu Items
		menuItems := []models.MenuItem{
			{
				Name:          "Artisan Espresso",
				Category:      "Hot Brews",
				Price:         99,
				OriginalPrice: 100,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
				Description:   "Pure, rich double shot of espresso with thick crema.",
				IsAvailable:   true,
			},
			{
				Name:          "Velvet Cappuccino",
				Category:      "Hot Brews",
				Price:         90,
				OriginalPrice: 110,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80",
				Description:   "Classic balanced espresso with silky steamed milk and microfoam.",
				IsAvailable:   true,
			},
			{
				Name:          "Caramel Macchiato",
				Category:      "Hot Brews",
				Price:         100,
				OriginalPrice: 200,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80",
				Description:   "Vanilla infused espresso topped with caramel drizzle.",
				IsAvailable:   true,
			},
			{
				Name:          "Mocha Delight",
				Category:      "Specialty",
				Price:         120,
				OriginalPrice: 150,
				Rating:        4,
				ImageURL:      "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80",
				Description:   "Dark chocolate folded with fresh espresso and whipped cream.",
				IsAvailable:   true,
			},
			{
				Name:          "Pour Over Reserve",
				Category:      "Filter",
				Price:         200,
				OriginalPrice: 300,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80",
				Description:   "Handcrafted single origin pour over showcasing fruity notes.",
				IsAvailable:   true,
			},
			{
				Name:          "Classic Americano",
				Category:      "Hot Brews",
				Price:         30,
				OriginalPrice: 50,
				Rating:        4,
				ImageURL:      "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop&q=80",
				Description:   "Crisp espresso stretched with boiling mountain water.",
				IsAvailable:   true,
			},
			{
				Name:          "Cold Brew Nitro",
				Category:      "Cold Brews",
				Price:         100,
				OriginalPrice: 200,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
				Description:   "Slow steeped for 24 hours and infused with smooth nitrogen.",
				IsAvailable:   true,
			},
			{
				Name:          "Spanish Latte",
				Category:      "Hot Brews",
				Price:         120,
				OriginalPrice: 150,
				Rating:        5,
				ImageURL:      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
				Description:   "Sweet condensed milk layered with bold dark roast.",
				IsAvailable:   true,
			},
		}
		for _, item := range menuItems {
			DB.Create(&item)
		}

		// Seed Products
		products := []models.Product{
			{
				Name:          "Arabica Reserve Beans (500g)",
				Price:         120,
				OriginalPrice: 150,
				ImageURL:      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80",
				Description:   "100% Arabica washed whole beans with notes of almond and cocoa.",
				Badge:         "Bestseller",
				IsAvailable:   true,
			},
			{
				Name:          "Signature Cappuccino Blend (1kg)",
				Price:         250,
				OriginalPrice: 350,
				ImageURL:      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
				Description:   "Medium-dark espresso roast optimized for milk beverages.",
				Badge:         "Top Pick",
				IsAvailable:   true,
			},
			{
				Name:          "Obsidian Black Coffee Roast (500g)",
				Price:         130,
				OriginalPrice: 150,
				ImageURL:      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
				Description:   "Heavy body, smoky chocolate aroma and zero acidity.",
				Badge:         "Popular",
				IsAvailable:   true,
			},
			{
				Name:          "Mountain Decaf Roast (500g)",
				Price:         120,
				OriginalPrice: 150,
				ImageURL:      "https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=600&auto=format&fit=crop&q=80",
				Description:   "Swiss water processed chemical-free decaffeinated coffee.",
				Badge:         "Decaf",
				IsAvailable:   true,
			},
		}
		for _, p := range products {
			DB.Create(&p)
		}

		// Seed Gallery Items
		galleryItems := []models.GalleryItem{
			{Title: "Fresh Roasting", ImageURL: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80", SortOrder: 1},
			{Title: "Barista Pour", ImageURL: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80", SortOrder: 2},
			{Title: "Latte Art Passion", ImageURL: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80", SortOrder: 3},
			{Title: "Morning Pastries", ImageURL: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80", SortOrder: 4},
			{Title: "Cafe Interior", ImageURL: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80", SortOrder: 5},
			{Title: "Espresso Shot", ImageURL: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", SortOrder: 6},
		}
		for _, g := range galleryItems {
			DB.Create(&g)
		}

		// Seed Blogs
		blogs := []models.BlogPost{
			{
				Title:    "The Science of The Perfect Espresso Extraction",
				Author:   "Admin",
				Date:     "15 August 2024",
				Summary:  "Discover how grind size, water temperature, and pump pressure harmonize into velvety liquid gold.",
				Content:  "The journey to the perfect espresso is both science and art. When 9 bars of pressure force hot water through finely ground beans, aromatic oils dissolve into an emulsion crowned with dense crema...",
				ImageURL: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
			},
			{
				Title:    "Why Single-Origin Beans Matter to Your Palate",
				Author:   "Admin",
				Date:     "22 August 2024",
				Summary:  "Explore terroir, microclimates, and farming traditions that give each origin its distinctive tasting profile.",
				Content:  "Unlike commodity coffee blends, single-origin coffees celebrate the unique terroir of specific regions, such as the floral bergamot notes of Yirgacheffe or the citrus brightness of Colombian mountains...",
				ImageURL: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
			},
			{
				Title:    "Mastering Pour Over Brewing at Home",
				Author:   "Admin",
				Date:     "01 September 2024",
				Summary:  "Simple step-by-step equipment guides and bloom ratios to elevate your weekend coffee brewing.",
				Content:  "Pour over brewing offers unparalleled clarity of cup. Start with a 1:16 ratio of coffee to water, let the grounds bloom for 45 seconds, and pour in gentle concentric circles...",
				ImageURL: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop&q=80",
			},
		}
		for _, b := range blogs {
			DB.Create(&b)
		}

		log.Println("[DB] Initial softcoded content seeded successfully.")
	}
}
