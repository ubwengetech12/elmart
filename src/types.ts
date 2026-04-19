export type UserRole = 'RETAIL_BUYER' | 'WHOLESALE_BUYER' | 'SUPPLIER' | 'MANUFACTURER' | 'ADMIN';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  whatsappNumber?: string;
  signatureUrl?: string; // Digital signature for invoices
  stampUrl?: string; // Business stamp for invoices
  verificationStatus: VerificationStatus;
  idCardUrl?: string; // For consumer KYC
  businessRegistrationUrl?: string; // For supplier KYB
  phoneNumber?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  type: 'PROFORMA' | 'PAYMENT_CONFIRMATION' | 'TAX_INVOICE' | 'DELIVERY_NOTE';
  url: string;
  createdAt: string;
}

export interface ProductIntelligence {
  durabilityScore: number; // 0-10
  priceCompetitiveness: number; // 0-10
  returnRate: number; // percentage
  valueForMoney: number; // 0-10
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  bulkPrice?: number;
  minBulkOrder?: number;
  category: string;
  images: string[];
  supplierId: string;
  supplierName: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isArtisan: boolean;
  intelligence?: ProductIntelligence;
  moq?: number; // Minimum Order Quantity for retailers
  discountPrice?: number;
  discountPercentage?: number;
  videoUrl?: string; // Original uploaded video (max 30s)
  promoVideoUrl?: string; // AI generated promo video
}

export interface Advertisement {
  id: string;
  companyName: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaUrl: string;
  type: 'banner' | 'side' | 'sponsored';
}

export interface MarketingAsset {
  id: string;
  productId: string;
  type: 'video' | 'image' | 'text';
  contentUrl: string;
  status: 'generating' | 'ready' | 'failed';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type PaymentStatus = 'IDLE' | 'INITIATED' | 'AWAITING_USSD' | 'VERIFYING_CARD' | 'SECURE_3D_ACTIVE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'ESCROW_RELEASED';

export interface PaymentSession {
  id: string;
  orderId: string;
  amount: number;
  currency: 'RWF';
  method: 'MOMO' | 'CARD' | 'HYBRID';
  status: PaymentStatus;
  isEscrowProtected: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerType: 'SMALL_SCALE' | 'LARGE_SCALE';
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  currentStep: number; // 1: Initiated, 2: Paid, 3: Shipped, 4: Delivered
  paymentMethod: 'MOMO' | 'CARD' | 'HYBRID';
  createdAt: string;
  invoices: Invoice[];
  supplierId: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
