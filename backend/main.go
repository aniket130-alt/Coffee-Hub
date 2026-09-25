package main

import (
	"log"
	"os"
	"time"

	"coffeeshop-backend/config"
	"coffeeshop-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Attempt to load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("[INFO] No .env file found, using system environment variables")
	}

	// Initialize database (PostgreSQL with embedded fallback)
	config.InitDB()

	// Initialize Gin
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Ensure upload directory exists and serve statically
	os.MkdirAll("./uploads", 0755)
	r.Static("/uploads", "./uploads")

	// API Routes Group
	api := r.Group("/api")
	{
		// Site Settings (Softcoded global configuration)
		api.GET("/settings", handlers.GetSettings)
		api.PUT("/settings", handlers.UpdateSettings)

		// Categories
		api.GET("/categories", handlers.GetCategories)
		api.POST("/categories", handlers.CreateCategory)
		api.PUT("/categories/:id", handlers.UpdateCategory)
		api.DELETE("/categories/:id", handlers.DeleteCategory)

		// Menu Items
		api.GET("/menu", handlers.GetMenuItems)
		api.POST("/menu", handlers.CreateMenuItem)
		api.PUT("/menu/:id", handlers.UpdateMenuItem)
		api.DELETE("/menu/:id", handlers.DeleteMenuItem)

		// Products
		api.GET("/products", handlers.GetProducts)
		api.POST("/products", handlers.CreateProduct)
		api.PUT("/products/:id", handlers.UpdateProduct)
		api.DELETE("/products/:id", handlers.DeleteProduct)

		// Gallery
		api.GET("/gallery", handlers.GetGallery)
		api.POST("/gallery", handlers.CreateGalleryItem)
		api.PUT("/gallery/:id", handlers.UpdateGalleryItem)
		api.DELETE("/gallery/:id", handlers.DeleteGalleryItem)

		// Blogs
		api.GET("/blogs", handlers.GetBlogs)
		api.POST("/blogs", handlers.CreateBlog)
		api.PUT("/blogs/:id", handlers.UpdateBlog)
		api.DELETE("/blogs/:id", handlers.DeleteBlog)

		// Contact Form Inquiries
		api.POST("/contact", handlers.SubmitContact)
		api.GET("/contact", handlers.GetContacts)
		api.DELETE("/contact/:id", handlers.DeleteContact)

		// Orders
		api.POST("/orders", handlers.CreateOrder)
		api.GET("/orders", handlers.GetOrders)
		api.PUT("/orders/:id", handlers.UpdateOrder)
		api.DELETE("/orders/:id", handlers.DeleteOrder)

		// File Upload
		api.POST("/upload", handlers.UploadFile)

		// Admin Auth
		api.POST("/admin/login", handlers.AdminLogin)
	}

	// Determine port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[SERVER] Coffee Shop API Server starting on port :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("[SERVER] Failed to run server: %v", err)
	}
}
