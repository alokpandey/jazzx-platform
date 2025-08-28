import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockDocuments, delay, mockApiResponse } from '../mockData';

class DocumentMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/documents';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 800 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // Document upload and processing
    this.mock.onPost(`${this.baseURL}/upload`).reply(async () => {
      await delay(3000); // Simulate AI processing time
      
      // const formData = config.data;
      const fileName = `document-${Date.now()}.pdf`;
      
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: fileName,
        type: 'income', // AI-determined type
        status: 'processing',
        uploadedAt: new Date().toISOString(),
        size: Math.floor(Math.random() * 2000000) + 500000,
        mimeType: 'application/pdf',
        url: `/documents/${fileName}`,
        aiProcessing: {
          status: 'completed',
          confidence: 0.95,
          extractedData: {
            documentType: 'Pay Stub',
            employer: 'Tech Corporation Inc.',
            employeeName: 'John Smith',
            grossPay: '$8,333.33',
            netPay: '$6,250.00',
            payPeriod: 'Monthly',
            payDate: '2024-01-15',
            ytdGross: '$8,333.33',
            ytdNet: '$6,250.00'
          },
          validationResults: {
            formatValid: true,
            dataConsistent: true,
            signaturePresent: true,
            dateRecent: true,
            amountReasonable: true
          }
        }
      };
      
      return [200, mockApiResponse(newDocument)];
    });

    this.mock.onGet(`${this.baseURL}`).reply(async (config) => {
      await delay(1000);
      const { type, status } = config.params || {};
      
      let filteredDocs = [...mockDocuments];
      
      if (type) {
        filteredDocs = filteredDocs.filter(doc => doc.type === type);
      }
      
      if (status) {
        filteredDocs = filteredDocs.filter(doc => doc.status === status);
      }
      
      return [200, mockApiResponse(filteredDocs.map(doc => ({
        ...doc,
        aiAnalysis: {
          readabilityScore: Math.floor(Math.random() * 20) + 80,
          completenessScore: Math.floor(Math.random() * 15) + 85,
          accuracyScore: Math.floor(Math.random() * 10) + 90,
          riskFlags: Math.random() > 0.8 ? ['Date discrepancy detected'] : []
        }
      })))];
    });

    this.mock.onGet(/\/api\/documents\/\w+/).reply(async (config) => {
      await delay(600);
      const docId = config.url?.split('/').pop();
      const document = mockDocuments.find(d => d.id === docId) || mockDocuments[0];
      
      return [200, mockApiResponse({
        ...document,
        metadata: {
          pages: 2,
          resolution: '300 DPI',
          colorMode: 'RGB',
          fileSize: document.size,
          createdDate: document.uploadedAt,
          modifiedDate: document.verifiedAt || document.uploadedAt
        },
        aiAnalysis: {
          documentClassification: {
            type: document.type,
            subtype: 'Monthly Pay Stub',
            confidence: 0.97
          },
          extractedFields: {
            employer: 'Tech Corporation Inc.',
            employee: 'John Smith',
            payPeriod: 'Monthly',
            grossPay: 8333.33,
            netPay: 6250.00,
            deductions: {
              federalTax: 1250.00,
              stateTax: 416.67,
              socialSecurity: 516.67,
              medicare: 120.83,
              insurance: 278.16
            }
          },
          validationResults: {
            mathAccuracy: true,
            dateConsistency: true,
            formatCompliance: true,
            signaturePresent: true,
            watermarkDetected: false
          },
          riskAssessment: {
            fraudRisk: 'Low',
            alterationRisk: 'Low',
            completenessRisk: 'Low',
            overallRisk: 'Low'
          }
        }
      })];
    });

    this.mock.onPut(/\/api\/documents\/\w+\/verify/).reply(async (config) => {
      await delay(1500);
      const { status, notes } = JSON.parse(config.data);
      const docId = config.url?.split('/').slice(-2)[0];
      
      return [200, mockApiResponse({
        documentId: docId,
        status,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'AI-System',
        notes,
        verificationDetails: {
          method: 'AI + Human Review',
          confidence: 0.94,
          flags: status === 'rejected' ? ['Income amount inconsistent'] : [],
          recommendations: status === 'approved' ? ['Document meets all requirements'] : ['Request updated document']
        }
      })];
    });

    this.mock.onDelete(/\/api\/documents\/\w+/).reply(async () => {
      await delay(800);
      return [200, mockApiResponse({ 
        message: 'Document deleted successfully',
        deletedAt: new Date().toISOString()
      })];
    });

    this.mock.onGet(/\/api\/documents\/\w+\/download/).reply(async () => {
      await delay(2000);
      // Simulate PDF file download
      const pdfContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF';
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      return [200, blob];
    });

    // AI document analysis
    this.mock.onPost(`${this.baseURL}/analyze`).reply(async (config) => {
      await delay(4000); // AI analysis takes time
      const { documentId } = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        documentId,
        analysisId: `analysis-${Date.now()}`,
        results: {
          documentType: 'Pay Stub',
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
          validationChecks: {
            mathematicalAccuracy: { passed: true, confidence: 0.99 },
            dateConsistency: { passed: true, confidence: 0.97 },
            formatCompliance: { passed: true, confidence: 0.95 },
            employerVerification: { passed: true, confidence: 0.92 }
          },
          riskFlags: [],
          recommendations: [
            'Document appears authentic and complete',
            'All mathematical calculations verified',
            'Format consistent with standard pay stub templates'
          ]
        },
        processingTime: '3.2 seconds',
        aiModel: 'JazzX-DocAI-v2.1'
      })];
    });

    // Document categorization
    this.mock.onPost(`${this.baseURL}/categorize`).reply(async (config) => {
      await delay(1500);
      const { documentIds } = JSON.parse(config.data);
      
      const categories = ['income', 'asset', 'employment', 'property', 'identity'];
      const results = documentIds.map((id: string) => ({
        documentId: id,
        category: categories[Math.floor(Math.random() * categories.length)],
        confidence: 0.85 + Math.random() * 0.14,
        subcategory: 'Pay Stub',
        suggestedTags: ['verified', 'current', 'complete']
      }));
      
      return [200, mockApiResponse({
        results,
        summary: {
          totalDocuments: documentIds.length,
          categorized: results.length,
          avgConfidence: results.reduce((sum: number, r: any) => sum + r.confidence, 0) / results.length
        }
      })];
    });

    // Document requirements
    this.mock.onGet(`${this.baseURL}/requirements`).reply(async (config) => {
      await delay(800);
      const { loanType, loanAmount } = config.params || {};
      
      const baseRequirements = [
        {
          category: 'income',
          documents: ['Pay Stubs (2 months)', 'Tax Returns (2 years)', 'W-2 Forms (2 years)'],
          required: true,
          aiVerifiable: true
        },
        {
          category: 'asset',
          documents: ['Bank Statements (2 months)', 'Investment Statements', 'Gift Letter (if applicable)'],
          required: true,
          aiVerifiable: true
        },
        {
          category: 'employment',
          documents: ['Employment Verification Letter', 'HR Contact Information'],
          required: true,
          aiVerifiable: false
        },
        {
          category: 'property',
          documents: ['Purchase Agreement', 'Property Appraisal', 'Homeowners Insurance'],
          required: true,
          aiVerifiable: true
        }
      ];
      
      // Add additional requirements based on loan type
      if (loanType === 'fha') {
        baseRequirements.push({
          category: 'fha_specific',
          documents: ['FHA Case Number', 'Mortgage Insurance Premium'],
          required: true,
          aiVerifiable: false
        });
      }
      
      return [200, mockApiResponse({
        loanType,
        loanAmount,
        requirements: baseRequirements,
        estimatedProcessingTime: '5-7 business days',
        aiProcessingCapable: true
      })];
    });

    // Document templates
    this.mock.onGet(`${this.baseURL}/templates`).reply(async () => {
      await delay(600);
      return [200, mockApiResponse([
        {
          id: 'template-paystub',
          name: 'Pay Stub Template',
          category: 'income',
          description: 'Standard pay stub format for income verification',
          fields: ['employer', 'employee', 'payPeriod', 'grossPay', 'netPay', 'deductions'],
          downloadUrl: '/templates/paystub-template.pdf'
        },
        {
          id: 'template-bank-statement',
          name: 'Bank Statement Template',
          category: 'asset',
          description: 'Bank statement format for asset verification',
          fields: ['accountNumber', 'balance', 'transactions', 'statementPeriod'],
          downloadUrl: '/templates/bank-statement-template.pdf'
        }
      ])];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'document-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      dependencies: {
        'ai-ocr-engine': 'healthy',
        'document-storage': 'healthy',
        'fraud-detection': 'healthy',
        'classification-model': 'healthy'
      },
      metrics: {
        documentsProcessed: 15847,
        avgProcessingTime: '2.3s',
        accuracyRate: '96.8%',
        fraudDetectionRate: '99.2%'
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

export const documentMicroservice = new DocumentMicroservice();
