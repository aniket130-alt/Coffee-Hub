import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Categories } from './components/Categories';
import { MenuSection } from './components/MenuSection';
import { ProductsSection } from './components/ProductsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { UserAuthModal } from './components/UserAuthModal';
import { StoresSection } from './components/StoresSection';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import {
  SiteSettings,
  Category,
  MenuItem,
  Product,
  GalleryItem,
  BlogPost,
  CartItem,
  User,
  Hub
} from './types';
import { api } from './services/api';
import './style.css';

export const App: React.FC = () => {
  // Check if current URL is /admin or #admin
  const getIsAdminPath = () =>
    window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';

  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>(() =>
    getIsAdminPath() ? 'admin' : 'store'
  );

  // Check if admin is authenticated via session token
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    Boolean(sessionStorage.getItem('admin_token'))
  );

  // Customer User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('coffeeshop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings state — initialized instantly from localStorage cache to eliminate flash
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem('coffeeshop_settings_cache');
      if (cached) return JSON.parse(cached);
    } catch {}
    // No cache yet — use empty strings so images/text don't flash incorrect defaults
    return {
      siteName: '',
      logoUrl: '',
      heroHeading: '',
      heroSubheading: '',
      heroImageUrl: '',
      heroBtnText: 'Shop Now',
      heroBtnLink: '#menu',
      aboutHeading: '',
      aboutSubheading: '',
      aboutStory1: '',
      aboutStory2: '',
      aboutStory3: '',
      aboutImageUrl: '',
      aboutBtnText: 'Learn More',
      phone: '',
      email: '',
      address: '',
      contactNote: '',
      socialTwitter: '',
      socialFacebook: '',
      socialInstagram: '',
      socialYoutube: '',
      socialPinterest: '',
      footerCreditName: '',
      footerCreditLink: '#',
      copyrightText: '',
    };
  });

  // True when settings have been loaded from cache or API (suppresses navbar flash)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('coffeeshop_settings_cache'));
    } catch {
      return false;
    }
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);

  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('coffeeshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('coffeeshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Synchronize browser history and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      if (getIsAdminPath()) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    if (path.startsWith('/admin')) {
      setCurrentRoute('admin');
    } else {
      setCurrentRoute('store');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load backend data and update localStorage cache
  const fetchData = async () => {
    try {
      const [s, c, m, p, g, b, hList] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getCategories().catch(() => []),
        api.getMenuItems().catch(() => []),
        api.getProducts().catch(() => []),
        api.getGallery().catch(() => []),
        api.getBlogs().catch(() => []),
        api.getHubs().catch(() => []),
      ]);
      if (s) {
        setSettings(s);
        setSettingsLoaded(true);
        localStorage.setItem('coffeeshop_settings_cache', JSON.stringify(s));
      } else {
        // Even if settings fetch fails, mark loaded so navbar shows something
        setSettingsLoaded(true);
      }
      if (c) setCategories(c);
      if (m) setMenuItems(m);
      if (p) setProducts(p);
      if (g) setGallery(g);
      if (b) setBlogs(b);
      if (hList) setHubs(hList);
    } catch (e) {
      console.error('Error loading data', e);
      setSettingsLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show Toast
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem | Product, isProduct = false) => {
    const cartId = isProduct ? `prod-${item.id}` : `menu-${item.id}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: cartId,
          originalId: item.id,
          type: isProduct ? 'product' : 'menu',
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: 1,
        },
      ];
    });
    notify(`Added "${item.name}" to cart!`);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    notify('Successfully logged in as Admin!');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    navigateTo('/');
    notify('Logged out of admin dashboard.');
  };

  return (
    <div className="all-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <span>☕</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Routing: /admin -> Login or Dashboard | / -> Storefront */}
      {currentRoute === 'admin' ? (
        !isAdminAuthenticated ? (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => navigateTo('/')}
          />
        ) : (
          <AdminDashboard
            onBackToSite={() => navigateTo('/')}
            onLogout={handleAdminLogout}
            onNotify={notify}
            onRefreshData={fetchData}
          />
        )
      ) : (
        <>
          <Navbar
            settings={settings}
            settingsLoaded={settingsLoaded}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Hero settings={settings} />

          <About settings={settings} />

          <StoresSection
            hubs={hubs}
            onSelectStoreToOrder={() => setIsCartOpen(true)}
          />

          {categories.length > 0 && <Categories categories={categories} />}

          <MenuSection
            items={menuItems}
            searchQuery={searchQuery}
            onAddToCart={(item) => handleAddToCart(item, false)}
          />

          <ProductsSection
            products={products}
            searchQuery={searchQuery}
            onAddToCart={(prod) => handleAddToCart(prod, true)}
          />

          {gallery.length > 0 && <GallerySection items={gallery} />}

          <ContactSection settings={settings} onNotify={notify} />

          {blogs.length > 0 && <BlogSection blogs={blogs} />}

          <Footer settings={settings} />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            currentUser={currentUser}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCartItems([])}
            onNotify={notify}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          <UserAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            currentUser={currentUser}
            onUserLogin={(user, token) => {
              setCurrentUser(user);
              localStorage.setItem('coffeeshop_user', JSON.stringify(user));
              localStorage.setItem('coffeeshop_user_token', token);
            }}
            onUserLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem('coffeeshop_user');
              localStorage.removeItem('coffeeshop_user_token');
            }}
            onUpdateUser={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem('coffeeshop_user', JSON.stringify(updatedUser));
            }}
            onNotify={notify}
          />
        </>
      )}
    </div>
  );
};

export default App;
