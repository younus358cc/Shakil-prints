/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  iconName: string; // Lucide icon name
  popular?: boolean;
}

export interface PriceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  paperType: string;
  size: string;
  pricePerUnit: number;
  minQuantity: number;
}

export interface Order {
  id: string; // Order ID like SPD-2026-0001
  customerName: string;
  phoneNumber: string;
  email?: string;
  deliveryAddress: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  paperSize: string;
  colorOption: 'Color' | 'Black & White';
  fileName?: string;
  fileData?: string; // base64 representation or url
  additionalInstructions?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  totalPrice: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Banner' | 'Business Card' | 'Photo Print' | 'Flex' | 'ID Card' | 'Wedding Cards';
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface WebsiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  email: string;
  address: string;
  businessHours: string;
  darkMode: boolean;
  announcement?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  revenue: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
}
