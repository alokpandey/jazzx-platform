import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeType?: 'default' | 'success' | 'warning' | 'error' | 'new';
}

const borrowerNavItems: SidebarItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/application', label: 'My Application', icon: '📄', badge: 'In Progress', badgeType: 'warning' },
  { path: '/loan-status', label: 'Loan Status', icon: '📊' },
  { path: '/documents', label: 'Documents', icon: '📁', badge: 3, badgeType: 'error' },
  { path: '/messages', label: 'Messages', icon: '💬', badge: 2, badgeType: 'default' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const brokerNavItems: SidebarItem[] = [
  { path: '/broker-dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/client-management', label: 'Clients', icon: '👥', badge: 12, badgeType: 'default' },
  { path: '/broker-applications', label: 'Applications', icon: '📄', badge: 8, badgeType: 'default' },
  { path: '/broker-pipeline', label: 'Pipeline', icon: '📈' },
  { path: '/broker-documents', label: 'Documents', icon: '📁' },
  { path: '/broker-reports', label: 'Reports', icon: '📊' },
  { path: '/ai-insights', label: 'AI Insights', icon: '🤖', badge: 'NEW', badgeType: 'new' },
];

const SidebarContainer = styled.nav<{ userType: 'borrower' | 'broker' }>`
  width: 240px;
  background-color: ${({ theme, userType }) => 
    userType === 'broker' ? theme.colors.neutral[800] : theme.colors.primary[500]
  };
  padding: ${({ theme }) => theme.spacing[6]} 0;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 200px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavSection = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const NavItem = styled(Link)<{ isActive: boolean; userType: 'borrower' | 'broker' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme, userType, isActive }) => {
    if (isActive) {
      return userType === 'broker' ? theme.colors.neutral[0] : theme.colors.neutral[0];
    }
    return userType === 'broker' ? theme.colors.neutral[300] : theme.colors.primary[100];
  }};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme, isActive }) => 
    isActive ? theme.fontWeights.semibold : theme.fontWeights.medium
  };
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  background-color: ${({ theme, userType, isActive }) => {
    if (isActive) {
      return userType === 'broker' 
        ? theme.colors.neutral[700] 
        : theme.colors.primary[600];
    }
    return 'transparent';
  }};
  
  &:hover {
    background-color: ${({ theme, userType, isActive }) => {
      if (isActive) {
        return userType === 'broker' 
          ? theme.colors.neutral[700] 
          : theme.colors.primary[600];
      }
      return userType === 'broker' 
        ? theme.colors.neutral[700] 
        : theme.colors.primary[400];
    }};
    color: ${({ theme }) => theme.colors.neutral[0]};
    text-decoration: none;
  }
`;

const NavIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  flex: 1;
`;

const NavBadge = styled.span<{ badgeType: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ theme, badgeType }) => {
    switch (badgeType) {
      case 'success':
        return `
          background-color: ${theme.colors.success[500]};
          color: ${theme.colors.neutral[0]};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning[500]};
          color: ${theme.colors.neutral[0]};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error[500]};
          color: ${theme.colors.neutral[0]};
        `;
      case 'new':
        return `
          background-color: ${theme.colors.primary[500]};
          color: ${theme.colors.neutral[0]};
          animation: pulse 2s infinite;
        `;
      case 'default':
      default:
        return `
          background-color: ${theme.colors.neutral[600]};
          color: ${theme.colors.neutral[0]};
        `;
    }
  }}
`;

const SidebarHeader = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SidebarTitle = styled.h3`
  color: ${({ theme }) => theme.colors.neutral[0]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const MobileSidebar = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  width: 240px;
  height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.neutral[800]};
  transform: translateX(${({ isOpen }) => isOpen ? '0' : '-100%'});
  transition: transform ${({ theme }) => theme.transitions.base};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  overflow-y: auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all ${({ theme }) => theme.transitions.base};
  z-index: ${({ theme }) => theme.zIndex.overlay - 1};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen = false, 
  onMobileClose 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const navItems = user.userType === 'broker' ? brokerNavItems : borrowerNavItems;
  const sidebarTitle = user.userType === 'broker' ? 'Broker Portal' : 'My Account';

  const SidebarContent = (
    <>
      <SidebarHeader>
        <SidebarTitle>{sidebarTitle}</SidebarTitle>
      </SidebarHeader>
      <NavSection>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            isActive={location.pathname === item.path}
            userType={user.userType}
            onClick={onMobileClose}
          >
            <NavIcon>{item.icon}</NavIcon>
            <NavText>{item.label}</NavText>
            {item.badge && (
              <NavBadge badgeType={item.badgeType || 'default'}>
                {item.badge}
              </NavBadge>
            )}
          </NavItem>
        ))}
      </NavSection>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <SidebarContainer userType={user.userType}>
        {SidebarContent}
      </SidebarContainer>
      
      {/* Mobile Sidebar */}
      <MobileOverlay isOpen={isMobileOpen} onClick={onMobileClose} />
      <MobileSidebar isOpen={isMobileOpen}>
        {SidebarContent}
      </MobileSidebar>
    </>
  );
};

export default Sidebar;
