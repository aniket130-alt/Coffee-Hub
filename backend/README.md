# ☕ Coffee Shop Backend Service (Golang + Gin + GORM)

High-performance RESTful API backend for the Coffee Shop application.

## 🛠️ Tech Stack
- **Language**: Go 1.26
- **Web Framework**: Gin (`github.com/gin-gonic/gin`)
- **ORM**: GORM (`gorm.io/gorm`)
- **Database Support**: Pure-Go Embedded SQLite (`github.com/glebarez/sqlite`) & PostgreSQL (`gorm.io/driver/postgres`)
- **Password Security**: `golang.org/x/crypto/bcrypt`

## 🏃 Running the Backend
```powershell
cd backend
go run main.go
```

To build a standalone executable:
```powershell
go build -o coffeeshop-backend.exe
```

## 📡 API Endpoints Overview

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **User Auth** | `POST` | `/api/user/register` | Register customer account |
| **User Auth** | `POST` | `/api/user/login` | Authenticate customer |
| **User Auth** | `GET` | `/api/user/profile` | Get user profile details |
| **User Auth** | `PUT` | `/api/user/addresses` | Update user saved addresses (3+ addresses) |
| **Hub Finder** | `GET` | `/api/hubs` | List active coffee hubs |
| **Hub Finder** | `POST` | `/api/hubs/nearby` | Find nearest hub by pincode/city |
| **Orders** | `POST` | `/api/orders` | Place new order (Delivery, Dine-in, Pickup) |
| **Orders** | `GET` | `/api/orders` | List all orders (Admin) |
| **Orders** | `PUT` | `/api/orders/:id` | Update order status |
| **Admin Auth** | `POST` | `/api/admin/login` | Master Admin login |
| **Media** | `POST` | `/api/upload` | Fast image upload to `./uploads` |
