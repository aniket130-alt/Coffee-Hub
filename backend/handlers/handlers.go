package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"coffeeshop-backend/config"
	"coffeeshop-backend/models"

	"github.com/gin-gonic/gin"
)

// --- Site Settings Handlers ---

func GetSettings(c *gin.Context) {
	var settings models.SiteSettings
	result := config.DB.First(&settings)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Settings not found"})
		return
	}
	c.JSON(http.StatusOK, settings)
}

func UpdateSettings(c *gin.Context) {
	var input models.SiteSettings
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var settings models.SiteSettings
	if err := config.DB.First(&settings).Error; err != nil {
		// If none exists, create one
		input.UpdatedAt = time.Now()
		config.DB.Create(&input)
		c.JSON(http.StatusOK, input)
		return
	}

	input.ID = settings.ID
	input.UpdatedAt = time.Now()
	if err := config.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
		return
	}
	c.JSON(http.StatusOK, input)
}

// --- Category Handlers ---

func GetCategories(c *gin.Context) {
	var categories []models.Category
	config.DB.Order("sort_order asc, id asc").Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&category)
	c.JSON(http.StatusCreated, category)
}

func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var category models.Category
	if err := config.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&category)
	c.JSON(http.StatusOK, category)
}

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Category{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}

// --- Menu Item Handlers ---

func GetMenuItems(c *gin.Context) {
	var items []models.MenuItem
	config.DB.Order("id asc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateMenuItem(c *gin.Context) {
	var item models.MenuItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateMenuItem(c *gin.Context) {
	id := c.Param("id")
	var item models.MenuItem
	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu item not found"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteMenuItem(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.MenuItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete menu item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Menu item deleted successfully"})
}

// --- Product Handlers ---

func GetProducts(c *gin.Context) {
	var products []models.Product
	config.DB.Order("id asc").Find(&products)
	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&product)
	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&product)
	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// --- Gallery Handlers ---

func GetGallery(c *gin.Context) {
	var items []models.GalleryItem
	config.DB.Order("sort_order asc, id asc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateGalleryItem(c *gin.Context) {
	var item models.GalleryItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func UpdateGalleryItem(c *gin.Context) {
	id := c.Param("id")
	var item models.GalleryItem
	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gallery item not found"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteGalleryItem(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.GalleryItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete gallery item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Gallery item deleted successfully"})
}

// --- Blog Handlers ---

func GetBlogs(c *gin.Context) {
	var blogs []models.BlogPost
	config.DB.Order("id desc").Find(&blogs)
	c.JSON(http.StatusOK, blogs)
}

func CreateBlog(c *gin.Context) {
	var blog models.BlogPost
	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&blog)
	c.JSON(http.StatusCreated, blog)
}

func UpdateBlog(c *gin.Context) {
	id := c.Param("id")
	var blog models.BlogPost
	if err := config.DB.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
		return
	}

	if err := c.ShouldBindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&blog)
	c.JSON(http.StatusOK, blog)
}

func DeleteBlog(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.BlogPost{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete blog"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Blog post deleted successfully"})
}

// --- Contact Inquiries Handlers ---

func SubmitContact(c *gin.Context) {
	var msg models.ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	msg.CreatedAt = time.Now()
	msg.IsRead = false

	if err := config.DB.Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit message"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Thank you! Your message has been received.", "data": msg})
}

func GetContacts(c *gin.Context) {
	var msgs []models.ContactMessage
	config.DB.Order("id desc").Find(&msgs)
	c.JSON(http.StatusOK, msgs)
}

func DeleteContact(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.ContactMessage{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete message"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Message deleted"})
}

// --- Order Handlers ---

func CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	order.CreatedAt = time.Now()
	if order.Status == "" {
		order.Status = "Pending"
	}
	config.DB.Create(&order)
	c.JSON(http.StatusCreated, order)
}

func GetOrders(c *gin.Context) {
	var orders []models.Order
	config.DB.Order("id desc").Find(&orders)
	c.JSON(http.StatusOK, orders)
}

// --- File Upload Handler ---

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded: " + err.Error()})
		return
	}

	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create upload directory"})
		return
	}

	// Create a unique filename
	ext := filepath.Ext(file.Filename)
	base := strings.TrimSuffix(filepath.Base(file.Filename), ext)
	base = strings.ReplaceAll(base, " ", "_")
	filename := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), base, ext)
	dst := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file: " + err.Error()})
		return
	}

	// Construct public URL
	fileURL := fmt.Sprintf("/uploads/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"url":      fileURL,
		"filename": filename,
		"message":  "File uploaded successfully",
	})
}

// --- Admin Authentication Handler ---

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func AdminLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	adminUser := os.Getenv("ADMIN_USER")
	if adminUser == "" {
		adminUser = "admin"
	}
	adminPass := os.Getenv("ADMIN_PASSWORD")
	if adminPass == "" {
		adminPass = "admin123"
	}

	if req.Username == adminUser && req.Password == adminPass {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"token":   "admin_session_coffee_secret_token_123",
			"message": "Login successful",
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"error":   "Invalid username or password",
	})
}

