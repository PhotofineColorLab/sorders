// User Types
export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  password?: string; // Add password field for staff login
  createdAt: Date;
}

// Product Types
export type ProductCategory = 
  | 'fans' 
  | 'lights' 
  | 'switches' 
  | 'sockets' 
  | 'wires' 
  | 'conduits'
  | 'mcbs'
  | 'panels'
  | 'tools'
  | 'accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'dc' | 'invoice' | 'dispatched';
export type PaymentCondition = 'cash' | 'credit';

export interface OrderItem {
  id?: string;
  _id?: string; // MongoDB ID
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  _id?: string; // MongoDB ID
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentCondition?: PaymentCondition;
  dispatchDate?: Date;
  notes?: string;
  orderImage?: string; // Add order image field
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Analytics Types
export interface SalesByCategory {
  category: ProductCategory;
  amount: number;
}

export interface SalesByPeriod {
  date: string;
  amount: number;
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  pendingOrders: number;
}
