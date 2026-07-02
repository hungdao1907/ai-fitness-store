/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'Active' | 'Low Stock' | 'Out of Stock' | 'Draft';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: string;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpend: number;
  orderCount: number;
  joinDate: string;
  status: 'Active' | 'Suspended';
}

export interface Promotion {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  status: 'Active' | 'Expired';
  useCount: number;
  startDate: string;
  endDate: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Trainer';
  email: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

export type TabType = 
  | 'Dashboard'
  | 'Products'
  | 'Categories'
  | 'Orders'
  | 'Customers'
  | 'Inventory'
  | 'Promotions'
  | 'Staff'
  | 'Analytics'
  | 'Settings';
