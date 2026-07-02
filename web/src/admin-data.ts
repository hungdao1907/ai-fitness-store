/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Order, Customer, Promotion, Staff } from './admin-types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    name: 'HENRY FIT ELITE OLYMPIC BARBELL',
    description: 'High-tensile steel, 20kg barbell with custom black oxide finish and premium knurling for ultimate grip.',
    category: 'Equipment',
    price: 349,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-002',
    name: 'COMPRESSION L/S TRAINING TEE',
    description: 'Ultra-breathable dry-wick polyester-spandex blend designed to hug major muscle groups for improved blood flow.',
    category: 'Apparel',
    price: 45,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-003',
    name: 'KINETIC PRE-WORKOUT (SOUR WATERMELON)',
    description: 'High-dose L-Citrulline, Beta-Alanine, and Caffeine formula engineered to power intense hypertrophy sessions.',
    category: 'Supplements',
    price: 55,
    stock: 5, // Low stock!
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Low Stock'
  },
  {
    id: 'PROD-004',
    name: 'HEX DUMBBELL PAIR 25KG',
    description: 'Solid cast iron core dumbbell pair encased in durable rubber to reduce gym floor noise and wear.',
    category: 'Equipment',
    price: 180,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-005',
    name: 'HENRY FIT CAST IRON KETTLEBELL 16KG',
    description: 'Classic matte black cast iron kettlebell with powder coat finish for superior handling.',
    category: 'Equipment',
    price: 85,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-006',
    name: 'PRO LIFTING STRAPS',
    description: 'Heavy duty cotton straps with neoprene padding, reinforced stitching, perfect for heavy deadlifts.',
    category: 'Apparel',
    price: 25,
    stock: 0, // Out of stock!
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Out of Stock'
  },
  {
    id: 'PROD-007',
    name: '12-WEEK SHRED COCHING PROGRAM',
    description: 'Complete digital coaching blueprint with weekly macro adjustments, heart-rate zones, and custom workouts.',
    category: 'Programs',
    price: 150,
    stock: 500, // Program is digital so stock is high
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-008',
    name: 'WHEY ISOLATE 2KG (CHOCOLATE)',
    description: '25g of pure whey protein isolate per scoop, with less than 1g of fat and carbs.',
    category: 'Supplements',
    price: 79,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Active'
  },
  {
    id: 'PROD-009',
    name: 'CREATINE MONOHYDRATE 500G',
    description: '100% micronized, pure creatine monohydrate to maximize power output and cellular hydration.',
    category: 'Supplements',
    price: 39,
    stock: 3, // Low stock!
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    status: 'Low Stock'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'CAT-001',
    name: 'Equipment',
    description: 'Heavy-duty gym hardware, barbell systems, plates, and training aids.',
    productCount: 3
  },
  {
    id: 'CAT-002',
    name: 'Apparel',
    description: 'High-performance athletic clothing, compression wear, and lifting straps.',
    productCount: 2
  },
  {
    id: 'CAT-003',
    name: 'Supplements',
    description: 'Scientifically validated pre-workouts, proteins, and recovery essentials.',
    productCount: 3
  },
  {
    id: 'CAT-004',
    name: 'Programs',
    description: 'Digital training templates and online elite conditioning programs.',
    productCount: 1
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8941',
    customerName: 'Marcus Aurelius',
    customerEmail: 'marcus@stoicstrength.com',
    date: '2026-06-25',
    total: 394,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    items: [
      { productId: 'PROD-001', productName: 'HENRY FIT ELITE OLYMPIC BARBELL', quantity: 1, price: 349 },
      { productId: 'PROD-002', productName: 'COMPRESSION L/S TRAINING TEE', quantity: 1, price: 45 }
    ]
  },
  {
    id: 'ORD-8940',
    customerName: 'Athelstane Vance',
    customerEmail: 'vance@kinetic.io',
    date: '2026-06-25',
    total: 110,
    status: 'Completed',
    paymentMethod: 'PayPal',
    items: [
      { productId: 'PROD-003', productName: 'KINETIC PRE-WORKOUT (SOUR WATERMELON)', quantity: 2, price: 55 }
    ]
  },
  {
    id: 'ORD-8939',
    customerName: 'Seraphina Vance',
    customerEmail: 'seraphina@powerlifting.org',
    date: '2026-06-24',
    total: 180,
    status: 'Pending',
    paymentMethod: 'Google Pay',
    items: [
      { productId: 'PROD-004', productName: 'HEX DUMBBELL PAIR 25KG', quantity: 1, price: 180 }
    ]
  },
  {
    id: 'ORD-8938',
    customerName: 'Leonidas Kouris',
    customerEmail: 'spartan@thermo.gr',
    date: '2026-06-23',
    total: 249,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    items: [
      { productId: 'PROD-005', productName: 'HENRY FIT CAST IRON KETTLEBELL 16KG', quantity: 1, price: 85 },
      { productId: 'PROD-007', productName: '12-WEEK SHRED COCHING PROGRAM', quantity: 1, price: 150 },
      { productId: 'PROD-002', productName: 'COMPRESSION L/S TRAINING TEE', quantity: 1, price: 45 }
    ]
  },
  {
    id: 'ORD-8937',
    customerName: 'Zane Henderson',
    customerEmail: 'zane@deadliftcrew.com',
    date: '2026-06-22',
    total: 79,
    status: 'Cancelled',
    paymentMethod: 'Microsoft Pay',
    items: [
      { productId: 'PROD-008', productName: 'WHEY ISOLATE 2KG (CHOCOLATE)', quantity: 1, price: 79 }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Marcus Aurelius',
    email: 'marcus@stoicstrength.com',
    totalSpend: 1420,
    orderCount: 4,
    joinDate: '2025-01-15',
    status: 'Active'
  },
  {
    id: 'CUST-002',
    name: 'Athelstane Vance',
    email: 'vance@kinetic.io',
    totalSpend: 540,
    orderCount: 3,
    joinDate: '2025-03-22',
    status: 'Active'
  },
  {
    id: 'CUST-003',
    name: 'Seraphina Vance',
    email: 'seraphina@powerlifting.org',
    totalSpend: 890,
    orderCount: 5,
    joinDate: '2025-02-10',
    status: 'Active'
  },
  {
    id: 'CUST-004',
    name: 'Leonidas Kouris',
    email: 'spartan@thermo.gr',
    totalSpend: 249,
    orderCount: 1,
    joinDate: '2026-06-23',
    status: 'Active'
  },
  {
    id: 'CUST-005',
    name: 'Zane Henderson',
    email: 'zane@deadliftcrew.com',
    totalSpend: 110,
    orderCount: 2,
    joinDate: '2025-11-04',
    status: 'Active'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'PROM-001',
    code: 'KINETIC10',
    discountType: 'Percentage',
    discountValue: 10,
    status: 'Active',
    useCount: 148,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  {
    id: 'PROM-002',
    code: 'BARBELLPOWER',
    discountType: 'Flat',
    discountValue: 30,
    status: 'Active',
    useCount: 54,
    startDate: '2026-05-01',
    endDate: '2026-08-31'
  },
  {
    id: 'PROM-003',
    code: 'SUMMER25',
    discountType: 'Percentage',
    discountValue: 25,
    status: 'Expired',
    useCount: 312,
    startDate: '2025-06-01',
    endDate: '2025-08-31'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'STF-001',
    name: 'Henry Peterson',
    role: 'Admin',
    email: 'henry@henryfit.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'STF-002',
    name: 'Sarah Connor',
    role: 'Manager',
    email: 'sarah@henryfit.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'STF-003',
    name: 'Alex Mercer',
    role: 'Trainer',
    email: 'alex@henryfit.com',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'
  }
];
