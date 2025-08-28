import { apiService } from './api';
import { 
  Client, 
  Broker, 
  BrokerStats, 
  AIInsight, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

class BrokerService {
  // Dashboard and Statistics
  async getDashboardStats(): Promise<ApiResponse<BrokerStats>> {
    return await apiService.get<BrokerStats>('/broker/dashboard/stats');
  }

  async getPerformanceMetrics(period = '30d'): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/dashboard/performance', { period });
  }

  // Client Management
  async getClients(page = 1, limit = 10, filters?: any): Promise<ApiResponse<PaginatedResponse<Client>>> {
    return await apiService.get<PaginatedResponse<Client>>('/broker/clients', {
      page,
      limit,
      ...filters,
    });
  }

  async getClient(clientId: string): Promise<ApiResponse<Client>> {
    return await apiService.get<Client>(`/broker/clients/${clientId}`);
  }

  async createClient(clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    return await apiService.post<Client>('/broker/clients', clientData);
  }

  async updateClient(clientId: string, clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    return await apiService.put<Client>(`/broker/clients/${clientId}`, clientData);
  }

  async deleteClient(clientId: string): Promise<ApiResponse<void>> {
    return await apiService.delete<void>(`/broker/clients/${clientId}`);
  }

  async assignClient(clientId: string, brokerId: string): Promise<ApiResponse<Client>> {
    return await apiService.post<Client>(`/broker/clients/${clientId}/assign`, { brokerId });
  }

  // Client Communication
  async sendMessage(clientId: string, message: string): Promise<ApiResponse<any>> {
    return await apiService.post('/broker/messages/send', {
      recipientId: clientId,
      content: message,
    });
  }

  async getClientMessages(clientId: string, page = 1, limit = 20): Promise<ApiResponse<any>> {
    return await apiService.get(`/broker/clients/${clientId}/messages`, {
      page,
      limit,
    });
  }

  async scheduleCall(clientId: string, scheduledAt: string, notes?: string): Promise<ApiResponse<any>> {
    return await apiService.post('/broker/calls/schedule', {
      clientId,
      scheduledAt,
      notes,
    });
  }

  // Pipeline Management
  async getPipeline(filters?: any): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/pipeline', filters);
  }

  async updatePipelineStage(applicationId: string, stage: string): Promise<ApiResponse<any>> {
    return await apiService.put(`/broker/pipeline/${applicationId}/stage`, { stage });
  }

  async getPipelineValue(period = '30d'): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/pipeline/value', { period });
  }

  async getPipelineForecast(): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/pipeline/forecast');
  }

  // AI Insights and Recommendations
  async getAIInsights(): Promise<ApiResponse<AIInsight[]>> {
    return await apiService.get<AIInsight[]>('/broker/ai/insights');
  }

  async getPriorityActions(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/ai/priority-actions');
  }

  async getClientScoring(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/ai/client-scoring');
  }

  async getMarketRecommendations(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/ai/market-recommendations');
  }

  async getRateLockOpportunities(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/ai/rate-lock-opportunities');
  }

  async getCrossSellOpportunities(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/ai/cross-sell-opportunities');
  }

  // Application Management
  async getApplications(page = 1, limit = 10, filters?: any): Promise<ApiResponse<PaginatedResponse<any>>> {
    return await apiService.get('/broker/applications', {
      page,
      limit,
      ...filters,
    });
  }

  async getApplication(applicationId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/broker/applications/${applicationId}`);
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<ApiResponse<any>> {
    return await apiService.put(`/broker/applications/${applicationId}/status`, {
      status,
      notes,
    });
  }

  async addApplicationNote(applicationId: string, note: string): Promise<ApiResponse<any>> {
    return await apiService.post(`/broker/applications/${applicationId}/notes`, { note });
  }

  // Document Management
  async getApplicationDocuments(applicationId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/broker/applications/${applicationId}/documents`);
  }

  async reviewDocument(documentId: string, status: 'approved' | 'rejected', comments?: string): Promise<ApiResponse<any>> {
    return await apiService.put(`/broker/documents/${documentId}/review`, {
      status,
      comments,
    });
  }

  async requestDocuments(applicationId: string, documentTypes: string[]): Promise<ApiResponse<any>> {
    return await apiService.post(`/broker/applications/${applicationId}/request-documents`, {
      documentTypes,
    });
  }

  // Reports and Analytics
  async getPerformanceReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/reports/performance', {
      startDate,
      endDate,
    });
  }

  async getClientReport(clientId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/broker/reports/client/${clientId}`);
  }

  async getCommissionReport(period = '30d'): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/reports/commission', { period });
  }

  async exportReport(reportType: string, format = 'pdf'): Promise<Blob> {
    const response = await apiService.get(`/broker/reports/${reportType}/export`, {
      format,
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  // Team Management (for senior brokers)
  async getTeamMembers(): Promise<ApiResponse<Broker[]>> {
    return await apiService.get<Broker[]>('/broker/team/members');
  }

  async getTeamPerformance(): Promise<ApiResponse<any[]>> {
    return await apiService.get('/broker/team/performance');
  }

  async assignLead(leadId: string, brokerId: string): Promise<ApiResponse<any>> {
    return await apiService.post('/broker/team/assign-lead', {
      leadId,
      brokerId,
    });
  }

  // Settings and Profile
  async updateProfile(profileData: Partial<Broker>): Promise<ApiResponse<Broker>> {
    return await apiService.put<Broker>('/broker/profile', profileData);
  }

  async updateNotificationSettings(settings: any): Promise<ApiResponse<any>> {
    return await apiService.put('/broker/settings/notifications', settings);
  }

  async getNotificationSettings(): Promise<ApiResponse<any>> {
    return await apiService.get('/broker/settings/notifications');
  }
}

export const brokerService = new BrokerService();
