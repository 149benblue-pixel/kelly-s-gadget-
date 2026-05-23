/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discount displays
  category: string;
  imageUrl: string;
  stock: number;
  ratingCount: number;
  ratingAverage: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  specs: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  isActive: boolean;
  expiryDate: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "KGS-100234"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  paymentMethod: 'mpesa' | 'visa' | 'mastercard' | 'paypal' | 'bank_transfer';
  paymentDetails?: {
    transactionId?: string; // M-Pesa code, Paypal transaction, etc. 
    phoneNumber?: string;
    accountNumber?: string;
  };
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  history: {
    status: OrderStatus;
    note: string;
    timestamp: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  role: 'customer' | 'admin';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesDataByMonth: { month: string; sales: number; orders: number }[];
  categorySales: { category: string; value: number }[];
  recentOrdersCount: number;
}
