import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  min-height: calc(100vh - 64px);
  overflow-x: hidden;
`;

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = false,
  showSearch = false,
  showNotifications = false
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <Header 
        showSearch={showSearch} 
        showNotifications={showNotifications}
      />
      <MainContainer>
        {showSidebar && (
          <Sidebar 
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <ContentArea>
          <PageContainer>
            {children}
          </PageContainer>
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
