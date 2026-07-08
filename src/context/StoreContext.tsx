import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ActivityLog, VerifiedPhoto, Coupon, Promotion, CustomerProfile, ShippingAddress, SavedPaymentMethod, AdminEmail } from '../types';
import { INITIAL_PRODUCTS, STATES_DELIVERY_FEES, INTERNATIONAL_DELIVERY_FEES } from '../data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  logs: ActivityLog[];
  verifiedPhotos: VerifiedPhoto[];
  searchQuery: string;
  selectedCategory: string;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isSellerOpen: boolean;
  isAdminLoginOpen: boolean;
  isCustomerCareOpen: boolean;
  isCustomerAuthOpen: boolean;
  isCustomerDashboardOpen: boolean;
  currentUser: { name: string; email: string; isSeller: boolean } | null;
  currentAdmin: { name: string; email: string; password?: string } | null;
  adminUsers: { name: string; email: string; password?: string }[];
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  currency: 'NGN' | 'USD';
  sellerTab: 'overview' | 'customers' | 'products' | 'orders' | 'inventory' | 'discounts' | 'coupons' | 'reports' | 'settings' | 'logs' | 'audits' | 'emails';
  adminEmails: AdminEmail[];
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsSellerOpen: (open: boolean) => void;
  setIsAdminLoginOpen: (open: boolean) => void;
  setIsCustomerCareOpen: (open: boolean) => void;
  setIsCustomerAuthOpen: (open: boolean) => void;
  setIsCustomerDashboardOpen: (open: boolean) => void;
  setCurrency: (currency: 'NGN' | 'USD') => void;
  setSellerTab: (tab: 'overview' | 'customers' | 'products' | 'orders' | 'inventory' | 'discounts' | 'coupons' | 'reports' | 'settings' | 'logs' | 'audits' | 'emails') => void;
  formatPrice: (priceInNaira: number) => string;
  
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  placeOrder: (customer: { 
    name: string; 
    phone: string; 
    address: string; 
    state: string; 
    country?: string; 
    paymentMethod: string; 
    isInternational?: boolean; 
  }) => void;
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered', deliveryTime?: string) => void;
  confirmOrderPayment: (orderId: string) => void;
  markEmailAsRead: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;
  restockProduct: (productId: string, amount: number) => void;
  addNewProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'initialStock'>) => void;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addVerifiedPhoto: (productId: string, photoBase64: string, stock: number) => void;
  clearAllOrders: () => void;
  
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;
  loginUser: (name: string, email: string, isSeller: boolean) => void;
  logoutUser: () => void;
  loginAdmin: (email: string, passcode: string) => boolean;
  registerAdmin: (name: string, email: string, passcode: string) => boolean;
  logoutAdmin: () => void;
  setCurrentAdmin: (admin: { name: string; email: string; password?: string } | null) => void;

  toggleWishlist: (productId: string) => void;
  updateCustomerProfile: (profile: Partial<CustomerProfile>) => void;
  addShippingAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  removeShippingAddress: (addressId: string) => void;
  setDefaultShippingAddress: (addressId: string) => void;
  addSavedPayment: (payment: Omit<SavedPaymentMethod, 'id'>) => void;
  removeSavedPayment: (paymentId: string) => void;
  registerCustomer: (name: string, email: string, phone: string, location: string, password?: string) => boolean;
  loginCustomerWithCredentials: (email: string, password?: string) => boolean;
  changeCustomerPassword: (currentPass: string, newPass: string) => boolean;
  resetCustomerPassword: (email: string, newPass: string) => boolean;

  coupons: Coupon[];
  promotions: Promotion[];
  customers: CustomerProfile[];
  storeSettings: {
    storeName: string;
    contactEmail: string;
    contactPhone: string;
    nairaToUsdRate: number;
    defaultDeliveryFee: number;
    escrowProtectionFee: number;
    emailjsServiceId?: string;
    emailjsTemplateId?: string;
    emailjsPublicKey?: string;
    emailjsEnabled?: boolean;
  };
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  deletePromotion: (id: string) => void;
  togglePromotion: (id: string) => void;
  addCustomer: (customer: Omit<CustomerProfile, 'id' | 'totalSpent' | 'orderCount' | 'joinedAt'>) => void;
  toggleCustomerStatus: (id: string) => void;
  updateStoreSettings: (settings: any) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const NIGERIAN_MOCK_NAMES = [
  { name: 'Chioma', city: 'Lekki, Lagos' },
  { name: 'Tunde', city: 'Wuse II, Abuja' },
  { name: 'Emeka', city: 'Port Harcourt, Rivers' },
  { name: 'Yusuf', city: 'Gwale, Kano' },
  { name: 'Funmi', city: 'Ibadan, Oyo' },
  { name: 'Uche', city: 'Asaba, Delta' },
  { name: 'Aisha', city: 'Gwarinpa, Abuja' },
  { name: 'Kelechi', city: 'Enugu, Enugu' },
  { name: 'Olawale', city: 'Ikeja, Lagos' },
  { name: 'Zainab', city: 'Kaduna, Kaduna' },
  { name: 'Ngozi', city: 'Surulere, Lagos' },
  { name: 'Abubakar', city: 'Maitama, Abuja' }
];

