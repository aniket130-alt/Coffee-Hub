import React, { useState, useEffect } from 'react';
import {
  Settings,
  Image,
  Coffee,
  Package,
  FolderTree,
  Camera,
  BookOpen,
  Mail,
  Upload,
  Save,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Copy,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import {
  SiteSettings,
  Category,
  MenuItem,
  Product,
  GalleryItem,
  BlogPost,
  ContactMessage
} from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout: () => void;
  onNotify: (msg: string) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onLogout,
  onNotify,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'branding' | 'about' | 'contact' | 'menu' | 'products' | 'categories' | 'gallery' | 'blogs' | 'messages' | 'uploader'
  >('branding');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Coffee Shop',
    logoUrl: '',
    heroHeading: '',
    heroSubheading: '',
    heroImageUrl: '',
    heroBtnText: 'Shop Now',
    heroBtnLink: '#menu',
    aboutHeading: 'About Us',
    aboutSubheading: 'What Makes Our Coffee Special?',
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
    footerCreditName: 'Aniket',
    footerCreditLink: '#',
    copyrightText: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modals state
  const [menuModal, setMenuModal] = useState<{ open: boolean; item?: MenuItem }>({ open: false });
  const [productModal, setProductModal] = useState<{ open: boolean; item?: Product }>({ open: false });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; item?: Category }>({ open: false });
  const [galleryModal, setGalleryModal] = useState<{ open: boolean; item?: GalleryItem }>({ open: false });
  const [blogModal, setBlogModal] = useState<{ open: boolean; item?: BlogPost }>({ open: false });

  // Uploader State
  const [uploadResultUrl, setUploadResultUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load all data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, c, m, p, g, b, msgs] = await Promise.all([
        api.getSettings().catch(() => settings),
        api.getCategories().catch(() => []),
        api.getMenuItems().catch(() => []),
        api.getProducts().catch(() => []),
        api.getGallery().catch(() => []),
        api.getBlogs().catch(() => []),
        api.getContacts().catch(() => []),
      ]);
      setSettings(s);
      setCategories(c);
      setMenuItems(m);
      setProducts(p);
      setGallery(g);
      setBlogs(b);
      setMessages(msgs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Save Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      onNotify('Site settings saved successfully!');
      onRefreshData();
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload handler helper
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      onNotify('Image uploaded successfully!');
      return res.url;
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
      return '';
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#b2744c' }}>Loading Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="admin-view">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <Settings size={24} color="#b2744c" />
          <div>
            <span>Coffee Shop</span> Master Admin
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-back-btn" onClick={onBackToSite}>
            <ArrowLeft size={16} />
            View Live Website
          </button>
          <button
            className="admin-back-btn"
            style={{ backgroundColor: '#dc2626' }}
            onClick={onLogout}
            title="Sign out of admin"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div
            className={`admin-nav-item ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            <Settings size={18} />
            <span>Hero & Branding</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <BookOpen size={18} />
            <span>About Section</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={18} />
            <span>Contact & Socials</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Coffee size={18} />
            <span>Menu Items ({menuItems.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Products ({products.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FolderTree size={18} />
            <span>Categories ({categories.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Camera size={18} />
            <span>Gallery ({gallery.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <BookOpen size={18} />
            <span>Blog Posts ({blogs.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={18} />
            <span>Inquiries Inbox ({messages.length})</span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === 'uploader' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploader')}
          >
            <Upload size={18} />
            <span>Media Uploader</span>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="admin-content">
          {/* TAB 1: HERO & BRANDING */}
          {activeTab === 'branding' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Branding & Hero Banner</span>
                <button
                  className="admin-save-btn"
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Logo URL or Upload</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={settings.logoUrl}
                      onChange={(e) =>
                        setSettings({ ...settings, logoUrl: e.target.value })
                      }
                    />
                    <label
                      style={{
                        background: '#b2744c',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Upload size={14} /> Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleFileUpload(e.target.files[0]);
                            if (url) setSettings({ ...settings, logoUrl: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                  {settings.logoUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={settings.logoUrl}
                        alt="Logo preview"
                        style={{ height: '40px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-field">
                <label>Hero Headline (Accepts line breaks)</label>
                <textarea
                  rows={2}
                  value={settings.heroHeading}
                  onChange={(e) =>
                    setSettings({ ...settings, heroHeading: e.target.value })
                  }
                />
              </div>

              <div className="admin-field">
                <label>Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={settings.heroSubheading}
                  onChange={(e) =>
                    setSettings({ ...settings, heroSubheading: e.target.value })
                  }
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Button Text</label>
                  <input
                    type="text"
                    value={settings.heroBtnText}
                    onChange={(e) =>
                      setSettings({ ...settings, heroBtnText: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Hero Button Link (#menu, #product, etc.)</label>
                  <input
                    type="text"
                    value={settings.heroBtnLink}
                    onChange={(e) =>
                      setSettings({ ...settings, heroBtnLink: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Hero Background Image URL or Upload</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={settings.heroImageUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, heroImageUrl: e.target.value })
                    }
                  />
                  <label
                    style={{
                      background: '#b2744c',
                      color: 'white',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleFileUpload(e.target.files[0]);
                          if (url) setSettings({ ...settings, heroImageUrl: url });
                        }
                      }}
                    />
                  </label>
                </div>
                {settings.heroImageUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={settings.heroImageUrl}
                      alt="Hero preview"
                      style={{ height: '90px', width: '180px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>About Us Section</span>
                <button
                  className="admin-save-btn"
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={settings.aboutHeading}
                    onChange={(e) =>
                      setSettings({ ...settings, aboutHeading: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Subheading</label>
                  <input
                    type="text"
                    value={settings.aboutSubheading}
                    onChange={(e) =>
                      setSettings({ ...settings, aboutSubheading: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Story Paragraph 1</label>
                <textarea
                  rows={2}
                  value={settings.aboutStory1}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutStory1: e.target.value })
                  }
                />
              </div>

              <div className="admin-field">
                <label>Story Paragraph 2</label>
                <textarea
                  rows={2}
                  value={settings.aboutStory2}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutStory2: e.target.value })
                  }
                />
              </div>

              <div className="admin-field">
                <label>Story Paragraph 3</label>
                <textarea
                  rows={2}
                  value={settings.aboutStory3}
                  onChange={(e) =>
                    setSettings({ ...settings, aboutStory3: e.target.value })
                  }
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>About Image URL or Upload</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={settings.aboutImageUrl}
                      onChange={(e) =>
                        setSettings({ ...settings, aboutImageUrl: e.target.value })
                      }
                    />
                    <label
                      style={{
                        background: '#b2744c',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Upload size={14} /> Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleFileUpload(e.target.files[0]);
                            if (url) setSettings({ ...settings, aboutImageUrl: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-field">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={settings.aboutBtnText}
                    onChange={(e) =>
                      setSettings({ ...settings, aboutBtnText: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Contact Info & Social Links</span>
                <button
                  className="admin-save-btn"
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="admin-grid-3">
                <div className="admin-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Physical Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) =>
                      setSettings({ ...settings, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Contact Info Box Note</label>
                <textarea
                  rows={2}
                  value={settings.contactNote}
                  onChange={(e) =>
                    setSettings({ ...settings, contactNote: e.target.value })
                  }
                />
              </div>

              <h4 style={{ fontSize: '16px', margin: '20px 0 10px 0', color: '#1a1a1a' }}>
                Social Media Links
              </h4>
              <div className="admin-grid-3">
                <div className="admin-field">
                  <label>Twitter / X URL</label>
                  <input
                    type="url"
                    value={settings.socialTwitter}
                    onChange={(e) =>
                      setSettings({ ...settings, socialTwitter: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Facebook URL</label>
                  <input
                    type="url"
                    value={settings.socialFacebook}
                    onChange={(e) =>
                      setSettings({ ...settings, socialFacebook: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialInstagram}
                    onChange={(e) =>
                      setSettings({ ...settings, socialInstagram: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>YouTube URL</label>
                  <input
                    type="url"
                    value={settings.socialYoutube}
                    onChange={(e) =>
                      setSettings({ ...settings, socialYoutube: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Pinterest URL</label>
                  <input
                    type="url"
                    value={settings.socialPinterest}
                    onChange={(e) =>
                      setSettings({ ...settings, socialPinterest: e.target.value })
                    }
                  />
                </div>
              </div>

              <h4 style={{ fontSize: '16px', margin: '20px 0 10px 0', color: '#1a1a1a' }}>
                Footer Credits & Copyright
              </h4>
              <div className="admin-grid-3">
                <div className="admin-field">
                  <label>Designed By Name</label>
                  <input
                    type="text"
                    value={settings.footerCreditName}
                    onChange={(e) =>
                      setSettings({ ...settings, footerCreditName: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Designed By Link</label>
                  <input
                    type="text"
                    value={settings.footerCreditLink}
                    onChange={(e) =>
                      setSettings({ ...settings, footerCreditLink: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Copyright Text</label>
                  <input
                    type="text"
                    value={settings.copyrightText}
                    onChange={(e) =>
                      setSettings({ ...settings, copyrightText: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MENU ITEMS */}
          {activeTab === 'menu' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Menu Items Management</span>
                <button
                  className="admin-save-btn"
                  onClick={() => setMenuModal({ open: true })}
                >
                  <Plus size={16} />
                  Add Menu Item
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Original</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="admin-table-img"
                        />
                      </td>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.category}</td>
                      <td style={{ color: '#b2744c', fontWeight: 'bold' }}>
                        ${item.price}
                      </td>
                      <td>
                        <s style={{ color: '#999' }}>${item.originalPrice}</s>
                      </td>
                      <td>★ {item.rating}/5</td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: item.isAvailable ? '#dcfce7' : '#fee2e2',
                            color: item.isAvailable ? '#166534' : '#991b1b',
                          }}
                        >
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn action-edit"
                          onClick={() => setMenuModal({ open: true, item })}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          className="admin-action-btn action-delete"
                          onClick={async () => {
                            if (confirm(`Delete menu item "${item.name}"?`)) {
                              await api.deleteMenuItem(item.id);
                              setMenuItems(menuItems.filter((i) => i.id !== item.id));
                              onNotify('Menu item deleted');
                              onRefreshData();
                            }
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Packaged Products Management</span>
                <button
                  className="admin-save-btn"
                  onClick={() => setProductModal({ open: true })}
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Original</th>
                    <th>Badge</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="admin-table-img"
                        />
                      </td>
                      <td>
                        <strong>{prod.name}</strong>
                      </td>
                      <td style={{ color: '#b2744c', fontWeight: 'bold' }}>
                        ${prod.price}
                      </td>
                      <td>
                        <s style={{ color: '#999' }}>${prod.originalPrice}</s>
                      </td>
                      <td>
                        {prod.badge ? (
                          <span
                            style={{
                              background: '#b2744c',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                            }}
                          >
                            {prod.badge}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: prod.isAvailable ? '#dcfce7' : '#fee2e2',
                            color: prod.isAvailable ? '#166534' : '#991b1b',
                          }}
                        >
                          {prod.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn action-edit"
                          onClick={() => setProductModal({ open: true, item: prod })}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          className="admin-action-btn action-delete"
                          onClick={async () => {
                            if (confirm(`Delete product "${prod.name}"?`)) {
                              await api.deleteProduct(prod.id);
                              setProducts(products.filter((p) => p.id !== prod.id));
                              onNotify('Product deleted');
                              onRefreshData();
                            }
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Top Categories</span>
                <button
                  className="admin-save-btn"
                  onClick={() => setCategoryModal({ open: true })}
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                    }}
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.title}
                      style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{cat.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Order: {cat.sortOrder}</span>
                        <div>
                          <button
                            className="admin-action-btn action-edit"
                            onClick={() => setCategoryModal({ open: true, item: cat })}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            className="admin-action-btn action-delete"
                            onClick={async () => {
                              if (confirm(`Delete category "${cat.title}"?`)) {
                                await api.deleteCategory(cat.id);
                                setCategories(categories.filter((c) => c.id !== cat.id));
                                onNotify('Category deleted');
                                onRefreshData();
                              }
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Gallery Images</span>
                <button
                  className="admin-save-btn"
                  onClick={() => setGalleryModal({ open: true })}
                >
                  <Plus size={16} />
                  Add Photo
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '10px', background: 'white' }}>
                      <p style={{ fontWeight: 600, fontSize: '13px', margin: 0 }}>{item.title}</p>
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="admin-action-btn action-delete"
                          onClick={async () => {
                            if (confirm(`Delete gallery image "${item.title}"?`)) {
                              await api.deleteGalleryItem(item.id);
                              setGallery(gallery.filter((g) => g.id !== item.id));
                              onNotify('Gallery image deleted');
                              onRefreshData();
                            }
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BLOGS */}
          {activeTab === 'blogs' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Blog Articles</span>
                <button
                  className="admin-save-btn"
                  onClick={() => setBlogModal({ open: true })}
                >
                  <Plus size={16} />
                  Add Blog Article
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>{b.title}</h4>
                      <p style={{ color: '#b2744c', fontSize: '12px', margin: '0 0 6px 0', fontWeight: 600 }}>
                        {b.author} • {b.date}
                      </p>
                      <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{b.summary}</p>
                    </div>
                    <div>
                      <button
                        className="admin-action-btn action-edit"
                        onClick={() => setBlogModal({ open: true, item: b })}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        className="admin-action-btn action-delete"
                        onClick={async () => {
                          if (confirm(`Delete blog "${b.title}"?`)) {
                            await api.deleteBlog(b.id);
                            setBlogs(blogs.filter((blog) => blog.id !== b.id));
                            onNotify('Blog article deleted');
                            onRefreshData();
                          }
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: INQUIRIES INBOX */}
          {activeTab === 'messages' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Customer Inquiries ({messages.length})</span>
              </div>

              {messages.length === 0 ? (
                <p style={{ color: '#888' }}>No inquiries received yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Message</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontSize: '12px', color: '#777', whiteSpace: 'nowrap' }}>
                          {new Date(m.createdAt).toLocaleDateString()}{' '}
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td><strong>{m.name}</strong></td>
                        <td>{m.email}</td>
                        <td>{m.phone || '-'}</td>
                        <td style={{ maxWidth: '300px' }}>{m.message}</td>
                        <td>
                          <button
                            className="admin-action-btn action-delete"
                            onClick={async () => {
                              await api.deleteContact(m.id);
                              setMessages(messages.filter((msg) => msg.id !== m.id));
                              onNotify('Inquiry deleted');
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 10: MEDIA UPLOADER */}
          {activeTab === 'uploader' && (
            <div className="admin-panel-card">
              <div className="admin-panel-title">
                <span>Fast Image Uploader</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Upload images directly to the Golang backend server. Once uploaded, copy the URL to easily paste into any logo, banner, product, or menu field.
              </p>

              <label className="uploader-box" style={{ display: 'block' }}>
                <Upload size={40} color="#b2744c" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>
                  {uploading ? 'Uploading to Server...' : 'Click to Browse or Drag Image Here'}
                </h4>
                <p style={{ fontSize: '13px', color: '#999' }}>Supports PNG, JPG, JPEG, WEBP, AVIF</p>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleFileUpload(e.target.files[0]);
                      if (url) setUploadResultUrl(url);
                    }
                  }}
                />
              </label>

              {uploadResultUrl && (
                <div style={{ marginTop: '25px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>
                    <CheckCircle size={18} /> Upload Complete!
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      readOnly
                      value={uploadResultUrl}
                      style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                    <button
                      className="admin-save-btn"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(uploadResultUrl);
                        onNotify('Copied image URL to clipboard!');
                      }}
                    >
                      <Copy size={14} /> Copy URL
                    </button>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <img
                      src={uploadResultUrl}
                      alt="Uploaded preview"
                      style={{ maxHeight: '140px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS FOR CRUD --- */}

      {/* MENU ITEM MODAL */}
      {menuModal.open && (
        <MenuItemModal
          item={menuModal.item}
          onClose={() => setMenuModal({ open: false })}
          onSave={async (itemData) => {
            if (menuModal.item?.id) {
              const updated = await api.updateMenuItem(menuModal.item.id, itemData);
              setMenuItems(menuItems.map((m) => (m.id === updated.id ? updated : m)));
              onNotify('Menu item updated successfully');
            } else {
              const created = await api.createMenuItem(itemData);
              setMenuItems([...menuItems, created]);
              onNotify('Menu item added successfully');
            }
            onRefreshData();
            setMenuModal({ open: false });
          }}
          onUpload={handleFileUpload}
        />
      )}

      {/* PRODUCT MODAL */}
      {productModal.open && (
        <ProductModal
          item={productModal.item}
          onClose={() => setProductModal({ open: false })}
          onSave={async (data) => {
            if (productModal.item?.id) {
              const updated = await api.updateProduct(productModal.item.id, data);
              setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
              onNotify('Product updated successfully');
            } else {
              const created = await api.createProduct(data);
              setProducts([...products, created]);
              onNotify('Product added successfully');
            }
            onRefreshData();
            setProductModal({ open: false });
          }}
          onUpload={handleFileUpload}
        />
      )}

      {/* CATEGORY MODAL */}
      {categoryModal.open && (
        <CategoryModal
          item={categoryModal.item}
          onClose={() => setCategoryModal({ open: false })}
          onSave={async (data) => {
            if (categoryModal.item?.id) {
              const updated = await api.updateCategory(categoryModal.item.id, data);
              setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
              onNotify('Category updated');
            } else {
              const created = await api.createCategory(data);
              setCategories([...categories, created]);
              onNotify('Category added');
            }
            onRefreshData();
            setCategoryModal({ open: false });
          }}
          onUpload={handleFileUpload}
        />
      )}

      {/* GALLERY MODAL */}
      {galleryModal.open && (
        <GalleryModal
          item={galleryModal.item}
          onClose={() => setGalleryModal({ open: false })}
          onSave={async (data) => {
            if (galleryModal.item?.id) {
              const updated = await api.updateGalleryItem(galleryModal.item.id, data);
              setGallery(gallery.map((g) => (g.id === updated.id ? updated : g)));
              onNotify('Gallery photo updated');
            } else {
              const created = await api.createGalleryItem(data);
              setGallery([...gallery, created]);
              onNotify('Gallery photo added');
            }
            onRefreshData();
            setGalleryModal({ open: false });
          }}
          onUpload={handleFileUpload}
        />
      )}

      {/* BLOG MODAL */}
      {blogModal.open && (
        <BlogModal
          item={blogModal.item}
          onClose={() => setBlogModal({ open: false })}
          onSave={async (data) => {
            if (blogModal.item?.id) {
              const updated = await api.updateBlog(blogModal.item.id, data);
              setBlogs(blogs.map((b) => (b.id === updated.id ? updated : b)));
              onNotify('Blog article updated');
            } else {
              const created = await api.createBlog(data);
              setBlogs([created, ...blogs]);
              onNotify('Blog article published');
            }
            onRefreshData();
            setBlogModal({ open: false });
          }}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

// --- SUB-MODAL COMPONENTS ---

interface MenuItemModalProps {
  item?: MenuItem;
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, onSave, onUpload }) => {
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState(item?.category || 'Hot Brews');
  const [price, setPrice] = useState(item?.price || 99);
  const [originalPrice, setOriginalPrice] = useState(item?.originalPrice || 110);
  const [rating, setRating] = useState(item?.rating || 5);
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [description, setDescription] = useState(item?.description || '');
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Menu Item' : 'New Menu Item'}</h3>
        </div>
        <div className="modal-body">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Item Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-field">
              <label>Selling Price ($) *</label>
              <input type="number" step="0.5" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
            </div>
            <div className="admin-field">
              <label>Original / Strike Price ($)</label>
              <input type="number" step="0.5" value={originalPrice} onChange={(e) => setOriginalPrice(parseFloat(e.target.value))} />
            </div>
            <div className="admin-field">
              <label>Star Rating (1-5)</label>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label>Image URL or Direct Upload</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label style={{ background: '#b2744c', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await onUpload(e.target.files[0]);
                      if (url) setImageUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="admin-field">
            <label>Short Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input type="checkbox" id="avail" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            <label htmlFor="avail" style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Item is Available in Stock</label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="about-btn" style={{ padding: '8px 18px' }} onClick={onClose}>Cancel</button>
          <button
            className="admin-save-btn"
            style={{ padding: '8px 20px' }}
            onClick={() => onSave({ name, category, price, originalPrice, rating, imageUrl, description, isAvailable })}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductModalProps {
  item?: Product;
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

const ProductModal: React.FC<ProductModalProps> = ({ item, onClose, onSave, onUpload }) => {
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || 120);
  const [originalPrice, setOriginalPrice] = useState(item?.originalPrice || 150);
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [description, setDescription] = useState(item?.description || '');
  const [badge, setBadge] = useState(item?.badge || '');
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Packaged Product' : 'Add Packaged Product'}</h3>
        </div>
        <div className="modal-body">
          <div className="admin-field">
            <label>Product Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="admin-grid-3">
            <div className="admin-field">
              <label>Price ($) *</label>
              <input type="number" step="0.5" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
            </div>
            <div className="admin-field">
              <label>Original Price ($)</label>
              <input type="number" step="0.5" value={originalPrice} onChange={(e) => setOriginalPrice(parseFloat(e.target.value))} />
            </div>
            <div className="admin-field">
              <label>Badge (e.g. Bestseller)</label>
              <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} />
            </div>
          </div>

          <div className="admin-field">
            <label>Product Image URL or Upload</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label style={{ background: '#b2744c', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await onUpload(e.target.files[0]);
                      if (url) setImageUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="admin-field">
            <label>Description / Roast Profile</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input type="checkbox" id="prod-avail" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            <label htmlFor="prod-avail" style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>In Stock</label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="about-btn" style={{ padding: '8px 18px' }} onClick={onClose}>Cancel</button>
          <button
            className="admin-save-btn"
            style={{ padding: '8px 20px' }}
            onClick={() => onSave({ name, price, originalPrice, imageUrl, description, badge, isAvailable })}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

interface CategoryModalProps {
  item?: Category;
  onClose: () => void;
  onSave: (data: Partial<Category>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ item, onClose, onSave, onUpload }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [sortOrder, setSortOrder] = useState(item?.sortOrder || 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Category' : 'Add Category'}</h3>
        </div>
        <div className="modal-body">
          <div className="admin-field">
            <label>Category Title *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Image URL or Upload</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label style={{ background: '#b2744c', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await onUpload(e.target.files[0]);
                      if (url) setImageUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div className="admin-field">
            <label>Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value))} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="about-btn" style={{ padding: '8px 18px' }} onClick={onClose}>Cancel</button>
          <button
            className="admin-save-btn"
            style={{ padding: '8px 20px' }}
            onClick={() => onSave({ title, imageUrl, sortOrder })}
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

interface GalleryModalProps {
  item?: GalleryItem;
  onClose: () => void;
  onSave: (data: Partial<GalleryItem>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose, onSave, onUpload }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Photo to Gallery</h3>
        </div>
        <div className="modal-body">
          <div className="admin-field">
            <label>Photo Caption / Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Image URL or Direct Upload *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label style={{ background: '#b2744c', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await onUpload(e.target.files[0]);
                      if (url) setImageUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="about-btn" style={{ padding: '8px 18px' }} onClick={onClose}>Cancel</button>
          <button
            className="admin-save-btn"
            style={{ padding: '8px 20px' }}
            onClick={() => onSave({ title, imageUrl })}
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

interface BlogModalProps {
  item?: BlogPost;
  onClose: () => void;
  onSave: (data: Partial<BlogPost>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

const BlogModal: React.FC<BlogModalProps> = ({ item, onClose, onSave, onUpload }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [author, setAuthor] = useState(item?.author || 'Admin');
  const [date, setDate] = useState(item?.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [summary, setSummary] = useState(item?.summary || '');
  const [content, setContent] = useState(item?.content || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Blog Article' : 'Write New Blog Article'}</h3>
        </div>
        <div className="modal-body">
          <div className="admin-field">
            <label>Article Title *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Publication Date</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="admin-field">
            <label>Cover Image URL or Upload</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <label style={{ background: '#b2744c', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await onUpload(e.target.files[0]);
                      if (url) setImageUrl(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="admin-field">
            <label>Article Summary (Preview Snippet)</label>
            <textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Full Content</label>
            <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="about-btn" style={{ padding: '8px 18px' }} onClick={onClose}>Cancel</button>
          <button
            className="admin-save-btn"
            style={{ padding: '8px 20px' }}
            onClick={() => onSave({ title, author, date, summary, content, imageUrl })}
          >
            Publish Article
          </button>
        </div>
      </div>
    </div>
  );
};
