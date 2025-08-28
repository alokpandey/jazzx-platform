import { apiService } from './api';
import { User, ApiResponse, LoginRequest, RegisterRequest } from '@/types';

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      localStorage.setItem('jazzx-token', response.data.token);
      localStorage.setItem('jazzx-refresh-token', response.data.refreshToken);
      localStorage.setItem('jazzx-user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData);
    
    if (response.success && response.data) {
      localStorage.setItem('jazzx-token', response.data.token);
      localStorage.setItem('jazzx-refresh-token', response.data.refreshToken);
      localStorage.setItem('jazzx-user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jazzx-token');
      localStorage.removeItem('jazzx-refresh-token');
      localStorage.removeItem('jazzx-user');
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('jazzx-refresh-token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      localStorage.setItem('jazzx-token', response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiService.get<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return await apiService.put<User>('/auth/profile', userData);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return await apiService.put<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  // Social authentication methods
  async loginWithGoogle(token: string): Promise<ApiResponse<LoginResponse>> {
    return await apiService.post<LoginResponse>('/auth/google', { token });
  }

  async loginWithMicrosoft(token: string): Promise<ApiResponse<LoginResponse>> {
    return await apiService.post<LoginResponse>('/auth/microsoft', { token });
  }

  async loginWithApple(token: string): Promise<ApiResponse<LoginResponse>> {
    return await apiService.post<LoginResponse>('/auth/apple', { token });
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = localStorage.getItem('jazzx-token');
    const user = localStorage.getItem('jazzx-user');
    return !!(token && user);
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('jazzx-user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('jazzx-token');
  }
}

export const authService = new AuthService();