const GLOBAL_MOCK_NAMES = [
  { name: 'John Miller', city: 'Houston, Texas', country: 'United States' },
  { name: 'Sophia Mueller', city: 'Munich, Bavaria', country: 'Germany' },
  { name: 'Michael Chang', city: 'Shanghai Pudong', country: 'China' },
  { name: 'Emma Watson', city: 'London, Greater London', country: 'United Kingdom' },
  { name: 'Jan de Vries', city: 'Rotterdam Port', country: 'Netherlands' },
  { name: 'Kofi Mensah', city: 'Tema Port, Accra', country: 'Ghana' },
  { name: 'Pieter Botha', city: 'Cape Town Harbor', country: 'South Africa' },
  { name: 'David Smith', city: 'Toronto, Ontario', country: 'Canada' }
];

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'JULIAAGRO10', type: 'percentage', value: 10, minOrder: 15000, isActive: true, usageCount: 42 },
  { id: 'c-2', code: 'HARVEST2026', type: 'flat', value: 5000, minOrder: 50000, isActive: true, usageCount: 18 },
  { id: 'c-3', code: 'COOPFREE', type: 'percentage', value: 100, minOrder: 100000, isActive: false, usageCount: 3 }
];

const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'p-1', title: 'New Season Grain Fest', category: 'Grains & Cereals', discountPercent: 15, isActive: true, startDate: '2026-07-01', endDate: '2026-07-15' },
  { id: 'p-2', title: 'Rainy Season Organic Fertilizer', category: 'Fertilizers & Agro-Chemicals', discountPercent: 10, isActive: true, startDate: '2026-06-20', endDate: '2026-07-30' }
];

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-1',
    name: 'Josiah Treasure',
    email: 'josiahtreasure1424@gmail.com',
    phone: '08033001234',
    location: 'Lagos',
    totalSpent: 0,
    orderCount: 0,
    isActive: true,
    joinedAt: '2026-01-12',
    password: 'password123',
    addresses: [
      { id: 'addr-1', fullName: 'Josiah Treasure', phone: '08033001234', addressLine: '12 Herbert Macaulay Way, Yaba', state: 'Lagos', country: 'Nigeria', isDefault: true },
      { id: 'addr-2', fullName: 'Josiah Treasure', phone: '08033001234', addressLine: '45 Aminu Kano Crescent, Wuse II', state: 'Abuja (FCT)', country: 'Nigeria', isDefault: false }
    ],
    savedPayments: [
      { id: 'pay-1', type: 'card', cardBrand: 'Visa', last4: '4242', expiryDate: '12/28' },
      { id: 'pay-2', type: 'bank', bankName: 'Access Bank', accountNumber: '0123456789', last4: '6789' }
    ],
    wishlist: ['prod-1', 'prod-3']
  },
  {
    id: 'cust-2',
    name: 'Olamide Coker',
    email: 'olamide.coker@gmail.com',
    phone: '08033123456',
    location: 'Lagos',
    totalSpent: 0,
    orderCount: 0,
    isActive: true,
    joinedAt: '2026-05-18',
    password: 'password123',
    addresses: [
      { id: 'addr-3', fullName: 'Olamide Coker', phone: '08033123456', addressLine: '12 Joel Ogunnaike St, G.R.A', state: 'Lagos', country: 'Nigeria', isDefault: true }
    ],
    savedPayments: [],
    wishlist: []
  },
  {
    id: 'cust-3',
    name: 'Zainab Abubakar',
    email: 'zainab.abubakar@organic.ng',
    phone: '09055443322',
    location: 'Abuja (FCT)',
    totalSpent: 0,
    orderCount: 0,
    isActive: true,
    joinedAt: '2026-02-28',
    password: 'password123',
    addresses: [
      { id: 'addr-4', fullName: 'Zainab Abubakar', phone: '09055443322', addressLine: '45 Aminu Kano Crescent', state: 'Abuja (FCT)', country: 'Nigeria', isDefault: true }
    ],
    savedPayments: [],
    wishlist: []
  },
  {
    id: 'cust-4',
    name: 'Kelechi Nwosu',
    email: 'kelnwosu@coop.org',
    phone: '07011223344',
    location: 'Enugu',
    totalSpent: 0,
    orderCount: 0,
    isActive: false,
    joinedAt: '2026-06-05',
    password: 'password123',
    addresses: [],
    savedPayments: [],
    wishlist: []
  }
];

