import {
  SiteSettings,
  Category,
  MenuItem,
  Product,
  GalleryItem,
  BlogPost,
  ContactMessage,
  Order
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<SiteSettings>(res);
  },

  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return handleResponse<SiteSettings>(res);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<Category[]>(res);
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return handleResponse<Category>(res);
  },

  async updateCategory(id: number, cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return handleResponse<Category>(res);
  },

  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menu`);
    return handleResponse<MenuItem[]>(res);
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<MenuItem>(res);
  },

  async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<MenuItem>(res);
  },

  async deleteMenuItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse<Product[]>(res);
  },

  async createProduct(prod: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: number, prod: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    return handleResponse<GalleryItem[]>(res);
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<GalleryItem>(res);
  },

  async updateGalleryItem(id: number, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse<GalleryItem>(res);
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Blogs
  async getBlogs(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/blogs`);
    return handleResponse<BlogPost[]>(res);
  },

  async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
    return handleResponse<BlogPost>(res);
  },

  async updateBlog(id: number, blog: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
    return handleResponse<BlogPost>(res);
  },

  async deleteBlog(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Contact Messages
  async submitContact(data: { name: string; email: string; phone: string; message: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async getContacts(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`);
    return handleResponse<ContactMessage[]>(res);
  },

  async deleteContact(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Orders
  async createOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return handleResponse<Order>(res);
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    return handleResponse<Order[]>(res);
  },

  async updateOrder(id: number, data: { status: string }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(res);
  },

  async deleteOrder(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },

  // Image File Upload
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<{ url: string; filename: string }>(res);
  },

  // Admin Authentication
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token: string; message: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ success: boolean; token: string; message: string }>(res);
  }
};
