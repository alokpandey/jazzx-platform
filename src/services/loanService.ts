import { apiService } from './api';
import { 
  QuoteRequest, 
  QuoteResponse, 
  LoanApplication, 
  ApiResponse, 
  PaginatedResponse,
  Document,
  MarketInsight 
} from '@/types';

class LoanService {
  // Quote Management
  async getQuote(request: QuoteRequest): Promise<ApiResponse<QuoteResponse>> {
    return await apiService.post<QuoteResponse>('/loans/quote', request);
  }

  async saveQuote(quoteId: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>(`/loans/quotes/${quoteId}/save`);
  }

  async getQuoteHistory(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<QuoteResponse>>> {
    return await apiService.get<PaginatedResponse<QuoteResponse>>('/loans/quotes', {
      page,
      limit,
    });
  }

  // Loan Application Management
  async createApplication(applicationData: Partial<LoanApplication>): Promise<ApiResponse<LoanApplication>> {
    return await apiService.post<LoanApplication>('/loans/applications', applicationData);
  }

  async updateApplication(id: string, applicationData: Partial<LoanApplication>): Promise<ApiResponse<LoanApplication>> {
    return await apiService.put<LoanApplication>(`/loans/applications/${id}`, applicationData);
  }

  async getApplication(id: string): Promise<ApiResponse<LoanApplication>> {
    return await apiService.get<LoanApplication>(`/loans/applications/${id}`);
  }

  async getApplications(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<LoanApplication>>> {
    return await apiService.get<PaginatedResponse<LoanApplication>>('/loans/applications', {
      page,
      limit,
    });
  }

  async submitApplication(id: string): Promise<ApiResponse<LoanApplication>> {
    return await apiService.post<LoanApplication>(`/loans/applications/${id}/submit`);
  }

  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    return await apiService.delete<void>(`/loans/applications/${id}`);
  }

  // Document Management
  async uploadDocument(applicationId: string, file: File, documentType: string): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    formData.append('applicationId', applicationId);

    return await apiService.uploadFile<Document>('/loans/documents/upload', file);
  }

  async getDocuments(applicationId: string): Promise<ApiResponse<Document[]>> {
    return await apiService.get<Document[]>(`/loans/applications/${applicationId}/documents`);
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    return await apiService.delete<void>(`/loans/documents/${documentId}`);
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await apiService.get(`/loans/documents/${documentId}/download`);
    return response.data as Blob;
  }

  // Rate and Market Data
  async getCurrentRates(): Promise<ApiResponse<any>> {
    return await apiService.get('/loans/rates/current');
  }

  async getRateHistory(days = 30): Promise<ApiResponse<any[]>> {
    return await apiService.get('/loans/rates/history', { days });
  }

  async getMarketInsights(): Promise<ApiResponse<MarketInsight[]>> {
    return await apiService.get<MarketInsight[]>('/loans/market/insights');
  }

  // Loan Status and Timeline
  async getLoanStatus(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/loans/applications/${applicationId}/status`);
  }

  async getLoanTimeline(applicationId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/loans/applications/${applicationId}/timeline`);
  }

  // Pre-approval
  async getPreApproval(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.post(`/loans/applications/${applicationId}/pre-approval`);
  }

  // Rate Lock
  async lockRate(applicationId: string, rateId: string, lockPeriod: number): Promise<ApiResponse<any>> {
    return await apiService.post(`/loans/applications/${applicationId}/rate-lock`, {
      rateId,
      lockPeriod,
    });
  }

  async getRateLockStatus(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/loans/applications/${applicationId}/rate-lock`);
  }

  // Property Valuation
  async requestAppraisal(applicationId: string, propertyAddress: string): Promise<ApiResponse<any>> {
    return await apiService.post(`/loans/applications/${applicationId}/appraisal`, {
      propertyAddress,
    });
  }

  async getAppraisalStatus(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/loans/applications/${applicationId}/appraisal`);
  }

  // AI-powered features
  async getAIRecommendations(applicationId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/loans/applications/${applicationId}/ai-recommendations`);
  }

  async getApplicationScore(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/loans/applications/${applicationId}/ai-score`);
  }

  async getPropertyEstimate(address: string): Promise<ApiResponse<any>> {
    return await apiService.post('/loans/property/estimate', { address });
  }

  // Loan Calculator
  async calculatePayment(loanAmount: number, interestRate: number, loanTerm: number): Promise<ApiResponse<any>> {
    return await apiService.post('/loans/calculate/payment', {
      loanAmount,
      interestRate,
      loanTerm,
    });
  }

  async calculateAffordability(income: number, debts: number, downPayment: number): Promise<ApiResponse<any>> {
    return await apiService.post('/loans/calculate/affordability', {
      income,
      debts,
      downPayment,
    });
  }
}

export const loanService = new LoanService();
