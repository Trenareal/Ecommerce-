export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  stock: number;
  initialStock: number;
  description: string;
  specs: string[];
  isExpress: boolean;
  flashSale?: boolean;
  directDistribution?: boolean;
  isExportGrade?: boolean;
  exportCertifications?: string[];
  shortDescription?: string;
  brand?: string;
  sku?: string;
  videoUrl?: string;
  weight?: string;
  dimensions?: string;
  status?: 'Published' | 'Draft';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  phone: string;
  customerEmail?: string;
  address: string;
  state: string;
  country?: string;
  isInternational?: boolean;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
  deliveryTime?: string;
  confirmedAt?: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  type: 'purchase' | 'restock' | 'system';
  timestamp: string;
  productId?: string;
}

export interface VerifiedPhoto {
  id: string;
  productId: string;
  productTitle: string;
  photo: string;
  timestamp: string;
  stock: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  isActive: boolean;
  usageCount: number;
}

export interface Promotion {
  id: string;
  title: string;
  category: string;
  discountPercent: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'bank';
  bankName?: string;
  accountNumber?: string;
  cardBrand?: 'Visa' | 'Mastercard' | 'Verve';
  last4: string;
  expiryDate?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalSpent: number;
  orderCount: number;
  isActive: boolean;
  joinedAt: string;
  password?: string;
  addresses?: ShippingAddress[];
  savedPayments?: SavedPaymentMethod[];
  wishlist?: string[];
}

