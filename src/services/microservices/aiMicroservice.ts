import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { delay, mockApiResponse } from '../mockData';

class AIMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/ai';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 2000 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // AI-powered loan matching
    this.mock.onPost(`${this.baseURL}/loan-matching`).reply(async () => {
      await delay(3500); // AI processing time
      // const loanRequest = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        requestId: `ai-match-${Date.now()}`,
        matches: [
          {
            lenderId: 'lender-1',
            lenderName: 'Premier Mortgage Corp',
            loanType: '30-Year Fixed',
            interestRate: 6.125,
            apr: 6.234,
            monthlyPayment: 3045,
            confidence: 0.94,
            matchReasons: [
              'Excellent credit score match',
              'Income-to-debt ratio optimal',
              'Property type preference'
            ],
            estimatedApprovalTime: '3-5 business days'
          },
          {
            lenderId: 'lender-2',
            lenderName: 'National Bank Lending',
            loanType: '30-Year Fixed',
            interestRate: 6.25,
            apr: 6.31,
            monthlyPayment: 3078,
            confidence: 0.89,
            matchReasons: [
              'Strong employment history',
              'Competitive rate offering',
              'Fast processing capability'
            ],
            estimatedApprovalTime: '2-4 business days'
          }
        ],
        aiInsights: {
          recommendedLender: 'lender-1',
          confidenceScore: 0.94,
          riskAssessment: 'Low',
          approvalProbability: 0.92,
          keyFactors: [
            'Credit score: 785 (Excellent)',
            'Debt-to-income: 28% (Good)',
            'Down payment: 20% (Strong)',
            'Employment: 5+ years (Stable)'
          ]
        },
        processingTime: '3.2 seconds',
        modelVersion: 'JazzX-LoanMatch-v2.1'
      })];
    });

    // AI risk assessment
    this.mock.onPost(`${this.baseURL}/risk-assessment`).reply(async (config) => {
      await delay(2500);
      const applicationData = JSON.parse(config.data);
      
      const riskScore = Math.floor(Math.random() * 30) + 70; // 70-99
      
      return [200, mockApiResponse({
        applicationId: applicationData.applicationId,
        riskScore,
        riskLevel: riskScore > 85 ? 'Low' : riskScore > 70 ? 'Medium' : 'High',
        approvalProbability: (riskScore + Math.random() * 10) / 100,
        riskFactors: [
          {
            factor: 'Credit Score',
            score: riskScore + Math.floor(Math.random() * 10),
            weight: 0.35,
            impact: 'positive',
            details: 'Excellent credit history with no recent delinquencies'
          },
          {
            factor: 'Income Stability',
            score: riskScore + Math.floor(Math.random() * 8),
            weight: 0.25,
            impact: 'positive',
            details: '5+ years with current employer, consistent income growth'
          },
          {
            factor: 'Debt-to-Income Ratio',
            score: riskScore - Math.floor(Math.random() * 5),
            weight: 0.20,
            impact: 'neutral',
            details: '28% DTI ratio within acceptable range'
          },
          {
            factor: 'Property Value',
            score: riskScore + Math.floor(Math.random() * 12),
            weight: 0.20,
            impact: 'positive',
            details: 'Property in stable, appreciating neighborhood'
          }
        ],
        recommendations: [
          riskScore > 85 ? 'Excellent candidate for premium rates' : 'Standard processing recommended',
          'Consider expedited underwriting',
          'Monitor for rate lock opportunities'
        ],
        modelConfidence: 0.92,
        lastUpdated: new Date().toISOString()
      })];
    });

    // AI document analysis
    this.mock.onPost(`${this.baseURL}/document-analysis`).reply(async (config) => {
      await delay(4000);
      const { documentId, documentType } = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        documentId,
        analysisId: `ai-doc-${Date.now()}`,
        results: {
          documentType: documentType || 'Pay Stub',
          confidence: 0.96,
          extractedData: {
            employer: 'Tech Corporation Inc.',
            employee: 'John Smith',
            payPeriod: 'Monthly',
            grossIncome: 8333.33,
            netIncome: 6250.00,
            payDate: '2024-01-15',
            ytdGross: 8333.33,
            deductions: {
              federal: 1250.00,
              state: 416.67,
              fica: 637.50,
              insurance: 278.16
            }
          },
          validationResults: {
            authenticity: { score: 0.98, passed: true },
            completeness: { score: 0.95, passed: true },
            consistency: { score: 0.97, passed: true },
            recency: { score: 0.92, passed: true }
          },
          fraudIndicators: {
            alterationDetected: false,
            inconsistentFonts: false,
            suspiciousPatterns: false,
            overallFraudRisk: 'Low'
          },
          qualityMetrics: {
            readability: 0.94,
            imageQuality: 0.89,
            textClarity: 0.92
          }
        },
        processingTime: '3.8 seconds',
        modelVersion: 'JazzX-DocAI-v2.1'
      })];
    });

    // AI market predictions
    this.mock.onGet(`${this.baseURL}/market-predictions`).reply(async (config) => {
      await delay(3000);
      const { timeframe = '30d', loanType = 'conventional' } = config.params || {};
      
      return [200, mockApiResponse({
        timeframe,
        loanType,
        predictions: {
          interestRates: {
            current: 6.25,
            predicted30d: 6.375,
            predicted90d: 6.50,
            confidence: 0.87,
            trend: 'upward',
            factors: [
              'Federal Reserve policy signals',
              'Inflation expectations',
              'Economic growth indicators',
              'Housing market demand'
            ]
          },
          housingMarket: {
            priceAppreciation: {
              predicted30d: 0.8,
              predicted90d: 2.4,
              confidence: 0.82
            },
            inventory: {
              trend: 'increasing',
              impact: 'moderate_positive',
              confidence: 0.79
            },
            demandIndicators: {
              buyerActivity: 'high',
              seasonalAdjustment: 1.15,
              confidence: 0.85
            }
          },
          lendingEnvironment: {
            approvalRates: {
              current: 0.78,
              predicted: 0.76,
              confidence: 0.83
            },
            competitiveness: 'high',
            newProducts: [
              'AI-assisted underwriting',
              'Green mortgage incentives',
              'First-time buyer programs'
            ]
          }
        },
        recommendations: [
          'Consider rate lock within 14 days',
          'Monitor Fed announcements closely',
          'Prepare for increased competition'
        ],
        generatedAt: new Date().toISOString(),
        modelVersion: 'JazzX-MarketAI-v1.8'
      })];
    });

    // AI client scoring for brokers
    this.mock.onPost(`${this.baseURL}/client-scoring`).reply(async (config) => {
      await delay(2000);
      const clientData = JSON.parse(config.data);
      
      const score = Math.floor(Math.random() * 30) + 70;
      
      return [200, mockApiResponse({
        clientId: clientData.clientId,
        aiScore: score,
        scoreBreakdown: {
          creditworthiness: score + Math.floor(Math.random() * 10),
          incomeStability: score + Math.floor(Math.random() * 8),
          propertyValue: score + Math.floor(Math.random() * 12),
          marketTiming: score + Math.floor(Math.random() * 6),
          brokerFit: score + Math.floor(Math.random() * 15)
        },
        riskLevel: score > 85 ? 'Low' : score > 70 ? 'Medium' : 'High',
        approvalProbability: (score + Math.random() * 15) / 100,
        timeToClose: score > 85 ? '18-22 days' : score > 70 ? '22-28 days' : '28-35 days',
        recommendedActions: [
          score > 85 ? 'Fast-track application' : 'Standard processing',
          'Schedule follow-up within 48 hours',
          'Prepare rate lock strategy'
        ],
        crossSellOpportunities: [
          { product: 'Home Insurance', probability: 0.78, value: 1200 },
          { product: 'HELOC', probability: 0.45, value: 3500 },
          { product: 'Investment Property', probability: 0.23, value: 8500 }
        ],
        confidence: 0.91,
        lastUpdated: new Date().toISOString()
      })];
    });

    // AI performance optimization
    this.mock.onPost(`${this.baseURL}/performance-optimization`).reply(async (config) => {
      await delay(2800);
      const performanceData = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        brokerId: performanceData.brokerId,
        optimizations: [
          {
            area: 'Client Communication',
            currentScore: 78,
            potentialScore: 89,
            recommendations: [
              'Increase follow-up frequency by 25%',
              'Implement automated status updates',
              'Use AI-suggested response templates'
            ],
            estimatedImpact: {
              conversionIncrease: '12%',
              timesSaved: '4.5 hours/week',
              clientSatisfaction: '+0.8 points'
            }
          },
          {
            area: 'Lead Qualification',
            currentScore: 82,
            potentialScore: 94,
            recommendations: [
              'Focus on tech industry professionals',
              'Prioritize clients with 750+ credit scores',
              'Target loan amounts $400K-$800K'
            ],
            estimatedImpact: {
              conversionIncrease: '18%',
              avgLoanSize: '+$45K',
              processingTime: '-3.2 days'
            }
          },
          {
            area: 'Rate Strategy',
            currentScore: 75,
            potentialScore: 87,
            recommendations: [
              'Implement dynamic rate locking',
              'Monitor competitor rates daily',
              'Use AI-powered rate predictions'
            ],
            estimatedImpact: {
              competitiveAdvantage: '15%',
              clientRetention: '+8%',
              marginImprovement: '+0.125%'
            }
          }
        ],
        overallScore: 78,
        potentialScore: 90,
        implementationPlan: {
          phase1: 'Communication optimization (2 weeks)',
          phase2: 'Lead qualification refinement (3 weeks)',
          phase3: 'Rate strategy implementation (4 weeks)'
        },
        confidence: 0.88,
        generatedAt: new Date().toISOString()
      })];
    });

    // AI chat assistant
    this.mock.onPost(`${this.baseURL}/chat`).reply(async () => {
      await delay(1500);
      // const { message, context, userId } = JSON.parse(config.data);
      
      const responses = [
        "Based on your credit score of 785 and income of $120,000, you qualify for our best rates. I recommend the 30-year fixed at 6.125% APR.",
        "Your application is progressing well. The underwriter has reviewed your income documentation and everything looks good. Next step is the property appraisal.",
        "Current market conditions favor rate locking within the next 7 days. Rates are expected to increase by 0.125% based on Fed signals.",
        "I've analyzed your client portfolio and identified 3 high-value prospects who are likely to close within 30 days. Would you like me to prioritize them?",
        "Your document upload was successful. I've extracted the key information and verified the income amounts. No additional documentation needed for this category."
      ];
      
      return [200, mockApiResponse({
        response: responses[Math.floor(Math.random() * responses.length)],
        confidence: 0.92,
        suggestedActions: [
          'Review rate lock options',
          'Schedule client consultation',
          'Upload additional documents'
        ],
        relatedInsights: [
          'Market rates trending upward',
          'Client satisfaction score: 4.8/5',
          'Processing time: 18% faster than average'
        ],
        conversationId: `conv-${Date.now()}`,
        timestamp: new Date().toISOString()
      })];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'ai-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.1',
      models: {
        'loan-matching': { status: 'active', accuracy: '94.2%', version: 'v2.1' },
        'risk-assessment': { status: 'active', accuracy: '91.8%', version: 'v2.0' },
        'document-analysis': { status: 'active', accuracy: '96.5%', version: 'v2.1' },
        'market-prediction': { status: 'active', accuracy: '87.3%', version: 'v1.8' },
        'client-scoring': { status: 'active', accuracy: '89.7%', version: 'v1.9' }
      },
      metrics: {
        requestsProcessed: 45672,
        avgResponseTime: '2.3s',
        modelAccuracy: '93.1%',
        uptime: '99.8%'
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

export const aiMicroservice = new AIMicroservice();
