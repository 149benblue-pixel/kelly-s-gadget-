/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Customer, CartItem, Order } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const initialCategories = [
  { id: 'cat-1', name: 'Smartphones', slug: 'smartphones', description: 'Elite smartphones from Apple, Samsung, and top brands.', icon: 'Smartphone' },
  { id: 'cat-2', name: 'Laptops', slug: 'laptops', description: 'Powerhouse laptops for work, gaming, and creative tasks.', icon: 'Laptop' },
  { id: 'cat-3', name: 'Smart Watches', slug: 'smart-watches', description: 'Track your health and keep notifications at your wrist.', icon: 'Watch' },
  { id: 'cat-4', name: 'Tablets', slug: 'tablets', description: 'The perfect blend of mobile viewing and notebook control.', icon: 'Tablet' },
  { id: 'cat-5', name: 'Audio Systems & Speakers', slug: 'speakers', description: 'Home theaters, portable Bluetooth and premium speakers.', icon: 'Volume2' },
  { id: 'cat-6', name: 'Gaming Devices', slug: 'gaming', description: 'Consoles, controller accessories, and high-FPS gear.', icon: 'Gamepad' },
  { id: 'cat-7', name: 'Accessories & Others', slug: 'accessories', description: 'Premium chargers, adapters, hubs, and protective cases.', icon: 'Cable' }
];

