export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  productCount?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category | string;
  price: number;
  compareAtPrice?: number;
  weight: string;
  stock: number;
  sku: string;
  ingredients: string;
  allergens: string;
  storageInstructions: string;
  images: string[];
  status: 'active' | 'inactive';
  featured: boolean;
  bestseller: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  weight?: string;
}

export interface OrderTimeline {
  status: string;
  note: string;
  timestamp: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  address?: UserAddress;
  createdAt?: string;
}

export interface HomepageContent {
  hero: {
    headline: string;
    subheadline: string;
    heroImage: string;
    badgeText: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  bestsellerSectionTitle: string;
  bestsellerSectionSubtitle: string;
  storySection: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    image: string;
    badge: string;
  };
  visitSection: {
    title: string;
    description: string;
    address: string;
    hours: string;
    image: string;
  };
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  email: string;
  address: {
    shop: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  openingHours: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  currency: string;
  taxRate: number;
  abn: string;
  orderPrefix: string;
}
