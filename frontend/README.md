# ☕ Coffee Shop Frontend Application (React + TypeScript + Vite)

Modern, interactive customer storefront and Master Admin dashboard.

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Icons**: Lucide React (`lucide-react`)
- **Styles**: Custom CSS3 (`style.css`) with responsive flexbox and CSS grid layouts

## 🏃 Running the Frontend
```powershell
cd frontend
npm run dev
```

To build for production:
```powershell
npm run build
```

## 🧩 Key Components
- `Navbar.tsx`: Brand logo with smooth scroll-to-top (fixed section collapse logic), search bar, customer account button, and cart badge.
- `CartDrawer.tsx`: Cart slide-out drawer with Delivery / Dine-in / Pickup selection, saved address chooser, and Nearby Hub locator.
- `UserAuthModal.tsx`: Customer login, account registration, and 3+ saved addresses manager.
- `AdminDashboard.tsx`: Control center for managing menu items, products, categories, blogs, gallery, inquiries, settings, media uploader, and live customer orders with status toggling.
