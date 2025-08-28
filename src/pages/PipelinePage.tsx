import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '@/services/api';

const PipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const response = await apiService.get('/broker/pipeline');
        setPipelineData(response.data);
      } catch (error) {
        console.error('Failed to fetch pipeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
  }, []);

  if (loading) {
    return <LoadingContainer>Loading pipeline...</LoadingContainer>;
  }

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>🏢 Broker Portal</SidebarTitle>
        <NavItem onClick={() => navigate('/broker-dashboard')}>
          📊 Dashboard
        </NavItem>
        <NavItem onClick={() => navigate('/client-management')}>
          👥 Clients
        </NavItem>
        <NavItem onClick={() => navigate('/pipeline')} active>
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
          <Title>Sales Pipeline</Title>
          <Subtitle>Track your deals through every stage</Subtitle>
        </Header>

        <StatsRow>
          <StatCard>
            <StatNumber>${pipelineData?.totalValue?.toLocaleString() || '2,450,000'}</StatNumber>
            <StatLabel>Total Pipeline Value</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{pipelineData?.activeDeals || 8}</StatNumber>
            <StatLabel>Active Deals</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{pipelineData?.closingThisMonth || 3}</StatNumber>
            <StatLabel>Closing This Month</StatLabel>
          </StatCard>
        </StatsRow>

        <PipelineStages>
          {pipelineData?.pipeline?.map((stage: any, index: number) => (
            <StageColumn key={index}>
              <StageHeader>
                <StageName>{stage.stage}</StageName>
                <StageCount>{stage.count} deals</StageCount>
                <StageValue>${stage.value?.toLocaleString()}</StageValue>
              </StageHeader>
              <StageContent>
                {/* Mock deals for each stage */}
                {Array.from({ length: Math.min(stage.count, 3) }, (_, i) => (
                  <DealCard key={i}>
                    <DealTitle>Client Deal #{i + 1}</DealTitle>
                    <DealAmount>${(stage.value / stage.count).toLocaleString()}</DealAmount>
                    <DealDate>Est. Close: {new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</DealDate>
                  </DealCard>
                ))}
                {stage.count > 3 && (
                  <MoreDeals>+{stage.count - 3} more deals</MoreDeals>
                )}
              </StageContent>
            </StageColumn>
          ))}
        </PipelineStages>

        <ActionButtons>
          <ActionButton primary onClick={() => navigate('/client-management')}>
            + Add New Deal
          </ActionButton>
          <ActionButton onClick={() => navigate('/reports')}>
            📊 View Reports
          </ActionButton>
        </ActionButtons>
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

const StatsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
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
`;

const PipelineStages = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const StageColumn = styled.div`
  min-width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StageHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const StageName = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StageCount = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const StageValue = styled.div`
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 700;
`;

const StageContent = styled.div`
  padding: 1rem;
`;

const DealCard = styled.div`
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border-left: 4px solid #667eea;
`;

const DealTitle = styled.div`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DealAmount = styled.div`
  color: #667eea;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const DealDate = styled.div`
  color: #718096;
  font-size: 0.8rem;
`;

const MoreDeals = styled.div`
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  padding: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
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

export default PipelinePage;
