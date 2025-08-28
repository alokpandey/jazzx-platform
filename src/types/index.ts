// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  userType: 'borrower' | 'broker';
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'borrower' | 'broker';
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'borrower' | 'broker';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Loan Application Types
export interface LoanApplication {
  id: string;
  userId: string;
  status: 'draft' | 'submitted' | 'processing' | 'underwriting' | 'approved' | 'rejected' | 'closed';
  loanAmount: number;
  propertyValue: number;
  downPayment: number;
  loanType: 'conventional' | 'fha' | 'va' | 'usda';
  propertyType: 'primary' | 'secondary' | 'investment';
  creditScore: number;
  annualIncome: number;
  employmentStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Quote Types
export interface QuoteRequest {
  loanAmount: number;
  annualIncome: number;
  creditScore: 'excellent' | 'good' | 'fair' | 'poor';
  propertyValue: number;
  downPayment: number;
  loanType: 'conventional' | 'fha' | 'va' | 'usda';
}

export interface LoanOption {
  id: string;
  loanType: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  totalInterest: number;
  loanTerm: number;
  isRecommended: boolean;
  features: string[];
  pros: string[];
  cons: string[];
}

export interface QuoteResponse {
  id: string;
  loanOptions: LoanOption[];
  aiConfidenceScore: number;
  approvalProbability: number;
  recommendedBroker?: Broker;
  marketInsights: MarketInsight[];
  createdAt: string;
}

// Broker Types
export interface Broker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  licenseNumber: string;
  yearsExperience: number;
  avatar?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'prospect' | 'active' | 'closed' | 'inactive';
  aiScore: number;
  loanAmount: number;
  loanType: string;
  lastActivity: string;
  tags: string[];
  assignedBroker: string;
  createdAt: string;
}

// Market Data Types
export interface MarketInsight {
  type: 'rate_trend' | 'market_condition' | 'recommendation';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
}

export interface RateTrend {
  date: string;
  rate: number;
  change: number;
  prediction: 'up' | 'down' | 'stable';
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: 'income' | 'employment' | 'asset' | 'property' | 'identity';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  size: number;
  mimeType: string;
  url: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'document' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

// AI Insights Types
export interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'alert' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionItems: string[];
  confidence: number;
  impact: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalApplications: number;
  activeLoans: number;
  approvalRate: number;
  averageProcessingTime: number;
  monthlyVolume: number;
  conversionRate: number;
}

export interface BrokerStats extends DashboardStats {
  totalClients: number;
  pipelineValue: number;
  monthlyCommission: number;
  clientSatisfaction: number;
}
