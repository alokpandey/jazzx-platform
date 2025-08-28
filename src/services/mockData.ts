import {
  User,
  QuoteResponse,
  LoanOption,
  Client,
  BrokerStats,
  AIInsight,
  MarketInsight,
  Document,
  Message
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@borrower.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    userType: 'borrower',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'broker@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '(555) 987-6543',
    userType: 'broker',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
];

// Mock Loan Options
export const mockLoanOptions: LoanOption[] = [
  {
    id: '1',
    loanType: '30-Year Fixed',
    interestRate: 6.25,
    apr: 6.31,
    monthlyPayment: 3078,
    totalInterest: 608080,
    loanTerm: 30,
    isRecommended: true,
    features: ['Fixed rate for entire term', 'Predictable payments', 'No prepayment penalty'],
    pros: ['Lowest total cost over loan lifetime', 'Stable payments with no rate changes', 'Best match for your financial profile'],
    cons: ['Higher monthly payment than ARM options'],
  },
  {
    id: '2',
    loanType: '15-Year Fixed',
    interestRate: 5.75,
    apr: 5.82,
    monthlyPayment: 4156,
    totalInterest: 248080,
    loanTerm: 15,
    isRecommended: false,
    features: ['Shorter loan term', 'Lower interest rate', 'Build equity faster'],
    pros: ['Pay off loan 15 years earlier', 'Save $360,000 in total interest', 'Build equity faster'],
    cons: ['Higher monthly payment', 'Less cash flow flexibility'],
  },
  {
    id: '3',
    loanType: '5/1 ARM',
    interestRate: 5.50,
    apr: 6.85,
    monthlyPayment: 2838,
    totalInterest: 520000,
    loanTerm: 30,
    isRecommended: false,
    features: ['Fixed rate for 5 years', 'Rate adjusts annually after', 'Lower initial payment'],
    pros: ['Lowest initial payment', 'Good if planning to move within 5-7 years', 'Maximum cash flow initially'],
    cons: ['Rate uncertainty after 5 years', 'Payment may increase significantly'],
  },
];

// Mock Quote Response
export const mockQuoteResponse: QuoteResponse = {
  id: 'quote-123',
  loanOptions: mockLoanOptions,
  aiConfidenceScore: 95,
  approvalProbability: 92,
  recommendedBroker: {
    id: 'broker-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@brokerage.com',
    phone: '(555) 987-6543',
    company: 'Premier Mortgage Solutions',
    specialties: ['First-time homebuyers', 'Conventional loans', 'FHA loans'],
    rating: 4.9,
    reviewCount: 127,
    licenseNumber: 'NMLS-123456',
    yearsExperience: 8,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  marketInsights: [
    {
      type: 'rate_trend',
      title: 'Rate Trend Analysis',
      description: 'Rates have been stable this week with slight upward pressure expected',
      impact: 'neutral',
      confidence: 85,
      actionable: true,
    },
    {
      type: 'recommendation',
      title: 'Rate Lock Recommendation',
      description: 'Consider locking your rate within 7 days for optimal pricing',
      impact: 'positive',
      confidence: 92,
      actionable: true,
    },
  ],
  createdAt: '2024-01-20T14:30:00Z',
};

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@email.com',
    phone: '(555) 123-4567',
    status: 'active',
    aiScore: 85,
    loanAmount: 450000,
    loanType: '30-Year Fixed',
    lastActivity: '2 hours ago',
    tags: ['Rate Lock Expiring', 'High Priority'],
    assignedBroker: 'broker-1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@email.com',
    phone: '(555) 234-5678',
    status: 'active',
    aiScore: 72,
    loanAmount: 320000,
    loanType: '15-Year Fixed',
    lastActivity: '1 day ago',
    tags: ['AI Flagged', 'Income Discrepancy'],
    assignedBroker: 'broker-1',
    createdAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 'client-3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert@email.com',
    phone: '(555) 345-6789',
    status: 'active',
    aiScore: 91,
    loanAmount: 680000,
    loanType: '30-Year Fixed',
    lastActivity: '3 hours ago',
    tags: ['Strong Profile', 'Underwriting'],
    assignedBroker: 'broker-1',
    createdAt: '2024-01-17T09:00:00Z',
  },
];

