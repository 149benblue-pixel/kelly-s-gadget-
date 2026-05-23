/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Customer, CartItem, Order } from '../types';

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
    } catch (e) {
      console.error("Error fetching products", e);
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
          if (!filters.category || filters.category === 'all' || lp.category === filters.category) {
            merged.push(lp);
          }
        }
      });

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
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
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

  const saveProductLocal = (product: Product) => {
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

      // Remove from deleted list if present
      let deletedIds: string[] = [];
      const deletedStored = localStorage.getItem('kgs_local_deleted_products');
      if (deletedStored) {
        deletedIds = JSON.parse(deletedStored);
        deletedIds = deletedIds.filter((id: string) => id !== product.id);
        localStorage.setItem('kgs_local_deleted_products', JSON.stringify(deletedIds));
      }

      // Sync state immediately
      fetchProducts();
    } catch (e) {
      console.error("saveProductLocal failed", e);
    }
  };

  const deleteProductLocal = (id: string) => {
    try {
      // Add to deleted list
      let deletedIds: string[] = [];
      const deletedStored = localStorage.getItem('kgs_local_deleted_products');
      if (deletedStored) deletedIds = JSON.parse(deletedStored);
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
      }
      localStorage.setItem('kgs_local_deleted_products', JSON.stringify(deletedIds));

      // Remove from local modifications
      let localProducts: Product[] = [];
      const localStored = localStorage.getItem('kgs_local_products');
      if (localStored) {
        localProducts = JSON.parse(localStored);
        localProducts = localProducts.filter((p: Product) => p.id !== id);
        localStorage.setItem('kgs_local_products', JSON.stringify(localProducts));
      }

      // Sync state immediately
      fetchProducts();
    } catch (e) {
      console.error("deleteProductLocal failed", e);
    }
  };

  const deleteProductsBulkLocal = (ids: string[]) => {
    ids.forEach(id => deleteProductLocal(id));
  };

  const saveSettingsLocal = (settings: any) => {
    try {
      const stored = localStorage.getItem('kgs_local_settings');
      const base = stored ? JSON.parse(stored) : {};
      const updated = { ...base, ...settings };
      localStorage.setItem('kgs_local_settings', JSON.stringify(updated));
      
      // Sync state
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
