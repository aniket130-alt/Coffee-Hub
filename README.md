# ☕ Full-Stack Softcoded Coffee Shop Platform

A modern, responsive, and completely **softcoded** Coffee Shop web application built with **React (TypeScript)**, **Golang (Gin)**, and **PostgreSQL (GORM)**.

Every single visual, structural, and textual element on the customer storefront is dynamic and manageable from a centralized **Admin Control Center** (`/admin`), including logos, hero banners, story sections, categories, menu items, prices, ratings, packaged products, gallery photos, blogs, contact information, social links, customer inquiries, and media uploads.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Golang** (v1.20+)
- **Node.js** (v18+) & **npm**
- *(Optional)* **PostgreSQL** (If PostgreSQL is not running locally, the backend automatically uses an embedded persistent storage `coffeeshop.db` so the app runs out of the box with zero configuration!)

---

### 1. Start the Golang Backend Server
```powershell
cd backend

# If using PostgreSQL, create a database named 'coffeeshop' or configure .env:
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/coffeeshop?sslmode=disable

# Run the backend
go run main.go
```
> The API server will start on `http://localhost:8080` with auto-migration and automatic seeding.

---

### 2. Start the React + TypeScript Frontend
```powershell
cd frontend

# Install dependencies (already installed)
npm install

# Start Vite dev server
npm run dev
```
> Open your browser at: **`http://localhost:5173`**

---

## 🛠️ Features & Architecture

### 1. Customer Storefront
- **Navbar**: Dynamic logo, navigation links, live real-time search bar, interactive shopping cart badge, and direct "Admin" toggle.
- **Hero Section**: Softcoded headline, subtitle, action button, and high-resolution background image with warm coffee overlay.
- **About Section**: Softcoded headline, subheading, multi-paragraph story, roastery image, and CTA.
- **Top Categories**: Card tiles with hover lift effects and category routing.
- **Menu Section**: Softcoded items with star ratings, current price, strike-through discount price, category filtering, and "Add to Cart".
- **Products Section**: Packaged coffee beans with promotional badges and cart integration.
- **Gallery Section**: Photo grid with an interactive lightbox viewer.
- **Contact Us**: Softcoded contact information (phone, email, physical address) and an interactive inquiry form that persists customer messages into the database.
- **Latest Blogs**: Article cards with preview snippets and a "Read More" article modal.
- **Footer**: Dynamic social links (Twitter/X, Facebook, Instagram, YouTube, Pinterest), credit links, and copyright text.
- **Cart Slide-out Drawer**: Real-time quantity adjustment, item removal, price calculation, and checkout simulation.

---

### 2. Master Admin Portal (`/admin`)
The admin button has been removed from the public navbar so regular visitors only see the customer-facing storefront. To access the control center:
1. Navigate directly to: **`https://coffee-hub-red.vercel.app/`**

2. Once authenticated, you will be taken to the full **Admin Control Center**:
   - **Hero & Branding**: Update site name, upload or input logo URL, edit hero title, subtitle, background image, button text and link.
   - **About Us**: Edit section title, subheading, story paragraphs 1, 2, and 3, upload about image, edit button text.
   - **Contact & Socials**: Edit email, phone, address, contact notes, social media URLs (Twitter, Facebook, Instagram, YouTube, Pinterest), and footer credits.
   - **Menu Items Manager**: Full CRUD (Create, Read, Update, Delete) for coffee menu items. Change prices, original strike prices, star ratings, categories, availability, and upload photos.
   - **Packaged Products Manager**: Full CRUD for bagged coffee beans, promotional badges ("Bestseller", "Top Pick"), prices, and stock flags.
   - **Categories Manager**: Add, edit, reorder, or delete category cards.
   - **Gallery Manager**: Add, delete, and manage photo gallery images.
   - **Blog Articles Manager**: Write, edit, and publish new blog posts with authors, dates, summaries, and full articles.
   - **Inquiries Inbox**: View customer messages submitted through the contact form with timestamps.
   - **Universal Fast Media Uploader**: Drag & drop or upload any image file directly to the Golang backend (`/uploads`), with instant 1-click URL copying.
   - **Logout**: Secure one-click logout in the top header.

---

## 🗄️ Database & PostgreSQL Configuration

The backend connects using GORM. To use PostgreSQL:
1. Create a PostgreSQL database (e.g., `coffeeshop`).
2. Set the `DATABASE_URL` in `backend/.env` or as an environment variable:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/coffeeshop?sslmode=disable
   ```
3. Restart the backend server. All tables will automatically migrate and seed!
