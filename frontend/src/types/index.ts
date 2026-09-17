export interface SiteSettings {
  id?: number;
  siteName: string;
  logoUrl: string;
  heroHeading: string;
  heroSubheading: string;
  heroImageUrl: string;
  heroBtnText: string;
  heroBtnLink: string;
  aboutHeading: string;
  aboutSubheading: string;
  aboutStory1: string;
  aboutStory2: string;
  aboutStory3: string;
  aboutImageUrl: string;
  aboutBtnText: string;
  phone: string;
  email: string;
  address: string;
  contactNote: string;
  socialTwitter: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialPinterest: string;
  footerCreditName: string;
  footerCreditLink: string;
  copyrightText: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  title: string;
  imageUrl: string;
  sortOrder: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  imageUrl: string;
  description: string;
  isAvailable: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  description: string;
  badge: string;
  isAvailable: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  sortOrder: number;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // e.g. "menu-1" or "prod-2"
  originalId: number;
  type: 'menu' | 'product';
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