const initialProducts = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max Titanium',
    description: 'The ultimate powerhouse smartphone featuring the A17 Pro chip, a futuristic action button, spectacular custom triple-camera configuration (48MP, 12MP, 12MP zoom), aerospace-grade titanium chassis, dynamic island interaction, and all-day typing battery capacity.',
    price: 165000,
    originalPrice: 185000,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    stock: 24,
    ratingCount: 145,
    ratingAverage: 4.8,
    featured: true,
    newArrival: true,
    bestSeller: true,
    specs: {
      'Screen Size': '6.7 inches OLED Super Retina XDR',
      'Processor': 'A17 Pro Chip with 6-core GPU',
      'Storage Options': '256GB / 512GB / 1TB',
      'Chassis': 'Aero Titanium',
      'Weight': '221 grams'
    }
  },
  {
    id: 'prod-2',
    name: 'MacBook Pro 16" M3 Max Dual-Core',
    description: 'The world\'s most advanced laptop for absolute creators, driven by the supercharged Apple M3 Max silicon, gorgeous Liquid Retina XDR screen with up to 1600 nits brightness, incredible battery duration spanning up to 22 continuous hours, and ultra-high bandwidth memories.',
    price: 420000,
    originalPrice: 450000,
    category: 'laptops',
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    ratingCount: 82,
    ratingAverage: 4.9,
    featured: true,
    newArrival: false,
    bestSeller: true,
    specs: {
      'Silicon': 'Apple M3 Max Chip',
      'Memory': '48GB Unified RAM',
      'Storage': '1TB NVMe Fast Memory',
      'Display': '16.2" Mini-LED ProMotion XDR',
      'Battery': '100 Watt-Hour Cells'
    }
  },
  {
    id: 'prod-3',
    name: 'Samsung Galaxy Watch 6 Pro Active',
    description: 'Track sports and health with high fidelity. Includes advanced Sleep-Tracking indices, Body Composition analyzer (BIA method), dynamic temperature sensing, dual frequency navigation GPS, and a rugged classic rotating tachymeter profile styled for elite fitness.',
    price: 45000,
    originalPrice: 49000,
    category: 'smart-watches',
    imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&auto=format&fit=crop&q=80',
    stock: 45,
    ratingCount: 94,
    ratingAverage: 4.7,
    featured: true,
    newArrival: true,
    bestSeller: false,
    specs: {
      'Bezel Material': 'Fine Micro Titanium',
      'Waterproof Standard': 'IP68 & 5ATM Depth',
      'Health Sensors': 'BioActive Suite, Blood Pressure, ECG',
      'Platform Compatibility': 'Android / Wear OS powered'
    }
  },
  {
    id: 'prod-4',
    name: 'Premium Studio Earbuds Pro ANC',
    description: 'Adaptive dual transparency, immersive personal Spatial Audio rendering (dynamic head tracking), customized ultra-comfort tips, and a fine acoustic case charging via USB-C or MagSafe with up to 36 hours of integrated charging capacity.',
    price: 25000,
    originalPrice: 28000,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    stock: 80,
    ratingCount: 215,
    ratingAverage: 4.6,
    featured: false,
    newArrival: false,
    bestSeller: true,
    specs: {
      'ANC Rating': 'Up to 45dB cancellation',
      'Wireless Tech': 'Bluetooth 5.3 High Stability',
      'Driver Spec': '11mm Custom Polymer Dynamic Driver',
      'Charge Time': '5 min = 1 hour playback'
    }
  },
  {
    id: 'prod-5',
    name: 'Galaxy Tab S9 Ultra Slate Carbon',
    description: 'Large 14.6" dynamic AMOLED 2X canvas equipped with ultra-fast Qualcomm Snapdragon Gen 2 processing, standard high-precision active S-Pen, IP68 water/dust proofing, and split screen creative workspaces suited for professional designers.',
    price: 160000,
    originalPrice: 180000,
    category: 'tablets',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    stock: 18,
    ratingCount: 68,
    ratingAverage: 4.8,
    featured: true,
    newArrival: true,
    bestSeller: false,
    specs: {
      'Display Size': '14.6" Dynamic AMOLED 120Hz',
      'Stylus Included': 'S-Pen (Active, Low Latency)',
      'Storage': '256GB Expandable microSD',
      'Audio Nodes': 'Quad Speakers by AKG Dolby Atmos'
    }
  },
  {
    id: 'prod-6',
    name: 'Asus ROG Ally Extreme Gaming Console',
    description: 'Play any game on the couch with AMD Ryzen Z1 Extreme power, high-frame-rate screen, seamless dual-active heat-pipe cooling channels, full ergonomic thumbstick design, and access to all standard Windows libraries.',
    price: 95000,
    originalPrice: 110000,
    category: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    ratingCount: 110,
    ratingAverage: 4.5,
    featured: true,
    newArrival: false,
    bestSeller: true,
    specs: {
      'Processor Core': 'AMD Ryzen Z1 Extreme Desktop-Grade',
      'Operating System': 'Windows 11 Home OS',
      'Screen Engine': '7" IPS 1080p 120Hz Native Sync',
      'Graphics Engine': 'AMD RDNA 3 Integrated Graphics'
    }
  },
  {
    id: 'prod-7',
    name: 'Google Pixel 8 Pro Obsidian Night',
    description: 'Advanced Google-designed Google Tensor G3 chip, AI camera features including Magic Eraser and Audio Magic isolation, pro security architecture, and a bright Actua display that stands out.',
    price: 120000,
    originalPrice: 135000,
    category: 'smartphones',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    stock: 30,
    ratingCount: 54,
    ratingAverage: 4.6,
    featured: false,
    newArrival: true,
    bestSeller: false,
    specs: {
      'Processor': 'Google Tensor G3 (Titan M2 Security)',
      'Camera': '50MP Studio Main + 48MP Zoom',
      'Memory': '12GB High Speed LPDDR5X',
      'OS Lifespan': '7 Years Core Security Updates'
    }
  },
  {
    id: 'prod-8',
    name: 'Studio Master Soundbar Solo',
    description: 'Upgrade your living room cinematic experience with a plug-and-play Dolby Atmos certified active soundbar. Built-in, self-firing subwoofers bring chest-thumping bass and vocal details directly via a single HDMI eARC cord.',
    price: 65000,
    originalPrice: 75000,
    category: 'speakers',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    stock: 22,
    ratingCount: 39,
    ratingAverage: 4.4,
    featured: false,
    newArrival: false,
    bestSeller: true,
    specs: {
      'Audio Decoders': 'Dolby Atmos, DTS:X, Stereo HD',
      'Connectivity': 'HDMI eARC, Optical, Dual Bluetooth',
      'Max Output': '320 Watts Amplified Peak',
      'Subwoofers': 'Dual Action Integrated Cones'
    }
  },
  {
    id: 'prod-9',
    name: 'Pro Wireless Charging Stand 3-in-1',
    description: 'Sleek premium desktop charger stand. Simultaneously fast-charges your iPhone, smart watch, and wireless earbud system. Equipped with automatic thermal sensing to provide safe power optimization.',
    price: 12000,
    originalPrice: 15000,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop&q=80',
    stock: 120,
    ratingCount: 167,
    ratingAverage: 4.7,
    featured: false,
    newArrival: false,
    bestSeller: true,
    specs: {
      'Total Output': '15W iPhone + 5W Watch + 5W Buds',
      'Magnets': 'Certified MagSafe Cohesion',
      'Adapter Included': '30W QuickCharge 3.0 Brick'
    }
  },
  {
    id: 'prod-10',
    name: 'Sony PlayStation 5 Pro Slim Console',
    description: 'Enjoy high-speed SSD load times, incredible haptic feedback, 3D audio, and an all-new slim profile matching high computational processors running gorgeous active 4K HDR imagery at 120 hertz frames.',
    price: 90000,
    originalPrice: 100000,
    category: 'gaming',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop&q=80',
    stock: 19,
    ratingCount: 228,
    ratingAverage: 4.9,
    featured: true,
    newArrival: true,
    bestSeller: true,
    specs: {
      'Storage': '1TB Ultra-Fast Proprietary SSD',
      'Processor Custom': 'AMD Zen 2 Architecture 8-Core',
      'HDMI Spec': 'HDMI 2.1 Native Pro Sync',
      'Haptic Control': 'DualSense Custom Actuators'
    }
  },
  {
    id: 'prod-11',
    name: 'Logitech MX Master S3 Designer Mouse',
    description: 'The premier mouse engineered for extreme coding and vector design. Features magnetic MagSpeed vertical Scrolling, precise tracking surface coverage, custom typing buttons, and ergonomic hand-resting fit.',
    price: 15000,
    originalPrice: 18000,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    stock: 75,
    ratingCount: 310,
    ratingAverage: 4.8,
    featured: false,
    newArrival: false,
    bestSeller: true,
    specs: {
      'Tracking Sensor': '8000 DPI Darkfield Any-Surface',
      'Battery Rating': 'Up to 70 Days Full USB-C Charge',
      'Multi-Device': 'Active Logitech Flow Control (Up to 3 devices)',
      'Buttons Count': '7 Programmable Thumb triggers'
    }
  }
];


interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  user: Customer | null;
  authToken: string | null;
  currentView: string;
  selectedProductId: string | null;
  trackedOrderNumber: string;
  orderHistory: Order[];
  couponCode: string;
  couponDiscount: { type: string; value: number; code: string } | null;
  websiteSettings: any;
  isLoading: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Actions
  setView: (view: string) => void;
  setSelectedProductId: (id: string | null) => void;
  setTrackedOrderNumber: (num: string) => void;
  setCouponCode: (code: string) => void;
  
  // Cart Actions
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Auth Actions
  login: (email: string, pass: string) => Promise<boolean>;
  registerCustomer: (payload: any) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, newPass: string) => Promise<boolean>;
  
  // Fetchers
  fetchProducts: (filters?: any) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchOrderHistory: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  verifyCoupon: (code: string) => Promise<boolean>;
  checkout: (details: any) => Promise<any>;
  
  // Helpers
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;

  // Local Sync Actions (for Vercel/serverless stateless environments fallback)
  saveProductLocal: (product: Product) => void;
  deleteProductLocal: (id: string) => void;
  deleteProductsBulkLocal: (ids: string[]) => void;
  saveSettingsLocal: (settings: any) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('kgs_cart');
    return local ? JSON.parse(local) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const local = localStorage.getItem('kgs_wishlist');
    return local ? JSON.parse(local) : [];
  });
  const [user, setUser] = useState<Customer | null>(() => {
    const local = localStorage.getItem('kgs_user');
    return local ? JSON.parse(local) : null;
  });
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('kgs_token');
  });
  const [currentView, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackedOrderNumber, setTrackedOrderNumber] = useState<string>('');
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<{ type: string; value: number; code: string } | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<any>(() => {
    const defaultVals = {
      storeName: "Kelly's Gadgets Store",
      currency: "Ksh",
      taxRate: 16,
      shippingFee: 1500,
      mpesaPaybill: "5123444",
      paypalEmail: "billing@kellys.com",
      bankDetails: "Kelly Gadgets Store LTD, Equity Bank Kenya, Acc: 120034455828",
      contactPhone: "+254 787 272 428",
      contactAddress: "Lavin Tower, First Floor, Sophia, Homabay, Kenya"
    };
    try {
      const stored = localStorage.getItem('kgs_local_settings');
      return stored ? { ...defaultVals, ...JSON.parse(stored) } : defaultVals;
    } catch (e) {
      return defaultVals;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('kgs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kgs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load Initial Configurations
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDocRef = doc(db, 'settings', 'global');
      const settingsSnap = await getDoc(settingsDocRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setWebsiteSettings(data);
        return;
      }
    } catch (e) {
      console.warn("Firestore fetchSettings failed, trying fallback", e);
    }

    try {
      const res = await fetch('/api/settings');
      let data = {};
      if (res.ok) {
        data = await res.json();
      }
      try {
        const custom = localStorage.getItem('kgs_local_settings');
        if (custom) {
          data = { ...data, ...JSON.parse(custom) };
        }
      } catch (err) {}
      if (Object.keys(data).length > 0) {
        setWebsiteSettings(data);
      }
    } catch (e) {
      console.error("Error fetching settings", e);
      try {
        const custom = localStorage.getItem('kgs_local_settings');
        if (custom) {
          setWebsiteSettings(prev => ({ ...prev, ...JSON.parse(custom) }));
        }
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrderHistory();
    } else {
      setOrderHistory([]);
    }
  }, [user]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchProducts = async (filters: any = {}) => {
    setIsLoading(true);
    let apiProducts: Product[] = [];

    try {
      const querySnap = await getDocs(collection(db, 'products'));
      if (!querySnap.empty) {
        const list: Product[] = [];
        querySnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as any);
        });
        apiProducts = list;
      } else {
        for (const p of initialProducts) {
          await setDoc(doc(db, 'products', p.id), p);
        }
        apiProducts = initialProducts;
      }
    } catch (e) {
      console.error("Firestore fetchProducts failed, falling back to API and localStorage overlay", e);
      try {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== '') {
            queryParams.append(key, filters[key]);
          }
        });
        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          apiProducts = await res.json();
        }
      } catch (err) {
        console.error("Express API fallback failed", err);
      }
    }

    // Blend / merge with local storage overrides
    try {
      let merged = [...apiProducts];
      
      // Deletions
      let deletedIds: string[] = [];
      const deletedStored = localStorage.getItem('kgs_local_deleted_products');
      if (deletedStored) deletedIds = JSON.parse(deletedStored);
      merged = merged.filter(p => !deletedIds.includes(p.id));

      // Updates / Additions
      let localProducts: Product[] = [];
      const localStored = localStorage.getItem('kgs_local_products');
      if (localStored) localProducts = JSON.parse(localStored);

      localProducts.forEach(lp => {
        const idx = merged.findIndex(p => p.id === lp.id);
        if (idx !== -1) {
          merged[idx] = { ...merged[idx], ...lp };
        } else {
          merged.push(lp);
        }
      });

      if (filters.category && filters.category !== 'all') {
        merged = merged.filter(p => p.category === filters.category);
      }

      setProducts(merged);
    } catch (err) {
      console.error("Blending local products erred", err);
      if (apiProducts.length > 0) {
        setProducts(apiProducts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnap = await getDocs(collection(db, 'categories'));
      if (!querySnap.empty) {
        const cats: Category[] = [];
        querySnap.forEach((doc) => {
          cats.push({ id: doc.id, ...doc.data() } as any);
        });
        setCategories(cats);
        return;
      } else {
        for (const cat of initialCategories) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        setCategories(initialCategories);
        return;
      }
    } catch (e) {
      console.warn("Firestore fetchCategories failed, fallback to API", e);
    }

    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Error fetching categories", e);
    }
  };

  const fetchOrderHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/orders/customer/${user.email}`);
      if (res.ok) {
        const data = await res.json();
        setOrderHistory(data);
      }
    } catch (e) {
      console.error("Error pulling order status histories", e);
    }
  };

  const verifyCoupon = async (code: string) => {
    if (!code) return false;
    try {
      const cartSubtotal = cart.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.productId);
        return sum + (prod ? prod.price * item.quantity : 0);
      }, 0);

      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: cartSubtotal })
      });
      const data = await res.json();

      if (res.ok) {
        setCouponDiscount({
          type: data.discountType,
          value: data.discountValue,
          code: data.code
        });
        showNotification(`Coupon ${data.code} applied successfully!`, 'success');
        return true;
      } else {
        setCouponDiscount(null);
        showNotification(data.error || "Invalid coupon code", 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addToCart = (productId: string, qty: number = 1) => {
    const pInfo = products.find(p => p.id === productId);
    if (!pInfo) return;
    
    // Check stock limit
    const existing = cart.find(c => c.productId === productId);
    const existingQty = existing ? existing.quantity : 0;
    
    if (pInfo.stock < existingQty + qty) {
      showNotification(`Oops! Only ${pInfo.stock} units of ${pInfo.name} are available right now.`, 'error');
      return;
    }

    setCart(prev => {
      const match = prev.find(item => item.productId === productId);
      if (match) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { productId, quantity: qty }];
    });
    showNotification(`Added ${pInfo.name} to your shopping cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    showNotification("Item removed from the cart", 'info');
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const pInfo = products.find(p => p.id === productId);
    if (pInfo && pInfo.stock < qty) {
      showNotification(`Insufficient stock! ${pInfo.name} only has ${pInfo.stock} units available.`, 'error');
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCouponDiscount(null);
    setCouponCode('');
  };

  const toggleWishlist = (productId: string) => {
    const pInfo = products.find(p => p.id === productId);
    setWishlist(prev => {
      const match = prev.includes(productId);
      if (match) {
        showNotification(`Removed ${pInfo?.name || 'Item'} from Wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showNotification(`Added ${pInfo?.name || 'Item'} to Wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const emailClean = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, password: pass })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('kgs_user', JSON.stringify(data.user));
        localStorage.setItem('kgs_token', data.token);
        showNotification(`Welcome back, ${data.user.name}!`, 'success');
        
        // If administrator redirects seamlessly
        if (data.user.role === 'admin') {
          setView('admin-dashboard');
        } else {
          setView('home');
        }
        return true;
      } else {
        // Fallback recovery: look up customer in Firestore cloud to restore state if server recycled
        if (emailClean !== 'admin@kellys.com' && emailClean !== 'manager@kellys.com') {
          try {
            const customerRef = doc(db, 'customers', emailClean);
            const customerSnap = await getDoc(customerRef);
            if (customerSnap.exists()) {
              const cloudCust = customerSnap.data();
              if (cloudCust.password === pass) {
                // Re-register customer automatically in the recycled backend
                const regRes = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: cloudCust.name,
                    email: cloudCust.email,
                    password: cloudCust.password,
                    phone: cloudCust.phone,
                    address: cloudCust.address
                  })
                });

                if (regRes.ok) {
                  // Retry logging in now that local state has been synchronized!
                  const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailClean, password: pass })
                  });
                  if (loginRes.ok) {
                    const loginData = await loginRes.json();
                    setUser(loginData.user);
                    setAuthToken(loginData.token);
                    localStorage.setItem('kgs_user', JSON.stringify(loginData.user));
                    localStorage.setItem('kgs_token', loginData.token);
                    showNotification(`Welcome back, ${loginData.user.name}! (Session restored)`, 'success');
                    setView('home');
                    return true;
                  }
                }
              }
            }
          } catch (cloudErr) {
            console.error("Cloud customer lookup/restore fallback failed", cloudErr);
          }
        }

        showNotification(data.error || "Invalid sign-in credentials", 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showNotification("Server connect failure", 'error');
      return false;
    }
  };

  const registerCustomer = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setAuthToken(data.token);
        localStorage.setItem('kgs_user', JSON.stringify(data.user));
        localStorage.setItem('kgs_token', data.token);

        // Sync standard customer details into persistent Firestore database so they are never lost
        try {
          const customerRef = doc(db, 'customers', payload.email.toLowerCase().trim());
          await setDoc(customerRef, {
            id: data.user.id,
            name: payload.name,
            email: payload.email.toLowerCase().trim(),
            password: payload.password,
            phone: payload.phone || '',
            address: payload.address || '',
            createdAt: data.user.createdAt || new Date().toISOString(),
            role: 'customer'
          });
        } catch (fsErr) {
          console.error("Failed cloud syncing customer profile", fsErr);
        }

        showNotification(`Account created successfully! Welcome to Kelly's Gadgets.`, 'success');
        setView('home');
        return true;
      } else {
        showNotification(data.error || "Registration failed", 'error');
        return false;
      }
    } catch (e) {
      console.error(e);
      showNotification("Server error during registration", 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('kgs_user');
    localStorage.removeItem('kgs_token');
    showNotification("Successfully logged out. See you again soon!", 'info');
    setView('home');
  };

  const resetPassword = async (email: string, newPass: string): Promise<boolean> => {
    const emailClean = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Security credentials updated successfully!", "success");
        
        // Sync new password to persistent Firestore database if found in cloud
        try {
          const customerRef = doc(db, 'customers', emailClean);
          await setDoc(customerRef, { password: newPass }, { merge: true });
        } catch (fsErr) {
          console.error("Failed cloud syncing updated password", fsErr);
        }
        return true;
      } else {
        showNotification(data.error || "Reset password request rejected", "error");
        return false;
      }
    } catch (e) {
      console.error(e);
      showNotification("Server connect failure during reset", "error");
      return false;
    }
  };

  const checkout = async (details: any) => {
    setIsLoading(true);
    try {
      const payload = {
        token: authToken,
        ...details,
        items: cart.map(c => {
          const prod = products.find(p => p.id === c.productId);
          return {
            productId: c.productId,
            quantity: c.quantity,
            productName: prod?.name || 'Device'
          };
        }),
        couponCode: couponDiscount?.code
      };

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Order ${data.order.orderNumber} placed! Invoice and SMS dispatched.`, 'success');
        clearCart();
        setTrackedOrderNumber(data.order.orderNumber);
        setView('order-tracking');
        fetchProducts(); // Refresh stocks list
        return data;
      } else {
        showNotification(data.error || "Checkout error", 'error');
        return null;
      }
    } catch (e) {
      console.error(e);
      showNotification("System checkout process interrupted", 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveProductLocal = async (product: Product) => {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.error("Firebase syncing of product failed, using local storage backup", e);
    }

    try {
      let localProducts: Product[] = [];
      const localStored = localStorage.getItem('kgs_local_products');
      if (localStored) localProducts = JSON.parse(localStored);

      const idx = localProducts.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        localProducts[idx] = { ...localProducts[idx], ...product };
      } else {
        localProducts.push(product);
      }
      localStorage.setItem('kgs_local_products', JSON.stringify(localProducts));

      let deletedIds: string[] = [];
      const deletedStored = localStorage.getItem('kgs_local_deleted_products');
      if (deletedStored) {
        deletedIds = JSON.parse(deletedStored);
        deletedIds = deletedIds.filter((id: string) => id !== product.id);
        localStorage.setItem('kgs_local_deleted_products', JSON.stringify(deletedIds));
      }

      fetchProducts();
    } catch (e) {
      console.error("saveProductLocal failed", e);
    }
  };

  const deleteProductLocal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Firebase deletion of product failed, using local storage fallback", e);
    }

    try {
      let deletedIds: string[] = [];
      const deletedStored = localStorage.getItem('kgs_local_deleted_products');
      if (deletedStored) deletedIds = JSON.parse(deletedStored);
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
      }
      localStorage.setItem('kgs_local_deleted_products', JSON.stringify(deletedIds));

      let localProducts: Product[] = [];
      const localStored = localStorage.getItem('kgs_local_products');
      if (localStored) {
        localProducts = JSON.parse(localStored);
        localProducts = localProducts.filter((p: Product) => p.id !== id);
        localStorage.setItem('kgs_local_products', JSON.stringify(localProducts));
      }

      fetchProducts();
    } catch (e) {
      console.error("deleteProductLocal failed", e);
    }
  };

  const deleteProductsBulkLocal = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await deleteDoc(doc(db, 'products', id));
      }
    } catch (e) {
      console.error("Firebase bulk delete failed", e);
    }

    ids.forEach(id => {
      try {
        let deletedIds: string[] = [];
        const deletedStored = localStorage.getItem('kgs_local_deleted_products');
        if (deletedStored) deletedIds = JSON.parse(deletedStored);
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
        }
        localStorage.setItem('kgs_local_deleted_products', JSON.stringify(deletedIds));

        let localProducts: Product[] = [];
        const localStored = localStorage.getItem('kgs_local_products');
        if (localStored) {
          localProducts = JSON.parse(localStored);
          localProducts = localProducts.filter((p: Product) => p.id !== id);
          localStorage.setItem('kgs_local_products', JSON.stringify(localProducts));
        }
      } catch (err) {}
    });
    fetchProducts();
  };

  const saveSettingsLocal = async (settings: any) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
    } catch (e) {
      console.error("Firebase syncing of settings failed, using local storage backup", e);
    }

    try {
      const stored = localStorage.getItem('kgs_local_settings');
      const base = stored ? JSON.parse(stored) : {};
      const updated = { ...base, ...settings };
      localStorage.setItem('kgs_local_settings', JSON.stringify(updated));
      fetchSettings();
    } catch (e) {
      console.error("saveSettingsLocal failed", e);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      user,
      authToken,
      currentView,
      selectedProductId,
      trackedOrderNumber,
      orderHistory,
      couponCode,
      couponDiscount,
      websiteSettings,
      isLoading,
      notification,
      
      setView,
      setSelectedProductId,
      setTrackedOrderNumber,
      setCouponCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      login,
      registerCustomer,
      logout,
      resetPassword,
      fetchProducts,
      fetchCategories,
      fetchOrderHistory,
      fetchSettings,
      verifyCoupon,
      checkout,
      showNotification,

      saveProductLocal,
      deleteProductLocal,
      deleteProductsBulkLocal,
      saveSettingsLocal
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
