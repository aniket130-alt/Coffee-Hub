# ☕ Full-Stack Coffee Shop & Delivery Platform

A modern, high-performance, and completely  Coffee Shop application built with **React (TypeScript)**, **Golang (Gin framework)**, and **GORM (SQLite / PostgreSQL)**.

---

## 🚀 Recent Feature Updates & Enhancements

1. **Customer User Registration & Authentication**:
   - Secure customer signup and login system (`/api/user/register`, `/api/user/login`).
   - Passwords securely hashed with `bcrypt`.
   - Customer profile state maintained with session token storage.

2. **Order Purpose Selection (Delivery vs. Dine-in vs. Pickup)**:
   - Customers can select their order purpose directly in checkout:
     - 🛵 **Delivery**: Requires street address + pincode with saved address auto-fill.
     - 🍽️ **Dine-in (Table Service)**: Requires Table Number selection & store hub choice.
     - 🛍️ **Pickup**: Store takeaway option.

3. **Saved Address Management (3+ Addresses)**:
   - Registered users can save, manage, and label multiple addresses (*Home*, *Office*, *Other*) with 1-click selection during checkout.

4. **Nearby Coffee Hub Finder**:
   - Automated hub detection matching pincodes and regional areas to the nearest Coffee Hub branch (*South Delhi Hub*, *Connaught Place Flagship*, *Cyber Hub Gurgaon*, *Noida Sec 18 Hub*).

5. **Fixed Logo Click & Smooth Scrolling**:
   - Removed hash anchor behavior on the brand logo to prevent section collapse or jumpy layouts on navigation. Clicking the logo now performs a smooth scroll to top.

6. **Admin Dashboard Loading Gap & Order Tracking Fixes**:
   - Eliminated visual layout collapse / data gap upon visiting or refreshing `/admin`.
   - Enhanced **Customer Orders** tab with live status updating (`Pending`, `Preparing`, `Completed`, `Cancelled`), order purpose badges, hub location names, table numbers, and automatic background polling.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Custom CSS3 with responsive layouts.
- **Backend**: Golang 1.26, Gin Web Framework, GORM ORM, `golang.org/x/crypto/bcrypt`.
- **Database**: Dual-engine support (Auto-falls back to embedded SQLite `coffeeshop.db` or connects to PostgreSQL via `DATABASE_URL`).

---

## 🚀 Quick Start Guide

### 1. Run Golang Backend
```powershell
cd backend
go run main.go
```
*Backend runs on `http://localhost:8080` with auto-migration and initial seed data.*

### 2. Run React Frontend
```powershell
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📑 API Endpoint References

### Customer Authentication & User Profile
- `POST /api/user/register` - Create customer account (Name, Email, Password, Phone)
- `POST /api/user/login` - Authenticate customer & return user session token
- `GET /api/user/profile?userId=:id` - Retrieve user profile details
- `PUT /api/user/addresses` - Update user's saved address list (JSON array)

### Coffee Hubs & Location
- `GET /api/hubs` - List all active store hub locations
- `POST /api/hubs/nearby` - Find nearest hub by pincode/city/address

### Orders
- `POST /api/orders` - Submit new cart order (Delivery/Dine-in/Pickup, items, hub, address/table)
- `GET /api/orders` - List customer orders (Admin)
- `PUT /api/orders/:id` - Update order status (Pending -> Preparing -> Completed)
- `DELETE /api/orders/:id` - Delete order record

### Admin Authentication
- `POST /api/admin/login` - Authenticate admin (`admin` / `admin123`)

---

## 👤 Admin Portal Access (`/admin`)

- **URL**: `http://localhost:5173/admin`
- **Default Username**: `admin`
- **Default Password**: `admin123`

---

## 📜 Project Structure

```
task/
├── backend/
│   ├── config/          # Database setup (db.go) & initial data seeding
│   ├── handlers/        # Gin API handlers (user auth, hubs, orders, settings)
│   ├── models/          # GORM structs (User, Hub, Order, MenuItem, Product, etc.)
│   ├── main.go          # Entry point & route definitions
│   └── coffeeshop.db    # Embedded persistent SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, CartDrawer, UserAuthModal, Hero, Menu, etc.
│   │   ├── pages/       # AdminDashboard, AdminLogin
│   │   ├── services/    # api.ts (Fetch API client)
│   │   ├── types/       # TypeScript interfaces (User, Hub, Order, etc.)
│   │   ├── App.tsx      # Main application router & state manager
│   │   └── style.css    # Central styling stylesheet
└── README.md
```
