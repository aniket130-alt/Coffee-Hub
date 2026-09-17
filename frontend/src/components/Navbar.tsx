import React, { useState } from 'react';
import { ShoppingCart, Search, Menu as MenuIcon, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="main-navbar" id="navbar">
      <div className="navbar-container">
        {/* Softcoded Brand Logo */}
        <a href="#home" className="navbar-logo">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName || "Coffee Shop"} />
          ) : (
            <span>☕ {settings.siteName || "Coffee Shop"}</span>
          )}
        </a>

        {/* Navigation Links */}
        <ul className="nav-links">
          <a href="/#home" className="nav-link">Home</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#categories" className="nav-link">Categories</a>
          <a href="/#menu" className="nav-link">Menu</a>
          <a href="/#product" className="nav-link">Products</a>
          <a href="/#gallery" className="nav-link">Gallery</a>
          <a href="/#contact" className="nav-link">Contact</a>
          <a href="/#blogs" className="nav-link">Blogs</a>
        </ul>

        {/* Right Actions: Search & Cart */}
        <div className="navbar-actions">
          <div className="search-box">
            <Search size={16} color="#666" />
            <input
              type="text"
              placeholder="Search coffee..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button className="cart-btn" onClick={onOpenCart} title="View Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div style={{ padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="/#home" className="nav-link" onClick={() => setIsMobileOpen(false)}>Home</a>
          <a href="/#about" className="nav-link" onClick={() => setIsMobileOpen(false)}>About</a>
          <a href="/#categories" className="nav-link" onClick={() => setIsMobileOpen(false)}>Categories</a>
          <a href="/#menu" className="nav-link" onClick={() => setIsMobileOpen(false)}>Menu</a>
          <a href="/#product" className="nav-link" onClick={() => setIsMobileOpen(false)}>Products</a>
          <a href="/#gallery" className="nav-link" onClick={() => setIsMobileOpen(false)}>Gallery</a>
          <a href="/#contact" className="nav-link" onClick={() => setIsMobileOpen(false)}>Contact</a>
          <a href="/#blogs" className="nav-link" onClick={() => setIsMobileOpen(false)}>Blogs</a>
        </div>
      )}
    </nav>
  );
};
