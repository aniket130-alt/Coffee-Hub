import React, { useState } from 'react';
import { ShoppingCart, Search, Menu as MenuIcon, X, User as UserIcon } from 'lucide-react';
import { SiteSettings, User } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  settingsLoaded: boolean;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  settingsLoaded,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderLogo = () => {
    // Show logo image if a URL is configured by admin
    if (settings.logoUrl) {
      return (
        <img
          src={settings.logoUrl}
          alt={settings.siteName || 'Coffee Hub'}
          style={{ height: '50px', width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      );
    }

    // If still loading and no siteName yet, show slim skeleton pulse
    if (!settingsLoaded && !settings.siteName) {
      return (
        <div
          style={{
            width: '130px',
            height: '32px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.15)',
            animation: 'navLogoPulse 1.4s ease-in-out infinite',
          }}
        />
      );
    }

    // Always show text fallback — siteName from admin or hardcoded default
    return <span>☕ {settings.siteName || 'Coffee Hub'}</span>;
  };

  return (
    <>
      {/* Inline keyframe for logo skeleton pulse */}
      <style>{`
        @keyframes navLogoPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <nav className="main-navbar" id="navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <div
            onClick={handleLogoClick}
            className="navbar-logo"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Return to top"
          >
            {renderLogo()}
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <a href="/#home" className="nav-link">Home</a>
            <a href="/#about" className="nav-link">About</a>
            <a href="/#stores" className="nav-link">Stores</a>
            <a href="/#categories" className="nav-link">Categories</a>
            <a href="/#menu" className="nav-link">Menu</a>
            <a href="/#product" className="nav-link">Products</a>
            <a href="/#gallery" className="nav-link">Gallery</a>
            <a href="/#contact" className="nav-link">Contact</a>
            <a href="/#blogs" className="nav-link">Blogs</a>
          </ul>

          {/* Right Actions: Search, User Account, & Cart */}
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

            <button
              className="cart-btn"
              onClick={onOpenAuth}
              title={currentUser ? 'My Account' : 'User Login / Register'}
              style={{ backgroundColor: currentUser ? '#b2744c' : '#222' }}
            >
              <UserIcon size={18} />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Login'}</span>
            </button>

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
            <a href="/#stores" className="nav-link" onClick={() => setIsMobileOpen(false)}>Stores</a>
            <a href="/#categories" className="nav-link" onClick={() => setIsMobileOpen(false)}>Categories</a>
            <a href="/#menu" className="nav-link" onClick={() => setIsMobileOpen(false)}>Menu</a>
            <a href="/#product" className="nav-link" onClick={() => setIsMobileOpen(false)}>Products</a>
            <a href="/#gallery" className="nav-link" onClick={() => setIsMobileOpen(false)}>Gallery</a>
            <a href="/#contact" className="nav-link" onClick={() => setIsMobileOpen(false)}>Contact</a>
            <a href="/#blogs" className="nav-link" onClick={() => setIsMobileOpen(false)}>Blogs</a>
          </div>
        )}
      </nav>
    </>
  );
};
