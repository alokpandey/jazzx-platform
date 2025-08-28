import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { delay, mockApiResponse, mockPaginatedResponse } from '../mockData';

class NotificationMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/notifications';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 500 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // Get notifications
    this.mock.onGet(`${this.baseURL}`).reply(async (config) => {
      await delay(800);
      const { page = 1, limit = 20, type, status, userId } = config.params || {};
      
      const notifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'application_update',
          title: 'Application Status Update',
          message: 'Your loan application has moved to underwriting stage',
          priority: 'medium',
          status: 'unread',
          actionUrl: '/loan-status',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: {
            applicationId: 'app-123',
            previousStatus: 'documentation',
            newStatus: 'underwriting'
          }
        },
        {
          id: 'notif-2',
          userId: 'user-1',
          type: 'document_required',
          title: 'Document Upload Required',
          message: 'Please upload your recent bank statements to continue processing',
          priority: 'high',
          status: 'unread',
          actionUrl: '/documents',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          metadata: {
            documentType: 'bank_statement',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: 'notif-3',
          userId: 'user-1',
          type: 'rate_alert',
          title: 'Rate Lock Opportunity',
          message: 'Interest rates have dropped 0.125%. Consider locking your rate now.',
          priority: 'medium',
          status: 'read',
          actionUrl: '/quote-results',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            currentRate: 6.125,
            previousRate: 6.25,
            savingsAmount: 18500
          }
        },
        {
          id: 'notif-4',
          userId: 'broker-1',
          type: 'client_action',
          title: 'Client Action Required',
          message: 'John Smith needs rate lock extension approval',
          priority: 'urgent',
          status: 'unread',
          actionUrl: '/client-management/client-1',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          metadata: {
            clientId: 'client-1',
            actionType: 'rate_lock_extension',
            expirationDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: 'notif-5',
          userId: 'broker-1',
          type: 'ai_insight',
          title: 'AI Recommendation',
          message: 'High-value prospect identified: Maria Garcia (Score: 94)',
          priority: 'medium',
          status: 'unread',
          actionUrl: '/ai-insights',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: {
            clientId: 'client-2',
            aiScore: 94,
            recommendationType: 'high_value_prospect'
          }
        }
      ];
      
      let filteredNotifications = notifications;
      
      if (type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === type);
      }
      
      if (status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === status);
      }
      
      if (userId) {
        filteredNotifications = filteredNotifications.filter(n => n.userId === userId);
      }
      
      return [200, mockApiResponse(mockPaginatedResponse(filteredNotifications, page, limit))];
    });

    // Mark notification as read
    this.mock.onPut(/\/api\/notifications\/\w+\/read/).reply(async (config) => {
      await delay(400);
      const notificationId = config.url?.split('/').slice(-2)[0];
      
      return [200, mockApiResponse({
        notificationId,
        status: 'read',
        readAt: new Date().toISOString()
      })];
    });

    // Mark all notifications as read
    this.mock.onPut(`${this.baseURL}/read-all`).reply(async () => {
      await delay(600);
      return [200, mockApiResponse({
        message: 'All notifications marked as read',
        updatedCount: 5,
        updatedAt: new Date().toISOString()
      })];
    });

    // Delete notification
    this.mock.onDelete(/\/api\/notifications\/\w+/).reply(async () => {
      await delay(500);
      return [200, mockApiResponse({
        message: 'Notification deleted successfully',
        deletedAt: new Date().toISOString()
      })];
    });

    // Send notification (internal API)
    this.mock.onPost(`${this.baseURL}/send`).reply(async (config) => {
      await delay(1000);
      const notificationData = JSON.parse(config.data);
      
      const newNotification = {
        id: `notif-${Date.now()}`,
        ...notificationData,
        status: 'unread',
        createdAt: new Date().toISOString(),
        deliveryStatus: 'delivered',
        channels: ['in_app', 'email', 'sms'].filter(() => Math.random() > 0.3)
      };
      
      return [200, mockApiResponse(newNotification)];
    });

    // Bulk send notifications
    this.mock.onPost(`${this.baseURL}/send-bulk`).reply(async (config) => {
      await delay(2000);
      const { recipients } = JSON.parse(config.data);
      
      const results = recipients.map((userId: string) => ({
        userId,
        notificationId: `notif-${Date.now()}-${userId}`,
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      }));
      
      return [200, mockApiResponse({
        batchId: `batch-${Date.now()}`,
        results,
        summary: {
          total: recipients.length,
          delivered: results.length,
          failed: 0
        }
      })];
    });

    // Get notification preferences
    this.mock.onGet(`${this.baseURL}/preferences`).reply(async (config) => {
      await delay(600);
      const { userId } = config.params || {};
      
      return [200, mockApiResponse({
        userId,
        preferences: {
          email: {
            enabled: true,
            types: ['application_update', 'document_required', 'rate_alert'],
            frequency: 'immediate'
          },
          sms: {
            enabled: true,
            types: ['urgent', 'rate_alert'],
            frequency: 'immediate'
          },
          push: {
            enabled: true,
            types: ['application_update', 'document_required', 'rate_alert', 'ai_insight'],
            frequency: 'immediate'
          },
          inApp: {
            enabled: true,
            types: ['all'],
            frequency: 'immediate'
          }
        },
        updatedAt: new Date().toISOString()
      })];
    });

    // Update notification preferences
    this.mock.onPut(`${this.baseURL}/preferences`).reply(async (config) => {
      await delay(800);
      const preferences = JSON.parse(config.data);
      
      return [200, mockApiResponse({
        ...preferences,
        updatedAt: new Date().toISOString(),
        message: 'Notification preferences updated successfully'
      })];
    });

    // Get notification templates
    this.mock.onGet(`${this.baseURL}/templates`).reply(async () => {
      await delay(500);
      return [200, mockApiResponse([
        {
          id: 'template-app-update',
          name: 'Application Update',
          type: 'application_update',
          subject: 'Your loan application status has been updated',
          body: 'Your application {{applicationId}} has moved to {{newStatus}} stage.',
          channels: ['email', 'sms', 'push'],
          variables: ['applicationId', 'newStatus', 'estimatedCompletion']
        },
        {
          id: 'template-doc-required',
          name: 'Document Required',
          type: 'document_required',
          subject: 'Document upload required for your loan application',
          body: 'Please upload {{documentType}} to continue processing your application.',
          channels: ['email', 'sms', 'push'],
          variables: ['documentType', 'dueDate', 'applicationId']
        },
        {
          id: 'template-rate-alert',
          name: 'Rate Alert',
          type: 'rate_alert',
          subject: 'Interest rate opportunity available',
          body: 'Rates have {{changeDirection}} by {{changeAmount}}%. {{actionRecommendation}}',
          channels: ['email', 'push'],
          variables: ['changeDirection', 'changeAmount', 'actionRecommendation']
        }
      ])];
    });

    // Get notification statistics
    this.mock.onGet(`${this.baseURL}/stats`).reply(async (config) => {
      await delay(1000);
      const { period = '30d', userId } = config.params || {};
      
      return [200, mockApiResponse({
        period,
        userId,
        stats: {
          total: 127,
          unread: 8,
          byType: {
            application_update: 45,
            document_required: 32,
            rate_alert: 28,
            ai_insight: 15,
            client_action: 7
          },
          byPriority: {
            urgent: 12,
            high: 38,
            medium: 65,
            low: 12
          },
          deliveryStats: {
            email: { sent: 127, delivered: 125, opened: 89, clicked: 34 },
            sms: { sent: 45, delivered: 44, clicked: 12 },
            push: { sent: 127, delivered: 120, opened: 78 },
            inApp: { sent: 127, delivered: 127, read: 119 }
          }
        },
        generatedAt: new Date().toISOString()
      })];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'notification-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      dependencies: {
        'email-provider': 'healthy',
        'sms-provider': 'healthy',
        'push-service': 'healthy',
        'template-engine': 'healthy'
      },
      metrics: {
        notificationsSent: 15847,
        deliveryRate: '98.5%',
        avgDeliveryTime: '1.2s',
        unsubscribeRate: '0.8%'
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

export const notificationMicroservice = new NotificationMicroservice();
