import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [applicationsResponse, aiInsightsResponse] = await Promise.all([
          apiService.get('/loans/applications'),
          apiService.post('/ai/insights', { loanAmount: 500000, creditScore: 750, income: 120000 })
        ]);

        setDashboardData({
          applications: (applicationsResponse.data as any) || [],
          aiInsights: (aiInsightsResponse.data as any)?.insights || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default data if API fails
        setDashboardData({
          applications: [
            {
              id: "app-1",
              status: "In Progress",
              loanAmount: 500000,
              propertyAddress: "123 Main St, Anytown, CA",
              submittedDate: "2024-01-15",
              estimatedCloseDate: "2024-02-15"
            }
          ],
          aiInsights: [
            {
              type: "opportunity",
              title: "Rate Optimization",
              description: "Based on current market conditions, you could save $180/month with a different loan program.",
              confidence: 0.92
            },
            {
              type: "recommendation",
              title: "Document Ready",
              description: "Your credit profile is excellent. Consider uploading income verification to expedite processing.",
              confidence: 0.88
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return <LoadingContainer>Loading your dashboard...</LoadingContainer>;
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>🏠 Borrower Portal</SidebarTitle>
          <LogoutButton onClick={handleLogout}>
            🏠 Home
          </LogoutButton>
        </SidebarHeader>
        <NavItem onClick={() => navigate('/dashboard')} active>
          📊 Dashboard
        </NavItem>
        <NavItem onClick={() => navigate('/application')}>
          📝 Application
        </NavItem>
        <NavItem onClick={() => navigate('/loan-status')}>
          📈 Loan Status
        </NavItem>
        <NavItem onClick={() => navigate('/documents')}>
          📄 Documents
        </NavItem>
        <NavItem onClick={() => navigate('/messages')}>
          💬 Messages
        </NavItem>
        <NavItem onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </NavItem>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>Welcome Back!</Title>
          <Subtitle>Here's your loan application progress and AI insights</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard>
            <StatIcon>🏠</StatIcon>
            <StatNumber>$500,000</StatNumber>
            <StatLabel>Loan Amount</StatLabel>
            <StatStatus>Pre-approved</StatStatus>
          </StatCard>
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatNumber>6.25%</StatNumber>
            <StatLabel>Interest Rate</StatLabel>
            <StatStatus>Locked</StatStatus>
          </StatCard>
          <StatCard>
            <StatIcon>📅</StatIcon>
            <StatNumber>Feb 15</StatNumber>
            <StatLabel>Est. Close Date</StatLabel>
            <StatStatus>On Track</StatStatus>
          </StatCard>
          <StatCard>
            <StatIcon>✅</StatIcon>
            <StatNumber>85%</StatNumber>
            <StatLabel>Progress</StatLabel>
            <StatStatus>Almost Done</StatStatus>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <Section>
            <SectionTitle>🤖 AI Insights & Recommendations</SectionTitle>
            {dashboardData?.aiInsights?.map((insight: any, index: number) => (
              <InsightCard key={index}>
                <InsightIcon>
                  {insight.type === 'opportunity' ? '💡' :
                   insight.type === 'recommendation' ? '🎯' : '📊'}
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <InsightText>{insight.description}</InsightText>
                  <InsightConfidence>
                    AI Confidence: {Math.round(insight.confidence * 100)}%
                  </InsightConfidence>
                </InsightContent>
              </InsightCard>
            ))}
            <ViewMoreButton onClick={() => navigate('/ai-insights')}>
              View More AI Insights →
            </ViewMoreButton>
          </Section>

          <Section>
            <SectionTitle>📋 Application Status</SectionTitle>
            <ProgressBar>
              <ProgressFill width="85%" />
              <ProgressText>85% Complete</ProgressText>
            </ProgressBar>

            <StatusSteps>
              <StatusStep completed>
                <StepIcon>✅</StepIcon>
                <StepText>Application Submitted</StepText>
              </StatusStep>
              <StatusStep completed>
                <StepIcon>✅</StepIcon>
                <StepText>Credit Check Complete</StepText>
              </StatusStep>
              <StatusStep completed>
                <StepIcon>✅</StepIcon>
                <StepText>Income Verified</StepText>
              </StatusStep>
              <StatusStep active>
                <StepIcon>🔄</StepIcon>
                <StepText>Underwriting Review</StepText>
              </StatusStep>
              <StatusStep>
                <StepIcon>⏳</StepIcon>
                <StepText>Final Approval</StepText>
              </StatusStep>
            </StatusSteps>

            <NextSteps>
              <NextStepTitle>Next Steps:</NextStepTitle>
              <NextStepItem>📄 Upload property appraisal (due in 3 days)</NextStepItem>
              <NextStepItem>📞 Schedule closing appointment</NextStepItem>
            </NextSteps>
          </Section>
        </ContentGrid>

        <QuickActions>
          <ActionButton primary onClick={() => navigate('/application')}>
            Continue Application
          </ActionButton>
          <ActionButton onClick={() => navigate('/documents')}>
            📄 Upload Documents
          </ActionButton>
          <ActionButton onClick={() => navigate('/messages')}>
            💬 Message Broker
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

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h2`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #edf2f7;
    color: #2d3748;
  }
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StatStatus = styled.div`
  color: #38a169;
  font-size: 0.8rem;
  font-weight: 600;
  background: #c6f6d5;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
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
  margin-bottom: 1.5rem;
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
  margin-bottom: 0.5rem;
`;

const InsightConfidence = styled.div`
  color: #667eea;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ViewMoreButton = styled.button`
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

const ProgressBar = styled.div`
  position: relative;
  background: #e2e8f0;
  height: 24px;
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string }>`
  background: linear-gradient(to right, #667eea, #764ba2);
  height: 100%;
  width: ${props => props.width};
  border-radius: 12px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const StatusSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatusStep = styled.div<{ completed?: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: ${props => props.completed || props.active ? 1 : 0.5};
`;

const StepIcon = styled.div`
  font-size: 1.2rem;
`;

const StepText = styled.div<{ completed?: boolean; active?: boolean }>`
  color: ${props => props.completed ? '#38a169' : props.active ? '#667eea' : '#718096'};
  font-weight: ${props => props.active ? '600' : '500'};
`;

const NextSteps = styled.div`
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const NextStepTitle = styled.h4`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const NextStepItem = styled.div`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
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

export default DashboardPage;
