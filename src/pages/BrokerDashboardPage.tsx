import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '@/services/api';

const BrokerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pipelineResponse, clientsResponse] = await Promise.all([
          apiService.get('/broker/pipeline'),
          apiService.get('/broker/clients')
        ]);

        setDashboardData({
          pipeline: pipelineResponse.data,
          clients: (clientsResponse.data as any[])?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingContainer>Loading dashboard...</LoadingContainer>;
  }

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>🏢 Broker Portal</SidebarTitle>
        <NavItem onClick={() => navigate('/broker-dashboard')} active>
          📊 Dashboard
        </NavItem>
        <NavItem onClick={() => navigate('/client-management')}>
          👥 Clients
        </NavItem>
        <NavItem onClick={() => navigate('/pipeline')}>
          📈 Pipeline
        </NavItem>
        <NavItem onClick={() => navigate('/documents')}>
          📄 Documents
        </NavItem>
        <NavItem onClick={() => navigate('/reports')}>
          📋 Reports
        </NavItem>
        <NavItem onClick={() => navigate('/ai-insights')}>
          🤖 AI Insights
        </NavItem>
        <NavItem onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </NavItem>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>Broker Dashboard</Title>
          <Subtitle>Manage your clients and track performance</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatNumber>${dashboardData?.pipeline?.totalValue?.toLocaleString() || '2,450,000'}</StatNumber>
            <StatLabel>Total Pipeline Value</StatLabel>
            <StatChange positive>+12.5% this month</StatChange>
          </StatCard>
          <StatCard>
            <StatNumber>{dashboardData?.pipeline?.activeDeals || 8}</StatNumber>
            <StatLabel>Active Deals</StatLabel>
            <StatChange positive>+3 new this week</StatChange>
          </StatCard>
          <StatCard>
            <StatNumber>{dashboardData?.pipeline?.closingThisMonth || 3}</StatNumber>
            <StatLabel>Closing This Month</StatLabel>
            <StatChange>On track</StatChange>
          </StatCard>
          <StatCard>
            <StatNumber>94%</StatNumber>
            <StatLabel>Client Satisfaction</StatLabel>
            <StatChange positive>+2% improvement</StatChange>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <Section>
            <SectionTitle>🤖 AI Insights</SectionTitle>
            <InsightCard>
              <InsightIcon>💡</InsightIcon>
              <InsightContent>
                <InsightTitle>Market Opportunity</InsightTitle>
                <InsightText>
                  Interest rates are expected to drop 0.25% next quarter.
                  Consider reaching out to refinance prospects.
                </InsightText>
              </InsightContent>
            </InsightCard>
            <InsightCard>
              <InsightIcon>📈</InsightIcon>
              <InsightContent>
                <InsightTitle>Performance Alert</InsightTitle>
                <InsightText>
                  Your conversion rate is 15% above market average.
                  Great work on client engagement!
                </InsightText>
              </InsightContent>
            </InsightCard>
            <InsightCard>
              <InsightIcon>🎯</InsightIcon>
              <InsightContent>
                <InsightTitle>Lead Recommendation</InsightTitle>
                <InsightText>
                  3 warm leads in your area match your ideal client profile.
                  Review in Client Management.
                </InsightText>
              </InsightContent>
            </InsightCard>
          </Section>

          <Section>
            <SectionTitle>👥 Recent Clients</SectionTitle>
            {dashboardData?.clients?.map((client: any, index: number) => (
              <ClientCard key={client.id || index}>
                <ClientInfo>
                  <ClientName>{client.name}</ClientName>
                  <ClientDetails>
                    ${client.loanAmount?.toLocaleString()} • {client.status}
                  </ClientDetails>
                </ClientInfo>
                <ClientStatus status={client.status}>
                  {client.status}
                </ClientStatus>
              </ClientCard>
            ))}
            <ViewAllButton onClick={() => navigate('/client-management')}>
              View All Clients →
            </ViewAllButton>
          </Section>
        </ContentGrid>

        <QuickActions>
          <ActionButton primary onClick={() => navigate('/client-management')}>
            + Add New Client
          </ActionButton>
          <ActionButton onClick={() => navigate('/pipeline')}>
            📈 View Pipeline
          </ActionButton>
          <ActionButton onClick={() => navigate('/ai-insights')}>
            🤖 AI Insights
          </ActionButton>
        </QuickActions>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 0;
`;

const SidebarTitle = styled.h2`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  background: ${props => props.active ? '#f0f4ff' : 'transparent'};
  border-right: ${props => props.active ? '3px solid #667eea' : 'none'};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    background: #f0f4ff;
    color: #667eea;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? '#38a169' : '#718096'};
  font-size: 0.8rem;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const InsightCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const InsightIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.h4`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InsightText = styled.p`
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ClientCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const ClientInfo = styled.div``;

const ClientName = styled.div`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ClientDetails = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const ClientStatus = styled.div<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props =>
    props.status === 'Pre-approved' ? '#c6f6d5' :
    props.status === 'In Review' ? '#fed7d7' :
    '#e2e8f0'
  };
  color: ${props =>
    props.status === 'Pre-approved' ? '#22543d' :
    props.status === 'In Review' ? '#742a2a' :
    '#2d3748'
  };
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f4ff;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.primary ? '#667eea' : 'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  border: ${props => props.primary ? 'none' : '2px solid #667eea'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #718096;
`;

export default BrokerDashboardPage;
