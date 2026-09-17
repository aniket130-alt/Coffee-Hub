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
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import {
  SiteSettings,
  Category,
  MenuItem,
  Product,
  GalleryItem,
  BlogPost,
  CartItem
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

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Softcoded Data States
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Coffee Shop',
    logoUrl: '',
    heroHeading: 'Start Your Day With a\nFresh Coffee',
    heroSubheading: 'Experience artisanal coffee brewed to perfection from hand-selected beans sourced across the world.',
    heroImageUrl: '',
    heroBtnText: 'Shop Now',
    heroBtnLink: '#menu',
    aboutHeading: 'About Us',
    aboutSubheading: 'What Makes Our Coffee Special?',
    aboutStory1: 'We roast small-batch specialty coffee with meticulous attention to origin, profile, and flavor balance.',
    aboutStory2: 'From single-origin varieties to rich velvet espresso blends, our brewmasters craft each cup with passionate precision.',
    aboutStory3: 'Step inside our warm, aromatic cafe or order your favorite beans straight to your door.',
    aboutImageUrl: '',
    aboutBtnText: 'Learn More',
    phone: '+91 00000 00000',
    email: 'coffeeshop@gmail.com',
    address: 'Shahpur Jat, Delhi, India',
    contactNote: 'Visit our roastery cafe for fresh pours, tasting flights, and custom catering inquiries.',
    socialTwitter: 'https://twitter.com',
    socialFacebook: 'https://facebook.com',
    socialInstagram: 'https://instagram.com',
    socialYoutube: 'https://youtube.com',
    socialPinterest: 'https://pinterest.com',
    footerCreditName: 'Aniket',
    footerCreditLink: '#',
    copyrightText: '© Copyright Coffee Shop. All Rights Reserved',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

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

  // Load backend data
  const fetchData = async () => {
    try {
      const [s, c, m, p, g, b] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getCategories().catch(() => []),
        api.getMenuItems().catch(() => []),
        api.getProducts().catch(() => []),
        api.getGallery().catch(() => []),
        api.getBlogs().catch(() => []),
      ]);
      if (s) setSettings(s);
      if (c) setCategories(c);
      if (m) setMenuItems(m);
      if (p) setProducts(p);
      if (g) setGallery(g);
      if (b) setBlogs(b);
    } catch (e) {
      console.error('Error loading data', e);
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
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Hero settings={settings} />

          <About settings={settings} />

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
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCartItems([])}
            onNotify={notify}
          />
        </>
      )}
    </div>
  );
};

export default App;
