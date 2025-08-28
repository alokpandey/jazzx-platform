import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockUsers, delay, mockApiResponse } from '../mockData';
import { LoginRequest, User } from '@/types';

class AuthMicroservice {
  private mock: MockAdapter;
  private baseURL = '/api/auth';

  constructor() {
    this.mock = new MockAdapter(axios, { delayResponse: 800 });
    this.setupRoutes();
  }

  private setupRoutes() {
    // Authentication endpoints
    this.mock.onPost(`${this.baseURL}/login`).reply(async (config) => {
      await delay(1500);
      const { email, password, userType } = JSON.parse(config.data) as LoginRequest;
      
      const user = mockUsers.find(u => u.email === email && u.userType === userType);
      
      if (user && (password === 'Demo123!' || password === 'Broker123!')) {
        return [200, mockApiResponse({
          user,
          token: `auth-jwt-${user.id}-${Date.now()}`,
          refreshToken: `auth-refresh-${user.id}-${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer'
        })];
      }
      
      return [401, mockApiResponse(null, false, 'Invalid credentials')];
    });

    this.mock.onPost(`${this.baseURL}/register`).reply(async (config) => {
      await delay(2000);
      const userData = JSON.parse(config.data);
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return [409, mockApiResponse(null, false, 'User already exists')];
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      
      return [201, mockApiResponse({
        user: newUser,
        token: `auth-jwt-${newUser.id}-${Date.now()}`,
        refreshToken: `auth-refresh-${newUser.id}-${Date.now()}`,
        expiresIn: 3600,
        tokenType: 'Bearer'
      })];
    });

    this.mock.onPost(`${this.baseURL}/logout`).reply(async () => {
      await delay(500);
      return [200, mockApiResponse({ message: 'Logged out successfully' })];
    });

    this.mock.onPost(`${this.baseURL}/refresh`).reply(async (config) => {
      await delay(800);
      const { refreshToken } = JSON.parse(config.data);
      
      if (refreshToken && refreshToken.startsWith('auth-refresh-')) {
        const userId = refreshToken.split('-')[2];
        return [200, mockApiResponse({
          token: `auth-jwt-${userId}-${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer'
        })];
      }
      
      return [401, mockApiResponse(null, false, 'Invalid refresh token')];
    });

    this.mock.onGet(`${this.baseURL}/me`).reply(async (config) => {
      await delay(600);
      const authHeader = config.headers?.Authorization;
      
      if (authHeader && authHeader.startsWith('Bearer auth-jwt-')) {
        const userId = authHeader.split('-')[2];
        const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
        return [200, mockApiResponse(user)];
      }
      
      return [401, mockApiResponse(null, false, 'Unauthorized')];
    });

    this.mock.onPut(`${this.baseURL}/profile`).reply(async (config) => {
      await delay(1000);
      const updates = JSON.parse(config.data);
      const authHeader = config.headers?.Authorization;
      
      if (authHeader && authHeader.startsWith('Bearer auth-jwt-')) {
        const userId = authHeader.split('-')[2];
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
          mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          return [200, mockApiResponse(mockUsers[userIndex])];
        }
      }
      
      return [401, mockApiResponse(null, false, 'Unauthorized')];
    });

    this.mock.onPost(`${this.baseURL}/change-password`).reply(async (config) => {
      await delay(1200);
      const { currentPassword, newPassword } = JSON.parse(config.data);
      
      // Simulate password validation
      if (currentPassword === 'Demo123!' || currentPassword === 'Broker123!') {
        if (newPassword.length >= 8) {
          return [200, mockApiResponse({ message: 'Password changed successfully' })];
        }
        return [400, mockApiResponse(null, false, 'Password must be at least 8 characters')];
      }
      
      return [400, mockApiResponse(null, false, 'Current password is incorrect')];
    });

    this.mock.onPost(`${this.baseURL}/forgot-password`).reply(async (config) => {
      await delay(1500);
      const { email } = JSON.parse(config.data);
      
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        return [200, mockApiResponse({ 
          message: 'Password reset email sent',
          resetToken: `reset-${user.id}-${Date.now()}`
        })];
      }
      
      return [404, mockApiResponse(null, false, 'User not found')];
    });

    this.mock.onPost(`${this.baseURL}/reset-password`).reply(async (config) => {
      await delay(1000);
      const { token, newPassword } = JSON.parse(config.data);
      
      if (token.startsWith('reset-') && newPassword.length >= 8) {
        return [200, mockApiResponse({ message: 'Password reset successfully' })];
      }
      
      return [400, mockApiResponse(null, false, 'Invalid reset token or password')];
    });

    // Social authentication
    this.mock.onPost(`${this.baseURL}/google`).reply(async () => {
      await delay(2000);
      const user = mockUsers[0]; // Demo user
      return [200, mockApiResponse({
        user,
        token: `auth-jwt-${user.id}-${Date.now()}`,
        refreshToken: `auth-refresh-${user.id}-${Date.now()}`,
        expiresIn: 3600,
        tokenType: 'Bearer',
        provider: 'google'
      })];
    });

    this.mock.onPost(`${this.baseURL}/microsoft`).reply(async () => {
      await delay(2000);
      const user = mockUsers[0];
      return [200, mockApiResponse({
        user,
        token: `auth-jwt-${user.id}-${Date.now()}`,
        refreshToken: `auth-refresh-${user.id}-${Date.now()}`,
        expiresIn: 3600,
        tokenType: 'Bearer',
        provider: 'microsoft'
      })];
    });

    this.mock.onPost(`${this.baseURL}/apple`).reply(async () => {
      await delay(2000);
      const user = mockUsers[0];
      return [200, mockApiResponse({
        user,
        token: `auth-jwt-${user.id}-${Date.now()}`,
        refreshToken: `auth-refresh-${user.id}-${Date.now()}`,
        expiresIn: 3600,
        tokenType: 'Bearer',
        provider: 'apple'
      })];
    });

    // Health check
    this.mock.onGet(`${this.baseURL}/health`).reply(200, {
      service: 'auth-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  public reset() {
    this.mock.reset();
  }

  public restore() {
    this.mock.restore();
  }
}

export const authMicroservice = new AuthMicroservice();