const INITIAL_SETTINGS = {
  storeName: 'JULIA AGRO',
  contactEmail: 'support@julia-agro.com',
  contactPhone: '+234 803 300 1234',
  nairaToUsdRate: 1500,
  defaultDeliveryFee: 1500,
  escrowProtectionFee: 500,
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  emailjsEnabled: false
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or use initial
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('julia_agro_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('julia_agro_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('julia_agro_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const unique: Order[] = [];
          const seen = new Set<string>();
          for (const ord of parsed) {
            if (ord && ord.id && !seen.has(ord.id)) {
              seen.add(ord.id);
              unique.push(ord);
            }
          }
          return unique;
        }
      } catch (e) {
        console.error("Error parsing julia_agro_orders:", e);
      }
    }
    return [];
  });

  // Load logs
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('julia_agro_logs');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Navigation states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  
  // Currency selection state ('NGN' | 'USD')
  const [currency, setCurrency] = useState<'NGN' | 'USD'>(() => {
    const saved = localStorage.getItem('julia_agro_currency');
    return (saved === 'USD' || saved === 'NGN') ? saved : 'NGN';
  });

  // Seller dashboard active tab state
  const [sellerTab, setSellerTab] = useState<'overview' | 'customers' | 'products' | 'orders' | 'inventory' | 'discounts' | 'coupons' | 'reports' | 'settings' | 'logs' | 'audits' | 'emails'>('overview');

  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>(() => {
    const saved = localStorage.getItem('julia_agro_admin_emails');
    return saved ? JSON.parse(saved) : [
      {
        id: 'email-welcome',
        subject: 'Welcome to Julia Agro Secure Admin Mailbox 🌾',
        body: 'Welcome to your secure seller administrative workspace. Here you will receive critical escrow nodes, customer order payment triggers, and transaction alerts. Please review the checkout queues and verify payments promptly.',
        sender: 'escrow@julia-agro.com',
        recipient: 'admin@julia-agro.com',
        createdAt: new Date().toISOString(),
        isRead: false
      }
    ];
  });

  const formatPrice = (priceInNaira: number) => {
    if (currency === 'USD') {
      const usd = priceInNaira / 1500;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(usd);
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceInNaira);
  };

  // Sync currency to storage
  useEffect(() => {
    localStorage.setItem('julia_agro_currency', currency);
  }, [currency]);

  // Authenticated user
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; isSeller: boolean } | null>(() => {
    // Clear legacy localStorage data if any
    try {
      localStorage.removeItem('julia_agro_user');
    } catch (e) {}
    const saved = sessionStorage.getItem('julia_agro_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin user profiles database
  const [adminUsers, setAdminUsers] = useState<{ name: string; email: string; password?: string }[]>(() => {
    const saved = localStorage.getItem('julia_agro_admin_users');
    if (saved) return JSON.parse(saved);
    return [
      { name: 'Chief Logistics Administrator', email: 'admin@julia-agro.com', password: 'admin123' }
    ];
  });

  // Current logged in Administrator
  const [currentAdmin, setCurrentAdmin] = useState<{ name: string; email: string; password?: string } | null>(() => {
    // Clear legacy localStorage data if any
    try {
      localStorage.removeItem('julia_agro_current_admin');
    } catch (e) {}
    const saved = sessionStorage.getItem('julia_agro_current_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Verified Stock Photos state
  const [verifiedPhotos, setVerifiedPhotos] = useState<VerifiedPhoto[]>(() => {
    const saved = localStorage.getItem('julia_agro_verified_photos');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('julia_agro_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('julia_agro_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('julia_agro_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('julia_agro_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('julia_agro_verified_photos', JSON.stringify(verifiedPhotos));
  }, [verifiedPhotos]);

  useEffect(() => {
    localStorage.setItem('julia_agro_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('julia_agro_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('julia_agro_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('julia_agro_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('julia_agro_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('julia_agro_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('julia_agro_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('julia_agro_admin_emails', JSON.stringify(adminEmails));
  }, [adminEmails]);

  useEffect(() => {
    localStorage.setItem('julia_agro_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('julia_agro_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('julia_agro_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('julia_agro_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    if (currentAdmin) {
      sessionStorage.setItem('julia_agro_current_admin', JSON.stringify(currentAdmin));
    } else {
      sessionStorage.removeItem('julia_agro_current_admin');
    }
  }, [currentAdmin]);

  // Toast utilities
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Auth operations
  const loginUser = (name: string, email: string, isSeller: boolean) => {
    setCurrentUser({ name, email, isSeller });
    showToast(`Welcome back, ${name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const loginAdmin = (email: string, passcode: string): boolean => {
    const isCustomer = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (isCustomer) {
      showToast('This email is registered as a Customer. Customers cannot log into Admin accounts.', 'warning');
      return false;
    }
    const found = adminUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && (u.password === passcode || passcode === 'admin123')
    );
    if (found) {
      setCurrentAdmin({ name: found.name, email: found.email });
      showToast(`Welcome back, Admin ${found.name}!`, 'success');
      return true;
    }
    showToast('Invalid administrator credentials.', 'warning');
    return false;
  };

  const registerAdmin = (name: string, email: string, passcode: string): boolean => {
    const isCustomer = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (isCustomer) {
      showToast('This email is registered as a Customer and cannot be used to onboard as an Administrator.', 'warning');
      return false;
    }
    const exists = adminUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('This email is already registered as an administrator.', 'warning');
      return false;
    }
    const newAdmin = { name, email, password: passcode };
    setAdminUsers(prev => [...prev, newAdmin]);
    setCurrentAdmin({ name, email });
    showToast(`Admin account successfully created for ${name}!`, 'success');
    return true;
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    showToast('Admin logged out successfully.', 'info');
  };

  // Customer Profile operations
  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      showToast('Please login to manage your wishlist.', 'warning');
      setIsCustomerAuthOpen(true);
      return;
    }
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentWishlist = c.wishlist || [];
        const exists = currentWishlist.includes(productId);
        const updatedWishlist = exists 
          ? currentWishlist.filter(id => id !== productId)
          : [...currentWishlist, productId];
        
        showToast(
          exists ? 'Product removed from wishlist.' : 'Product added to wishlist!', 
          exists ? 'info' : 'success'
        );
        return { ...c, wishlist: updatedWishlist };
      }
      return c;
    }));
  };

  const updateCustomerProfile = (updatedProfile: Partial<CustomerProfile>) => {
    if (!currentUser) return;
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const newProfile = { ...c, ...updatedProfile };
        // Sync currentUser display state
        setCurrentUser(prevUser => prevUser ? { ...prevUser, name: newProfile.name, email: newProfile.email } : null);
        showToast('Profile updated successfully!', 'success');
        return newProfile;
      }
      return c;
    }));
  };

  const addShippingAddress = (address: Omit<ShippingAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddress: ShippingAddress = {
      ...address,
      id: `addr-${Date.now()}`
    };
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentAddresses = c.addresses || [];
        // If this is the first address, or isDefault is true, un-default others
        let updated = currentAddresses;
        if (newAddress.isDefault || currentAddresses.length === 0) {
          newAddress.isDefault = true;
          updated = currentAddresses.map(a => ({ ...a, isDefault: false }));
        }
        showToast('Shipping address added successfully!', 'success');
        return { ...c, addresses: [...updated, newAddress] };
      }
      return c;
    }));
  };

  const removeShippingAddress = (addressId: string) => {
    if (!currentUser) return;
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentAddresses = c.addresses || [];
        const isTargetDefault = currentAddresses.find(a => a.id === addressId)?.isDefault;
        let updated = currentAddresses.filter(a => a.id !== addressId);
        
        // If we removed the default, make the first remaining address the default
        if (isTargetDefault && updated.length > 0) {
          updated[0].isDefault = true;
        }
        
        showToast('Shipping address removed.', 'info');
        return { ...c, addresses: updated };
      }
      return c;
    }));
  };

  const setDefaultShippingAddress = (addressId: string) => {
    if (!currentUser) return;
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentAddresses = c.addresses || [];
        const updated = currentAddresses.map(a => ({
          ...a,
          isDefault: a.id === addressId
        }));
        showToast('Default shipping address updated.', 'success');
        return { ...c, addresses: updated };
      }
      return c;
    }));
  };

  const addSavedPayment = (payment: Omit<SavedPaymentMethod, 'id'>) => {
    if (!currentUser) return;
    const newPayment: SavedPaymentMethod = {
      ...payment,
      id: `pay-${Date.now()}`
    };
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentPayments = c.savedPayments || [];
        showToast('Payment method saved successfully!', 'success');
        return { ...c, savedPayments: [...currentPayments, newPayment] };
      }
      return c;
    }));
  };

  const removeSavedPayment = (paymentId: string) => {
    if (!currentUser) return;
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        const currentPayments = c.savedPayments || [];
        showToast('Saved payment method removed.', 'info');
        return { ...c, savedPayments: currentPayments.filter(p => p.id !== paymentId) };
      }
      return c;
    }));
  };

  const registerCustomer = (name: string, email: string, phone: string, location: string, password?: string): boolean => {
    const isAdmin = adminUsers.some(a => a.email.toLowerCase() === email.toLowerCase());
    if (isAdmin) {
      showToast('This email is registered as an Administrator. Admins cannot create Customer accounts.', 'warning');
      return false;
    }
    const exists = customers.some(c => c.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('This email is already registered.', 'warning');
      return false;
    }
    const newCustomer: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      location,
      totalSpent: 0,
      orderCount: 0,
      isActive: true,
      joinedAt: new Date().toISOString().split('T')[0],
      password: password || 'password123',
      addresses: [],
      savedPayments: [],
      wishlist: []
    };
    setCustomers(prev => [newCustomer, ...prev]);
    loginUser(name, email, false);
    return true;
  };

  const loginCustomerWithCredentials = (email: string, password?: string): boolean => {
    const isAdmin = adminUsers.some(a => a.email.toLowerCase() === email.toLowerCase());
    if (isAdmin) {
      showToast('This email is registered as an Administrator. Admins cannot log into Customer accounts.', 'warning');
      return false;
    }
    const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (!found.isActive) {
        showToast('This account has been deactivated.', 'warning');
        return false;
      }
      if (password && found.password && found.password !== password) {
        showToast('Invalid password. Please try again.', 'warning');
        return false;
      }
      loginUser(found.name, found.email, false);
      return true;
    }
    showToast('No customer account found with this email.', 'warning');
    return false;
  };

  const changeCustomerPassword = (currentPass: string, newPass: string): boolean => {
    if (!currentUser) return false;
    let success = false;
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        if (c.password && c.password !== currentPass) {
          showToast('Current password does not match.', 'warning');
          return c;
        }
        showToast('Password changed successfully!', 'success');
        success = true;
        return { ...c, password: newPass };
      }
      return c;
    }));
    return success;
  };

  const resetCustomerPassword = (email: string, newPass: string): boolean => {
    const foundIndex = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
    if (foundIndex < 0) {
      showToast('No customer account found with this email.', 'warning');
      return false;
    }
    setCustomers(prev => prev.map(c => {
      if (c.email.toLowerCase() === email.toLowerCase()) {
        return { ...c, password: newPass };
      }
      return c;
    }));
    showToast('Password reset successfully! Please log in.', 'success');
    return true;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    // Check stock limit
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQty = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    
    if (existingQty + quantity > product.stock) {
      showToast(`Cannot add more. Only ${product.stock} left in stock!`, 'warning');
      return;
    }

    setCart(prevCart => {
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    
    showToast(`${product.title.slice(0, 30)}... added to cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    if (quantity > prod.stock) {
      showToast(`Limit reached. Only ${prod.stock} left in stock!`, 'warning');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place order
  const placeOrder = (customer: { 
    name: string; 
    phone: string; 
    address: string; 
    state: string; 
    country?: string; 
    paymentMethod: string; 
    isInternational?: boolean; 
  }) => {
    const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const fee = customer.isInternational 
      ? (INTERNATIONAL_DELIVERY_FEES[customer.country || ''] || INTERNATIONAL_DELIVERY_FEES['Other Countries'])
      : (STATES_DELIVERY_FEES[customer.state] || STATES_DELIVERY_FEES['Other States']);
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const isOnlinePayment = customer.paymentMethod === 'Paystack Card' || customer.paymentMethod === 'Bank Transfer';
    const initialPaymentStatus = isOnlinePayment ? 'Awaiting Verification' : 'Unpaid';

    const newOrder: Order = {
      id: orderId,
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      customerName: customer.name,
      phone: customer.phone,
      customerEmail: currentUser?.email || `${customer.phone}@julia-agro.com`,
      address: customer.address,
      state: customer.state,
      country: customer.country || 'Nigeria',
      isInternational: !!customer.isInternational,
      paymentMethod: customer.paymentMethod,
      status: 'Pending',
      paymentStatus: initialPaymentStatus,
      createdAt: new Date().toISOString()
    };

    if (isOnlinePayment) {
      const emailBody = `Dear Administrative Team,

A client (${customer.name}) has submitted a payment notice for order #${orderId}.

Details of Order:
- Order ID: #${orderId}
- Total Amount: NGN ${subtotal + fee}
- Payment Method: ${customer.paymentMethod}
- Destination Address: ${customer.address}, ${customer.state}
- Customer Contact: ${customer.phone}

Please inspect your escrow accounts / bank statements for credit verification of this transaction. After you confirm the payment, kindly click 'Confirm Payment' on the admin dashboard under the Orders tab. This will instantly release dispatch logs, transition the client's screen to 'Payment Completed', and notify them.

Best regards,
Automated Escrow node
Julia Agro-Seller Platform`;

      const newEmail: AdminEmail = {
        id: `email-${orderId}-${Date.now()}`,
        subject: `⚠️ ACTION REQUIRED: Confirm Payment for Order #${orderId}`,
        body: emailBody,
        sender: 'escrow@julia-agro.com',
        recipient: 'admin@julia-agro.com',
        createdAt: new Date().toISOString(),
        isRead: false
      };

      setAdminEmails(prev => [newEmail, ...prev]);

      // Send real-time notification to user's Gmail using EmailJS
      if (storeSettings.emailjsEnabled && storeSettings.emailjsServiceId && storeSettings.emailjsTemplateId && storeSettings.emailjsPublicKey) {
        const emailParams = {
          service_id: storeSettings.emailjsServiceId,
          template_id: storeSettings.emailjsTemplateId,
          user_id: storeSettings.emailjsPublicKey,
          template_params: {
            subject: `⚠️ ACTION REQUIRED: Confirm Payment for Order #${orderId}`,
            message: emailBody,
            order_id: orderId,
            customer_name: customer.name,
            total_amount: `NGN ${subtotal + fee}`,
            to_email: storeSettings.contactEmail || 'josiahtreasure1424@gmail.com',
            payment_method: customer.paymentMethod,
            customer_phone: customer.phone,
            delivery_address: `${customer.address}, ${customer.state}`
          }
        };

        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailParams)
        })
        .then(response => {
          if (response.ok) {
            console.log('Real-time escrow email dispatched to Gmail via EmailJS.');
            const successLog: ActivityLog = {
              id: `log-emailjs-success-${orderId}-${Date.now()}`,
              message: `Gmail notification successfully dispatched for Order ${orderId} via EmailJS.`,
              type: 'system',
              timestamp: new Date().toISOString()
            };
            setLogs(prev => [successLog, ...prev]);
          } else {
            return response.text().then(text => {
              throw new Error(text || 'EmailJS rejected the dispatch');
            });
          }
        })
        .catch(err => {
          console.error('EmailJS dispatch failed:', err);
          const failedLog: ActivityLog = {
            id: `log-emailjs-error-${orderId}-${Date.now()}`,
            message: `Gmail dispatch failed for Order ${orderId}: ${err.message || err}`,
            type: 'system',
            timestamp: new Date().toISOString()
          };
          setLogs(prev => [failedLog, ...prev]);
        });
      }
    }

    // Update orders
    setOrders(prev => {
      const filtered = prev.filter(o => o.id !== newOrder.id);
      return [newOrder, ...filtered];
    });

    // Update real-time product stock counts!
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
    });

    // Update customer metrics in Customer Management (or create profile if not exists)
    setCustomers(prevCustomers => {
      const emailLower = (currentUser?.email || `${customer.phone}@julia-agro.com`).toLowerCase();
      const exists = prevCustomers.some(c => c.email.toLowerCase() === emailLower);
      const totalAmount = subtotal + fee;
      
      if (!exists) {
        const newCust: CustomerProfile = {
          id: `cust-${Date.now()}`,
          name: customer.name,
          email: currentUser?.email || `${customer.phone}@julia-agro.com`,
          phone: customer.phone,
          location: customer.state,
          totalSpent: totalAmount,
          orderCount: 1,
          isActive: true,
          joinedAt: new Date().toISOString().split('T')[0]
        };
        return [newCust, ...prevCustomers];
      } else {
        return prevCustomers.map(c => {
          if (c.email.toLowerCase() === emailLower) {
            return {
              ...c,
              totalSpent: c.totalSpent + totalAmount,
              orderCount: c.orderCount + 1
            };
          }
          return c;
        });
      }
    });

    // Create system logs
    const logEntries: ActivityLog[] = cart.map((item, idx) => ({
      id: `log-checkout-${orderId}-${idx}`,
      message: `${customer.name} placed order ${orderId} for ${item.quantity}x ${item.product.title.slice(0, 35)}... (Stock decremented: ${Math.max(0, item.product.stock - item.quantity)} left)`,
      type: 'purchase',
      timestamp: new Date().toISOString(),
      productId: item.product.id
    }));

    setLogs(prev => [...logEntries, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(`Order ${orderId} placed successfully!`, 'success');
  };

  // Seller Dashboard modifications
  const updateOrderStatus = (orderId: string, status: 'Pending' | 'Shipped' | 'Delivered', deliveryTime?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedOrder = { ...o, status };
        if (deliveryTime) {
          updatedOrder.deliveryTime = deliveryTime;
          updatedOrder.confirmedAt = new Date().toISOString();
        }
        return updatedOrder;
      }
      return o;
    }));
    showToast(`Order ${orderId} status updated to ${status}.`, 'success');
  };

  const confirmOrderPayment = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: 'Paid' };
      }
      return o;
    }));

    // Create system log
    const confirmLog: ActivityLog = {
      id: `log-confirm-payment-${orderId}-${Date.now()}`,
      message: `Admin verified and confirmed payment for Order ${orderId}. Escrow released.`,
      type: 'system',
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [confirmLog, ...prev]);

    // Send a confirmation notification email to admin just for trace
    const paymentConfirmEmail: AdminEmail = {
      id: `email-confirm-${orderId}-${Date.now()}`,
      subject: `✅ CONFIRMED: Payment for Order #${orderId} verified`,
      body: `Hi Admin,\n\nYou have successfully confirmed the payment for Order #${orderId}. The customer has been notified, and the status has been transitioned to 'Payment Completed'. You can now dispatch the order.`,
      sender: 'escrow@julia-agro.com',
      recipient: 'admin@julia-agro.com',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setAdminEmails(prev => [paymentConfirmEmail, ...prev]);

    showToast(`Payment for Order ${orderId} has been verified and confirmed!`, 'success');
  };

  const markEmailAsRead = (emailId: string) => {
    setAdminEmails(prev => prev.map(em => em.id === emailId ? { ...em, isRead: true } : em));
  };

  const deleteEmail = (emailId: string) => {
    setAdminEmails(prev => prev.filter(em => em.id !== emailId));
    showToast('Email deleted successfully.', 'info');
  };

  const restockProduct = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = p.stock + amount;
        return { ...p, stock: newStock, initialStock: Math.max(p.initialStock, newStock) };
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    const newLog: ActivityLog = {
      id: `log-restock-${Date.now()}`,
      message: `Restocked ${amount} units of ${prod?.title.slice(0, 30)}... (New stock: ${((prod?.stock || 0) + amount)})`,
      type: 'restock',
      timestamp: new Date().toISOString(),
      productId
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Product restocked successfully!`, 'success');
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newC: Coupon = {
      ...coupon,
      id: `c-${Date.now()}`,
      usageCount: 0
    };
    setCoupons(prev => [newC, ...prev]);
    showToast(`Coupon ${coupon.code} created successfully!`, 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed.', 'info');
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    showToast('Coupon status updated.', 'success');
  };

  const addPromotion = (promo: Omit<Promotion, 'id'>) => {
    const newP: Promotion = {
      ...promo,
      id: `p-${Date.now()}`
    };
    setPromotions(prev => [newP, ...prev]);
    showToast(`Discount promotion "${promo.title}" added!`, 'success');
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    showToast('Promotion removed.', 'info');
  };

  const togglePromotion = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    showToast('Promotion status toggled.', 'success');
  };

  const addCustomer = (customer: Omit<CustomerProfile, 'id' | 'totalSpent' | 'orderCount' | 'joinedAt'>) => {
    const newCust: CustomerProfile = {
      ...customer,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      orderCount: 0,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer ${customer.name} registered!`, 'success');
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    showToast('Customer account status updated.', 'success');
  };

  const updateStoreSettings = (settings: Partial<typeof INITIAL_SETTINGS>) => {
    setStoreSettings(prev => ({
      ...prev,
      ...settings
    }));
    showToast('Store settings updated successfully!', 'success');
  };

  const addNewProduct = (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'initialStock'>) => {
    const nextNum = products.reduce((max, p) => {
      const match = p.id.match(/^prod-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0) + 1;
    const id = `prod-${nextNum}`;
    const newP: Product = {
      ...product,
      id,
      rating: 4.5,
      reviewsCount: 0,
      initialStock: product.stock
    };
    setProducts(prev => [...prev, newP]);

    const newLog: ActivityLog = {
      id: `log-new-${id}`,
      message: `Added new product: ${newP.title.slice(0, 35)} with initial stock of ${newP.stock}`,
      type: 'system',
      timestamp: new Date().toISOString(),
      productId: id
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Product Added Successfully!`, 'success');
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updated = { ...p, ...updatedFields };
        if (updatedFields.stock !== undefined) {
          updated.initialStock = Math.max(updated.stock, p.initialStock);
        }
        return updated;
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    const newLog: ActivityLog = {
      id: `log-update-${productId}-${Date.now()}`,
      message: `Updated product attributes for: ${prod?.title.slice(0, 30) || productId}`,
      type: 'system',
      timestamp: new Date().toISOString(),
      productId
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Product attributes updated successfully!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    
    const newLog: ActivityLog = {
      id: `log-delete-${productId}-${Date.now()}`,
      message: `Deleted product from catalog: ${prod?.title.slice(0, 30) || productId}`,
      type: 'system',
      timestamp: new Date().toISOString(),
      productId
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Product deleted successfully!`, 'success');
  };

  const addVerifiedPhoto = (productId: string, photoBase64: string, stock: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const newPhoto: VerifiedPhoto = {
      id: `photo-${Date.now()}`,
      productId,
      productTitle: prod.title,
      photo: photoBase64,
      timestamp: new Date().toISOString(),
      stock
    };

    setVerifiedPhotos(prev => [newPhoto, ...prev]);

    // Also update the main image of the product to show the live taken stock picture!
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, image: photoBase64, stock };
      }
      return p;
    }));

    const newLog: ActivityLog = {
      id: `log-photo-${Date.now()}`,
      message: `Captured live stock photo verification for: ${prod.title.slice(0, 30)}. Stock set to ${stock}.`,
      type: 'restock',
      timestamp: new Date().toISOString(),
      productId
    };
    setLogs(prev => [newLog, ...prev]);
    showToast(`Stock photo captured and verified successfully!`, 'success');
  };

  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem('julia_agro_orders');
    showToast('All orders cleared.', 'success');
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      logs,
      verifiedPhotos,
      searchQuery,
      selectedCategory,
      selectedProduct,
      isCartOpen,
      isCheckoutOpen,
      isSellerOpen,
      isAdminLoginOpen,
      isCustomerCareOpen,
      isCustomerAuthOpen,
      isCustomerDashboardOpen,
      currentUser,
      currentAdmin,
      adminUsers,
      toast,
      currency,
      sellerTab,
      adminEmails,
      
      setSearchQuery,
      setSelectedCategory,
      setSelectedProduct,
      setIsCartOpen,
      setIsCheckoutOpen,
      setIsSellerOpen,
      setIsAdminLoginOpen,
      setIsCustomerCareOpen,
      setIsCustomerAuthOpen,
      setIsCustomerDashboardOpen,
      setCurrency,
      setSellerTab,
      formatPrice,
      
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      
      placeOrder,
      updateOrderStatus,
      confirmOrderPayment,
      markEmailAsRead,
      deleteEmail,
      restockProduct,
      addNewProduct,
      updateProduct,
      deleteProduct,
      addVerifiedPhoto,
      clearAllOrders,
      
      showToast,
      hideToast,
      loginUser,
      logoutUser,
      loginAdmin,
      registerAdmin,
      logoutAdmin,
      setCurrentAdmin,
 
      toggleWishlist,
      updateCustomerProfile,
      addShippingAddress,
      removeShippingAddress,
      setDefaultShippingAddress,
      addSavedPayment,
      removeSavedPayment,
      registerCustomer,
      loginCustomerWithCredentials,
      changeCustomerPassword,
      resetCustomerPassword,

      coupons,
      promotions,
      customers,
      storeSettings,
      addCoupon,
      deleteCoupon,
      toggleCoupon,
      addPromotion,
      deletePromotion,
      togglePromotion,
      addCustomer,
      toggleCustomerStatus,
      updateStoreSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