// Mock Broker Stats
export const mockBrokerStats: BrokerStats = {
  totalApplications: 45,
  activeLoans: 23,
  approvalRate: 89,
  averageProcessingTime: 12,
  monthlyVolume: 2400000,
  conversionRate: 68,
  totalClients: 67,
  pipelineValue: 3200000,
  monthlyCommission: 24500,
  clientSatisfaction: 4.8,
};

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'alert',
    priority: 'urgent',
    title: 'Rate Lock Opportunities',
    description: '3 clients should lock rates immediately. Market analysis shows 0.25% increase likely within 48 hours.',
    actionItems: ['Contact John Smith - $450K', 'Contact David Wilson - $395K', 'Contact Lisa Chen - $525K'],
    confidence: 92,
    impact: 'High revenue protection',
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'insight-2',
    type: 'opportunity',
    priority: 'high',
    title: 'Cross-Sell Opportunities',
    description: 'AI identified 5 existing clients likely to need refinancing or HELOC products.',
    actionItems: ['Generate refinance campaigns', 'Contact high-value prospects', 'Schedule consultations'],
    confidence: 73,
    impact: '$890K refinance potential, $340K HELOC potential',
    createdAt: '2024-01-20T07:30:00Z',
  },
  {
    id: 'insight-3',
    type: 'recommendation',
    priority: 'medium',
    title: 'Process Optimization',
    description: 'Document processing time can be reduced by 35% by implementing AI-suggested workflow changes.',
    actionItems: ['Implement automated document categorization', 'Update workflow templates', 'Train team on new processes'],
    confidence: 85,
    impact: '4.2 hours/week time savings, 35% efficiency gain',
    createdAt: '2024-01-20T07:00:00Z',
  },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Pay_Stub_December_2024.pdf',
    type: 'income',
    status: 'verified',
    uploadedAt: '2024-01-15T14:30:00Z',
    verifiedAt: '2024-01-15T16:45:00Z',
    size: 245760,
    mimeType: 'application/pdf',
    url: '/documents/doc-1.pdf',
  },
  {
    id: 'doc-2',
    name: 'Tax_Return_2023.pdf',
    type: 'income',
    status: 'verified',
    uploadedAt: '2024-01-15T14:35:00Z',
    verifiedAt: '2024-01-15T17:20:00Z',
    size: 1024000,
    mimeType: 'application/pdf',
    url: '/documents/doc-2.pdf',
  },
  {
    id: 'doc-3',
    name: 'Bank_Statement_January_2024.pdf',
    type: 'asset',
    status: 'pending',
    uploadedAt: '2024-01-20T10:15:00Z',
    size: 512000,
    mimeType: 'application/pdf',
    url: '/documents/doc-3.pdf',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'broker-1',
    receiverId: 'client-1',
    content: 'Hi John! Great news - your employment verification came through successfully. Your employer confirmed your position and salary details.',
    type: 'text',
    isRead: true,
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'msg-2',
    senderId: 'broker-1',
    receiverId: 'client-1',
    content: 'We\'re now just waiting on your recent bank statements to complete the document verification phase. Once we have those, we can move to underwriting! 🎉',
    type: 'text',
    isRead: true,
    createdAt: '2024-01-20T14:31:00Z',
  },
  {
    id: 'msg-3',
    senderId: 'client-1',
    receiverId: 'broker-1',
    content: 'That\'s fantastic news! I\'ll upload the bank statements today. Should I include both checking and savings accounts?',
    type: 'text',
    isRead: true,
    createdAt: '2024-01-20T15:15:00Z',
  },
];

// Mock Market Insights
export const mockMarketInsights: MarketInsight[] = [
  {
    type: 'rate_trend',
    title: 'Interest Rate Forecast',
    description: 'Rates expected to increase 0.25% in next 30 days based on Fed policy signals',
    impact: 'negative',
    confidence: 85,
    actionable: true,
  },
  {
    type: 'market_condition',
    title: 'Housing Market Update',
    description: 'Strong seller\'s market continues with 8% YoY price growth',
    impact: 'positive',
    confidence: 92,
    actionable: false,
  },
  {
    type: 'recommendation',
    title: 'First-Time Buyer Opportunity',
    description: 'First-time buyer activity up 15% - focus on FHA products',
    impact: 'positive',
    confidence: 78,
    actionable: true,
  },
];

// Utility functions for mock API responses
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = <T>(data: T, success = true, message?: string) => ({
  success,
  data,
  message,
});

export const mockPaginatedResponse = <T>(data: T[], page = 1, limit = 10, total?: number) => ({
  data: data.slice((page - 1) * limit, page * limit),
  total: total || data.length,
  page,
  limit,
  totalPages: Math.ceil((total || data.length) / limit),
});
