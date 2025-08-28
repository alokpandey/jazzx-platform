import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import styled from 'styled-components';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type?: NotificationType,
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  max-width: 400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: ${({ theme }) => theme.spacing[4]};
    right: ${({ theme }) => theme.spacing[4]};
    max-width: none;
  }
`;

const NotificationItem = styled.div<{ type: NotificationType }>`
  background: ${({ theme }) => theme.colors.neutral[0]};
  border: 1px solid ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[200];
      case 'error':
        return theme.colors.error[200];
      case 'warning':
        return theme.colors.warning[200];
      case 'info':
      default:
        return theme.colors.primary[200];
    }
  }};
  border-left: 4px solid ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
      default:
        return theme.colors.primary[500];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: slideInUp 0.3s ease-out;
  position: relative;

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const NotificationIcon = styled.div<{ type: NotificationType }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[0]};
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.success[500];
      case 'error':
        return theme.colors.error[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'info':
      default:
        return theme.colors.primary[500];
    }
  }};
  margin-right: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const NotificationMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeights.snug};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neutral[400]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: color ${({ theme }) => theme.transitions.fast};
  margin-left: ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[600]};
  }
`;

const NotificationAction = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: 0;
  text-decoration: underline;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
    default:
      return 'i';
  }
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    options?: {
      title?: string;
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? 5000,
      action: options?.action,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} type={notification.type}>
            <NotificationHeader>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <NotificationIcon type={notification.type}>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationContent>
                  {notification.title && (
                    <NotificationTitle>{notification.title}</NotificationTitle>
                  )}
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  {notification.action && (
                    <NotificationAction onClick={notification.action.onClick}>
                      {notification.action.label}
                    </NotificationAction>
                  )}
                </NotificationContent>
              </div>
              <CloseButton onClick={() => removeNotification(notification.id)}>
                ✕
              </CloseButton>
            </NotificationHeader>
          </NotificationItem>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
