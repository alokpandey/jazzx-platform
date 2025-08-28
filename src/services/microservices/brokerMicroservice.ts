import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockClients, mockBrokerStats, mockAIInsights, mockMessages, delay, mockApiResponse, mockPaginatedResponse } from '../mockData';

class BrokerMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/broker';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 1200 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // Dashboard and statistics
    this.mock.onGet(`${this.baseURL}/dashboard/stats`).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse({
        ...mockBrokerStats,
        lastUpdated: new Date().toISOString(),
        realTimeMetrics: {
          activeClients: mockBrokerStats.totalClients,
          todayApplications: 3,
          weeklyGoalProgress: 78,
          monthlyCommissionProjected: mockBrokerStats.monthlyCommission * 1.15
        }
      })];
    });

    this.mock.onGet(`${this.baseURL}/dashboard/performance`).reply(async (config) => {
      await delay(1200);
      const { period = '30d' } = config.params || {};
      
      const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
      const performanceData = Array(days).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        applications: Math.floor(Math.random() * 5) + 1,
        approvals: Math.floor(Math.random() * 3) + 1,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        clientSatisfaction: 4.2 + Math.random() * 0.8
      })).reverse();
      
      return [200, mockApiResponse({
        period,
        data: performanceData,
        summary: {
          totalApplications: performanceData.reduce((sum, day) => sum + day.applications, 0),
          totalApprovals: performanceData.reduce((sum, day) => sum + day.approvals, 0),
          totalRevenue: performanceData.reduce((sum, day) => sum + day.revenue, 0),
          avgSatisfaction: 4.7
        }
      })];
    });

    // Client management
    this.mock.onGet(`${this.baseURL}/clients`).reply(async (config) => {
      await delay(1000);
      const { page = 1, limit = 10, status, search } = config.params || {};
      
      let filteredClients = [...mockClients];
      
      if (status) {
        filteredClients = filteredClients.filter(client => client.status === status);
      }
      
      if (search) {
        filteredClients = filteredClients.filter(client => 
          client.firstName.toLowerCase().includes(search.toLowerCase()) ||
          client.lastName.toLowerCase().includes(search.toLowerCase()) ||
          client.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      return [200, mockApiResponse(mockPaginatedResponse(filteredClients, page, limit))];
    });

    this.mock.onGet(/\/api\/broker\/clients\/\w+/).reply(async (config) => {
      await delay(800);
      const clientId = config.url?.split('/').pop();
      const client = mockClients.find(c => c.id === clientId) || mockClients[0];
      
      return [200, mockApiResponse({
        ...client,
        detailedInfo: {
          applicationHistory: [
            { id: 'app-1', status: 'approved', amount: 450000, date: '2024-01-15' },
            { id: 'app-2', status: 'processing', amount: 320000, date: '2024-01-20' }
          ],
          communicationLog: [
            { type: 'call', date: '2024-01-22', duration: '15 min', notes: 'Discussed rate options' },
            { type: 'email', date: '2024-01-21', subject: 'Document requirements' },
            { type: 'meeting', date: '2024-01-18', duration: '45 min', notes: 'Initial consultation' }
          ],
          documents: [
            { name: 'Income Verification', status: 'verified', uploadDate: '2024-01-16' },
            { name: 'Credit Report', status: 'verified', uploadDate: '2024-01-15' },
            { name: 'Bank Statements', status: 'pending', uploadDate: '2024-01-20' }
          ],
          riskAssessment: {
            creditRisk: 'Low',
            incomeStability: 'High',
            propertyRisk: 'Medium',
            overallRisk: 'Low'
          }
        }
      })];
    });

    this.mock.onPost(`${this.baseURL}/clients`).reply(async (config) => {
      await delay(1500);
      const clientData = JSON.parse(config.data);
      
      const newClient = {
        id: `client-${Date.now()}`,
        ...clientData,
        status: 'prospect',
        aiScore: Math.floor(Math.random() * 30) + 70, // 70-99
        lastActivity: 'Just now',
        tags: ['New Lead'],
        assignedBroker: 'broker-1',
        createdAt: new Date().toISOString(),
      };
      
      mockClients.push(newClient);
      return [201, mockApiResponse(newClient)];
    });

    this.mock.onPut(/\/api\/broker\/clients\/\w+/).reply(async (config) => {
      await delay(1000);
      const updates = JSON.parse(config.data);
      const clientId = config.url?.split('/').slice(-1)[0];
      
      const clientIndex = mockClients.findIndex(c => c.id === clientId);
      if (clientIndex !== -1) {
        mockClients[clientIndex] = {
          ...mockClients[clientIndex],
          ...updates,
          lastActivity: 'Just updated'
        };
        return [200, mockApiResponse(mockClients[clientIndex])];
      }
      
      return [404, mockApiResponse(null, false, 'Client not found')];
    });

    this.mock.onDelete(/\/api\/broker\/clients\/\w+/).reply(async () => {
      await delay(800);
      return [200, mockApiResponse({ message: 'Client deleted successfully' })];
    });

    // Communication
    this.mock.onPost(`${this.baseURL}/messages/send`).reply(async (config) => {
      await delay(1000);
      const messageData = JSON.parse(config.data);
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'broker-1',
        receiverId: messageData.recipientId,
        content: messageData.content,
        type: 'text',
        isRead: false,
        createdAt: new Date().toISOString(),
        deliveryStatus: 'delivered'
      };
      
      return [200, mockApiResponse(newMessage)];
    });

    this.mock.onGet(/\/api\/broker\/clients\/\w+\/messages/).reply(async (config) => {
      await delay(800);
      const { page = 1, limit = 20 } = config.params || {};
      return [200, mockApiResponse(mockPaginatedResponse(mockMessages, page, limit))];
    });

    this.mock.onPost(`${this.baseURL}/calls/schedule`).reply(async (config) => {
      await delay(1200);
      const { clientId, scheduledAt, notes } = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        id: `call-${Date.now()}`,
        clientId,
        scheduledAt,
        notes,
        status: 'scheduled',
        meetingLink: `https://teams.microsoft.com/meet/${Date.now()}`,
        createdAt: new Date().toISOString()
      })];
    });

    // Pipeline management
    this.mock.onGet(`${this.baseURL}/pipeline`).reply(async () => {
      await delay(1200);
      // const { status, dateRange } = config.params || {};
      
      const pipelineData = [
        {
          stage: 'prospects',
          count: 8,
          value: 2400000,
          applications: mockClients.filter(c => c.status === 'prospect').slice(0, 3),
          conversionRate: 45,
          avgTimeInStage: '3.2 days'
        },
        {
          stage: 'application',
          count: 12,
          value: 4200000,
          applications: mockClients.filter(c => c.status === 'active').slice(0, 4),
          conversionRate: 78,
          avgTimeInStage: '8.5 days'
        },
        {
          stage: 'underwriting',
          count: 6,
          value: 2100000,
          applications: [],
          conversionRate: 92,
          avgTimeInStage: '12.3 days'
        },
        {
          stage: 'closing',
          count: 3,
          value: 980000,
          applications: [],
          conversionRate: 96,
          avgTimeInStage: '5.1 days'
        },
      ];
      
      return [200, mockApiResponse({
        stages: pipelineData,
        totalValue: pipelineData.reduce((sum, stage) => sum + stage.value, 0),
        totalCount: pipelineData.reduce((sum, stage) => sum + stage.count, 0),
        forecastedClosings: {
          thisMonth: 8,
          nextMonth: 12,
          thisQuarter: 28
        }
      })];
    });

    this.mock.onPut(/\/api\/broker\/pipeline\/\w+\/stage/).reply(async (config) => {
      await delay(1000);
      const { stage } = JSON.parse(config.data);
      const applicationId = config.url?.split('/').slice(-2)[0];
      
      return [200, mockApiResponse({
        applicationId,
        newStage: stage,
        updatedAt: new Date().toISOString(),
        message: `Application moved to ${stage} stage`
      })];
    });

    this.mock.onGet(`${this.baseURL}/pipeline/forecast`).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse({
        currentMonth: {
          projected: 2800000,
          actual: 1950000,
          confidence: 87
        },
        nextMonth: {
          projected: 3200000,
          confidence: 82
        },
        quarter: {
          projected: 8500000,
          confidence: 79
        },
        trends: [
          { metric: 'Application Volume', trend: 'up', change: 15 },
          { metric: 'Conversion Rate', trend: 'up', change: 8 },
          { metric: 'Average Loan Size', trend: 'stable', change: 2 },
          { metric: 'Time to Close', trend: 'down', change: -12 }
        ]
      })];
    });

    // AI insights and recommendations
    this.mock.onGet(`${this.baseURL}/ai/insights`).reply(async () => {
      await delay(2000);
      return [200, mockApiResponse(mockAIInsights.map(insight => ({
        ...insight,
        generatedAt: new Date().toISOString(),
        aiModel: 'JazzX-AI-v2.1',
        dataPoints: Math.floor(Math.random() * 1000) + 500
      })))];
    });

    this.mock.onGet(`${this.baseURL}/ai/priority-actions`).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse([
        {
          id: 'action-1',
          type: 'urgent',
          priority: 'high',
          title: 'Rate Lock Expiring Soon',
          description: 'John Smith\'s rate lock expires in 24 hours',
          clientId: 'client-1',
          clientName: 'John Smith',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          estimatedImpact: '$2,400 potential loss',
          recommendedAction: 'Contact client immediately to extend or finalize'
        },
        {
          id: 'action-2',
          type: 'opportunity',
          priority: 'medium',
          title: 'Cross-sell Opportunity',
          description: 'Maria Garcia qualifies for HELOC product',
          clientId: 'client-2',
          clientName: 'Maria Garcia',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedImpact: '$3,200 additional commission',
          recommendedAction: 'Schedule consultation for HELOC discussion'
        },
        {
          id: 'action-3',
          type: 'follow-up',
          priority: 'medium',
          title: 'Document Follow-up Required',
          description: 'Robert Johnson needs updated employment verification',
          clientId: 'client-3',
          clientName: 'Robert Johnson',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedImpact: 'Prevent 5-day delay',
          recommendedAction: 'Send document request with deadline'
        }
      ])];
    });

    this.mock.onGet(`${this.baseURL}/ai/client-scoring`).reply(async () => {
      await delay(1800);
      return [200, mockApiResponse(mockClients.map(client => ({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        aiScore: client.aiScore,
        riskLevel: client.aiScore > 85 ? 'Low' : client.aiScore > 70 ? 'Medium' : 'High',
        approvalProbability: client.aiScore + Math.floor(Math.random() * 10),
        scoringFactors: [
          { factor: 'Credit Score', weight: 35, score: client.aiScore + Math.floor(Math.random() * 10) },
          { factor: 'Income Stability', weight: 25, score: client.aiScore + Math.floor(Math.random() * 15) },
          { factor: 'Debt-to-Income', weight: 20, score: client.aiScore + Math.floor(Math.random() * 8) },
          { factor: 'Employment History', weight: 20, score: client.aiScore + Math.floor(Math.random() * 12) }
        ],
        recommendations: [
          client.aiScore > 85 ? 'Excellent candidate - fast-track application' : 'Review income documentation carefully',
          'Consider premium rate options',
          'Schedule follow-up within 48 hours'
        ],
        lastUpdated: new Date().toISOString()
      })))];
    });

    this.mock.onGet(`${this.baseURL}/ai/market-recommendations`).reply(async () => {
      await delay(2200);
      return [200, mockApiResponse([
        {
          type: 'rate_strategy',
          title: 'Rate Environment Analysis',
          description: 'Current market conditions favor 15-year fixed products',
          confidence: 89,
          impact: 'High',
          recommendation: 'Promote 15-year fixed rates to qualified borrowers',
          supportingData: {
            rateTrend: 'Stable with slight upward pressure',
            demandIndicators: 'High demand for shorter terms',
            competitorAnalysis: '15-year rates 0.5% below market average'
          }
        },
        {
          type: 'client_targeting',
          title: 'High-Value Client Segments',
          description: 'Tech professionals showing 40% higher approval rates',
          confidence: 92,
          impact: 'Medium',
          recommendation: 'Focus marketing efforts on tech industry professionals',
          supportingData: {
            conversionRate: '68% vs 48% average',
            averageLoanSize: '$650K vs $450K average',
            timeToClose: '18 days vs 25 days average'
          }
        }
      ])];
    });

    // Reports and analytics
    this.mock.onGet(`${this.baseURL}/reports/performance`).reply(async (config) => {
      await delay(2000);
      const { startDate, endDate } = config.params || {};
      
      return [200, mockApiResponse({
        reportPeriod: { startDate, endDate },
        summary: {
          totalApplications: 45,
          approvedApplications: 38,
          totalVolume: 12500000,
          commission: 87500,
          clientSatisfaction: 4.8
        },
        monthlyBreakdown: Array(12).fill(null).map((_, i) => ({
          month: new Date(2024, i, 1).toISOString().split('T')[0],
          applications: Math.floor(Math.random() * 20) + 15,
          volume: Math.floor(Math.random() * 2000000) + 800000,
          commission: Math.floor(Math.random() * 15000) + 5000
        })),
        topPerformingProducts: [
          { product: '30-Year Fixed', count: 28, volume: 8400000 },
          { product: '15-Year Fixed', count: 12, volume: 2800000 },
          { product: 'FHA', count: 8, volume: 1800000 }
        ]
      })];
    });

    this.mock.onGet(/\/api\/broker\/reports\/client\/\w+/).reply(async () => {
      await delay(1500);
      return [200, mockApiResponse({
        clientSummary: mockClients[0],
        applicationHistory: [
          { date: '2024-01-15', type: 'Application Started', status: 'completed' },
          { date: '2024-01-16', type: 'Documents Uploaded', status: 'completed' },
          { date: '2024-01-18', type: 'Credit Check', status: 'completed' },
          { date: '2024-01-20', type: 'Underwriting', status: 'in_progress' }
        ],
        communicationLog: [
          { date: '2024-01-22', type: 'Phone Call', duration: '15 min' },
          { date: '2024-01-21', type: 'Email', subject: 'Rate lock confirmation' },
          { date: '2024-01-19', type: 'Document Request', status: 'fulfilled' }
        ],
        financialSummary: {
          loanAmount: 450000,
          interestRate: 6.25,
          monthlyPayment: 2771,
          estimatedClosingCosts: 8500
        }
      })];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'broker-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      dependencies: {
        'client-database': 'healthy',
        'ai-scoring-engine': 'healthy',
        'communication-service': 'healthy',
        'analytics-engine': 'healthy'
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

export const brokerMicroservice = new BrokerMicroservice();
