import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  mockUsers, 
  mockQuoteResponse, 
  mockClients, 
  mockBrokerStats, 
  mockAIInsights,
  mockDocuments,
  mockMessages,
  mockMarketInsights,
  delay,
  mockApiResponse,
  mockPaginatedResponse
} from './mockData';
import { LoginRequest } from '@/types';

class MockServer {
  private mock: MockAdapter;

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 1000 });
    this.setupMockRoutes();
  }

  private setupMockRoutes() {
    // Authentication routes
    this.mock.onPost('/api/auth/login').reply(async (config) => {
      await delay(1500);
      const { email, password, userType } = JSON.parse(config.data) as LoginRequest;
      
      const user = mockUsers.find(u => u.email === email && u.userType === userType);
      
      if (user && (password === 'Demo123!' || password === 'Broker123!')) {
        return [200, mockApiResponse({
          user,
          token: 'mock-jwt-token-' + user.id,
          refreshToken: 'mock-refresh-token-' + user.id,
        })];
      }
      
      return [401, mockApiResponse(null, false, 'Invalid credentials')];
    });

    this.mock.onPost('/api/auth/register').reply(async (config) => {
      await delay(2000);
      const userData = JSON.parse(config.data);
      
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return [201, mockApiResponse({
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id,
        refreshToken: 'mock-refresh-token-' + newUser.id,
      })];
    });

    this.mock.onPost('/api/auth/logout').reply(async () => {
      await delay(500);
      return [200, mockApiResponse(null, true, 'Logged out successfully')];
    });

    this.mock.onGet('/api/auth/me').reply(async () => {
      await delay(800);
      return [200, mockApiResponse(mockUsers[0])];
    });

    // Quote routes
    this.mock.onPost('/api/loans/quote').reply(async () => {
      await delay(3000); // Simulate AI processing time
      
      // Simulate AI calculation based on request
      const adjustedQuote = {
        ...mockQuoteResponse,
        id: 'quote-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      
      return [200, mockApiResponse(adjustedQuote)];
    });

    this.mock.onGet('/api/loans/quotes').reply(async (config) => {
      await delay(1000);
      const { page = 1, limit = 10 } = config.params || {};
      return [200, mockApiResponse(mockPaginatedResponse([mockQuoteResponse], page, limit))];
    });

    // Loan application routes
    this.mock.onPost('/api/loans/applications').reply(async (config) => {
      await delay(1500);
      const applicationData = JSON.parse(config.data);
      
      const newApplication = {
        id: 'app-' + Date.now(),
        userId: 'user-1',
        status: 'draft',
        ...applicationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return [201, mockApiResponse(newApplication)];
    });

    this.mock.onGet(/\/api\/loans\/applications\/\w+/).reply(async () => {
      await delay(800);
      return [200, mockApiResponse({
        id: 'app-123',
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
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
      })];
    });

    // Document routes
    this.mock.onPost('/api/loans/documents/upload').reply(async () => {
      await delay(2000);
      const newDocument = {
        id: 'doc-' + Date.now(),
        name: 'uploaded-document.pdf',
        type: 'income',
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
        size: 1024000,
        mimeType: 'application/pdf',
        url: '/documents/mock-document.pdf',
      };
      
      return [200, mockApiResponse(newDocument)];
    });

    this.mock.onGet(/\/api\/loans\/applications\/\w+\/documents/).reply(async () => {
      await delay(1000);
      return [200, mockApiResponse(mockDocuments)];
    });

    // Market data routes
    this.mock.onGet('/api/loans/rates/current').reply(async () => {
      await delay(800);
      return [200, mockApiResponse({
        conventional30: 6.25,
        conventional15: 5.75,
        fha30: 6.00,
        va30: 5.95,
        lastUpdated: new Date().toISOString(),
      })];
    });

    this.mock.onGet('/api/loans/market/insights').reply(async () => {
      await delay(1200);
      return [200, mockApiResponse(mockMarketInsights)];
    });

    // Broker routes
    this.mock.onGet('/api/broker/dashboard/stats').reply(async () => {
      await delay(1500);
      return [200, mockApiResponse(mockBrokerStats)];
    });

    this.mock.onGet('/api/broker/clients').reply(async (config) => {
      await delay(1000);
      const { page = 1, limit = 10 } = config.params || {};
      return [200, mockApiResponse(mockPaginatedResponse(mockClients, page, limit))];
    });

    this.mock.onGet(/\/api\/broker\/clients\/\w+/).reply(async (config) => {
      await delay(800);
      const clientId = config.url?.split('/').pop();
      const client = mockClients.find(c => c.id === clientId) || mockClients[0];
      return [200, mockApiResponse(client)];
    });

    this.mock.onGet('/api/broker/ai/insights').reply(async () => {
      await delay(2000);
      return [200, mockApiResponse(mockAIInsights)];
    });

    this.mock.onGet('/api/broker/ai/priority-actions').reply(async () => {
      await delay(1500);
      return [200, mockApiResponse([
        {
          id: 'action-1',
          type: 'urgent',
          title: 'Rate Lock Expiring',
          description: 'John Smith\'s rate lock expires tomorrow',
          clientId: 'client-1',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'action-2',
          type: 'medium',
          title: 'Income Verification Needed',
          description: 'Maria Garcia needs updated pay stubs',
          clientId: 'client-2',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])];
    });

    this.mock.onGet('/api/broker/pipeline').reply(async () => {
      await delay(1200);
      return [200, mockApiResponse([
        {
          stage: 'prospects',
          count: 8,
          value: 2400000,
          applications: mockClients.filter(c => c.status === 'prospect'),
        },
        {
          stage: 'application',
          count: 12,
          value: 4200000,
          applications: mockClients.filter(c => c.status === 'active'),
        },
        {
          stage: 'underwriting',
          count: 6,
          value: 2100000,
          applications: [],
        },
        {
          stage: 'closing',
          count: 3,
          value: 980000,
          applications: [],
        },
      ])];
    });

    // Messages routes
    this.mock.onGet(/\/api\/broker\/clients\/\w+\/messages/).reply(async () => {
      await delay(800);
      return [200, mockApiResponse(mockMessages)];
    });

    this.mock.onPost('/api/broker/messages/send').reply(async (config) => {
      await delay(1000);
      const messageData = JSON.parse(config.data);
      
      const newMessage = {
        id: 'msg-' + Date.now(),
        senderId: 'broker-1',
        receiverId: messageData.recipientId,
        content: messageData.content,
        type: 'text',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      return [200, mockApiResponse(newMessage)];
    });

    // AI-powered features
    this.mock.onPost('/api/loans/property/estimate').reply(async () => {
      await delay(2500);
      
      return [200, mockApiResponse({
        estimatedValue: 580000 + Math.floor(Math.random() * 100000),
        confidence: 'High',
        comparables: [
          { address: '123 Similar St', price: 575000, distance: 0.2 },
          { address: '456 Nearby Ave', price: 590000, distance: 0.3 },
          { address: '789 Close Rd', price: 565000, distance: 0.4 },
        ],
        marketTrends: {
          priceChange30d: 2.1,
          priceChange90d: 5.8,
          daysOnMarket: 28,
        },
      })];
    });

    // Catch-all for unhandled routes
    this.mock.onAny().reply(404, mockApiResponse(null, false, 'API endpoint not found'));
  }

  public reset() {
    this.mock.reset();
  }

  public restore() {
    this.mock.restore();
  }
}

// Initialize mock server in development
export const mockServer = new MockServer();

// Export for testing purposes
export { MockServer };
