import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockQuoteResponse, mockDocuments, mockMarketInsights, delay, mockApiResponse, mockPaginatedResponse } from '../mockData';

class LoanMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/loans';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 1000 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // Quote endpoints
    this.mock.onPost(`${this.baseURL}/quote`).reply(async () => {
      await delay(3000); // Simulate AI processing time
      
      const adjustedQuote = {
        ...mockQuoteResponse,
        id: `quote-${Date.now()}`,
        createdAt: new Date().toISOString(),
        aiProcessingTime: '2.8s',
        confidence: Math.floor(Math.random() * 10) + 90, // 90-99%
      };
      
      return [200, mockApiResponse(adjustedQuote)];
    });

    this.mock.onGet(`${this.baseURL}/quotes`).reply(async (config) => {
      await delay(1000);
      const { page = 1, limit = 10 } = config.params || {};
      const quotes = Array(5).fill(null).map((_, i) => ({
        ...mockQuoteResponse,
        id: `quote-${Date.now()}-${i}`,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }));
      return [200, mockApiResponse(mockPaginatedResponse(quotes, page, limit))];
    });

    this.mock.onPost(/\/api\/loans\/quotes\/\w+\/save/).reply(async () => {
      await delay(800);
      return [200, mockApiResponse({ message: 'Quote saved successfully' })];
    });

    // Application endpoints
    this.mock.onPost(`${this.baseURL}/applications`).reply(async (config) => {
      await delay(1500);
      const applicationData = JSON.parse(config.data);
      
      const newApplication = {
        id: `app-${Date.now()}`,
        userId: 'user-1',
        status: 'draft',
        ...applicationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationNumber: `JX${Date.now().toString().slice(-6)}`,
        estimatedClosingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      return [201, mockApiResponse(newApplication)];
    });

    this.mock.onGet(/\/api\/loans\/applications\/\w+/).reply(async (config) => {
      await delay(800);
      const applicationId = config.url?.split('/').pop();
      
      return [200, mockApiResponse({
        id: applicationId,
        userId: 'user-1',
        status: 'processing',
        loanAmount: 500000,
        propertyValue: 600000,
        downPayment: 100000,
        loanType: 'conventional',
        propertyType: 'primary',
        creditScore: 785,
        annualIncome: 120000,
        employmentStatus: 'employed',
        applicationNumber: `JX${Date.now().toString().slice(-6)}`,
        progress: 65,
        nextSteps: ['Upload bank statements', 'Schedule appraisal', 'Review loan terms'],
        estimatedClosingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
      })];
    });

    this.mock.onGet(`${this.baseURL}/applications`).reply(async (config) => {
      await delay(1200);
      const { page = 1, limit = 10 } = config.params || {};
      
      const applications = Array(3).fill(null).map((_, i) => ({
        id: `app-${Date.now()}-${i}`,
        userId: 'user-1',
        status: ['draft', 'processing', 'underwriting'][i],
        loanAmount: [450000, 320000, 680000][i],
        applicationNumber: `JX${(Date.now() + i).toString().slice(-6)}`,
        progress: [25, 65, 85][i],
        createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      
      return [200, mockApiResponse(mockPaginatedResponse(applications, page, limit))];
    });

    this.mock.onPut(/\/api\/loans\/applications\/\w+/).reply(async (config) => {
      await delay(1000);
      const updates = JSON.parse(config.data);
      const applicationId = config.url?.split('/').slice(-1)[0];
      
      return [200, mockApiResponse({
        id: applicationId,
        ...updates,
        updatedAt: new Date().toISOString(),
      })];
    });

    this.mock.onPost(/\/api\/loans\/applications\/\w+\/submit/).reply(async () => {
      await delay(2000);
      return [200, mockApiResponse({
        message: 'Application submitted successfully',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        confirmationNumber: `JX${Date.now().toString().slice(-6)}`,
      })];
    });

    // Document endpoints
    this.mock.onPost(`${this.baseURL}/documents/upload`).reply(async () => {
      await delay(2500);
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: `uploaded-document-${Date.now()}.pdf`,
        type: 'income',
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
        size: Math.floor(Math.random() * 2000000) + 500000, // 500KB - 2.5MB
        mimeType: 'application/pdf',
        url: `/documents/doc-${Date.now()}.pdf`,
        aiExtractedData: {
          documentType: 'Pay Stub',
          employer: 'Tech Corp Inc.',
          grossPay: '$8,333.33',
          netPay: '$6,250.00',
          payPeriod: 'Monthly'
        }
      };
      
      return [200, mockApiResponse(newDocument)];
    });

    this.mock.onGet(/\/api\/loans\/applications\/\w+\/documents/).reply(async () => {
      await delay(1000);
      return [200, mockApiResponse(mockDocuments)];
    });

    this.mock.onDelete(/\/api\/loans\/documents\/\w+/).reply(async () => {
      await delay(600);
      return [200, mockApiResponse({ message: 'Document deleted successfully' })];
    });

    this.mock.onGet(/\/api\/loans\/documents\/\w+\/download/).reply(async () => {
      await delay(1500);
      // Simulate file download
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      return [200, blob];
    });

    // Rate and market data endpoints
    this.mock.onGet(`${this.baseURL}/rates/current`).reply(async () => {
      await delay(800);
      return [200, mockApiResponse({
        conventional30: 6.25 + (Math.random() - 0.5) * 0.5, // ±0.25%
        conventional15: 5.75 + (Math.random() - 0.5) * 0.5,
        fha30: 6.00 + (Math.random() - 0.5) * 0.5,
        va30: 5.95 + (Math.random() - 0.5) * 0.5,
        jumbo30: 6.45 + (Math.random() - 0.5) * 0.5,
        lastUpdated: new Date().toISOString(),
        source: 'Federal Reserve Economic Data',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        changePercent: (Math.random() - 0.5) * 0.2
      })];
    });

    this.mock.onGet(`${this.baseURL}/rates/history`).reply(async (config) => {
      await delay(1200);
      const { days = 30 } = config.params || {};
      
      const history = Array(days).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        conventional30: 6.25 + Math.sin(i * 0.1) * 0.3,
        conventional15: 5.75 + Math.sin(i * 0.1) * 0.25,
        fha30: 6.00 + Math.sin(i * 0.1) * 0.3,
        va30: 5.95 + Math.sin(i * 0.1) * 0.25,
      })).reverse();
      
      return [200, mockApiResponse(history)];
    });

    this.mock.onGet(`${this.baseURL}/market/insights`).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse(mockMarketInsights)];
    });

    // Loan status and timeline
    this.mock.onGet(/\/api\/loans\/applications\/\w+\/status/).reply(async () => {
      await delay(1000);
      return [200, mockApiResponse({
        currentStatus: 'underwriting',
        progress: 75,
        timeline: [
          { stage: 'application', status: 'completed', date: '2024-01-15T10:00:00Z' },
          { stage: 'documentation', status: 'completed', date: '2024-01-18T14:30:00Z' },
          { stage: 'verification', status: 'completed', date: '2024-01-20T09:15:00Z' },
          { stage: 'underwriting', status: 'in_progress', date: '2024-01-22T11:00:00Z' },
          { stage: 'approval', status: 'pending', estimatedDate: '2024-01-25T16:00:00Z' },
          { stage: 'closing', status: 'pending', estimatedDate: '2024-01-30T10:00:00Z' }
        ],
        nextActions: [
          'Underwriter reviewing income documentation',
          'Appraisal scheduled for January 24th',
          'Final approval expected by January 25th'
        ],
        estimatedClosingDate: '2024-01-30T10:00:00Z'
      })];
    });

    // AI-powered features
    this.mock.onGet(/\/api\/loans\/applications\/\w+\/ai-recommendations/).reply(async () => {
      await delay(2000);
      return [200, mockApiResponse([
        {
          type: 'rate_optimization',
          title: 'Rate Lock Opportunity',
          description: 'Current rates are 0.125% below your quoted rate. Consider locking now.',
          confidence: 92,
          potentialSavings: '$18,500 over loan term',
          action: 'Lock rate within 48 hours'
        },
        {
          type: 'document_optimization',
          title: 'Document Efficiency',
          description: 'Upload recent bank statements to expedite underwriting by 3-5 days.',
          confidence: 88,
          timesSaved: '3-5 days',
          action: 'Upload 2 months of bank statements'
        }
      ])];
    });

    this.mock.onGet(/\/api\/loans\/applications\/\w+\/ai-score/).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse({
        overallScore: 87,
        approvalProbability: 94,
        riskFactors: [
          { factor: 'Credit Score', score: 95, impact: 'positive' },
          { factor: 'Debt-to-Income', score: 82, impact: 'neutral' },
          { factor: 'Employment History', score: 90, impact: 'positive' },
          { factor: 'Down Payment', score: 85, impact: 'positive' }
        ],
        recommendations: [
          'Excellent credit profile - qualify for best rates',
          'Consider increasing down payment for better terms',
          'Strong employment history supports approval'
        ]
      })];
    });

    // Property valuation
    this.mock.onPost(`${this.baseURL}/property/estimate`).reply(async () => {
      await delay(2500);
      return [200, mockApiResponse({
        estimatedValue: 580000 + Math.floor(Math.random() * 100000),
        confidence: 'High',
        valuationDate: new Date().toISOString(),
        comparables: [
          { address: '123 Similar St', price: 575000, distance: 0.2, soldDate: '2024-01-10' },
          { address: '456 Nearby Ave', price: 590000, distance: 0.3, soldDate: '2024-01-05' },
          { address: '789 Close Rd', price: 565000, distance: 0.4, soldDate: '2023-12-28' },
        ],
        marketTrends: {
          priceChange30d: 2.1,
          priceChange90d: 5.8,
          daysOnMarket: 28,
          inventoryLevel: 'Low',
          marketCondition: 'Seller\'s Market'
        },
        aiInsights: [
          'Property value trending upward in this neighborhood',
          'Low inventory supporting price appreciation',
          'Comparable sales indicate strong market demand'
        ]
      })];
    });

    // Loan calculators
    this.mock.onPost(`${this.baseURL}/calculate/payment`).reply(async (config) => {
      await delay(500);
      const { loanAmount, interestRate, loanTerm } = JSON.parse(config.data);
      
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanTerm * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      return [200, mockApiResponse({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round((monthlyPayment * numPayments - loanAmount) * 100) / 100,
        totalPayment: Math.round(monthlyPayment * numPayments * 100) / 100,
        breakdown: {
          principal: loanAmount,
          interest: Math.round((monthlyPayment * numPayments - loanAmount) * 100) / 100,
          taxes: Math.round(loanAmount * 0.012 / 12 * 100) / 100, // Estimated property tax
          insurance: Math.round(loanAmount * 0.004 / 12 * 100) / 100, // Estimated insurance
        }
      })];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'loan-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      dependencies: {
        'ai-engine': 'healthy',
        'document-processor': 'healthy',
        'rate-provider': 'healthy'
      }
    });
  }

  public reset() {
    this.mock.reset();
  }

  public restore() {
    this.mock.restore();
  }
}

export const loanMicroservice = new LoanMicroservice();
