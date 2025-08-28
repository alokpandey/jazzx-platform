import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportData = {
    month: {
      totalVolume: 2450000,
      dealsCompleted: 12,
      averageLoanSize: 204167,
      conversionRate: 68,
      revenue: 49000
    },
    quarter: {
      totalVolume: 7350000,
      dealsCompleted: 36,
      averageLoanSize: 204167,
      conversionRate: 71,
      revenue: 147000
    },
    year: {
      totalVolume: 29400000,
      dealsCompleted: 144,
      averageLoanSize: 204167,
      conversionRate: 69,
      revenue: 588000
    }
  };

  const currentData = reportData[selectedPeriod as keyof typeof reportData];

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
        <NavItem onClick={() => navigate('/pipeline')}>
          📈 Pipeline
        </NavItem>
        <NavItem onClick={() => navigate('/documents')}>
          📄 Documents
        </NavItem>
        <NavItem onClick={() => navigate('/reports')} active>
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
          <Title>Performance Reports</Title>
          <Controls>
            <PeriodSelector>
              <PeriodButton 
                active={selectedPeriod === 'month'} 
                onClick={() => setSelectedPeriod('month')}
              >
                This Month
              </PeriodButton>
              <PeriodButton 
                active={selectedPeriod === 'quarter'} 
                onClick={() => setSelectedPeriod('quarter')}
              >
                This Quarter
              </PeriodButton>
              <PeriodButton 
                active={selectedPeriod === 'year'} 
                onClick={() => setSelectedPeriod('year')}
              >
                This Year
              </PeriodButton>
            </PeriodSelector>
          </Controls>
        </Header>

        <MetricsGrid>
          <MetricCard>
            <MetricIcon>💰</MetricIcon>
            <MetricValue>${currentData.totalVolume.toLocaleString()}</MetricValue>
            <MetricLabel>Total Loan Volume</MetricLabel>
            <MetricChange positive>+15.2% vs last period</MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon>🏠</MetricIcon>
            <MetricValue>{currentData.dealsCompleted}</MetricValue>
            <MetricLabel>Deals Completed</MetricLabel>
            <MetricChange positive>+8 vs last period</MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon>📊</MetricIcon>
            <MetricValue>${currentData.averageLoanSize.toLocaleString()}</MetricValue>
            <MetricLabel>Average Loan Size</MetricLabel>
            <MetricChange>Stable</MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon>🎯</MetricIcon>
            <MetricValue>{currentData.conversionRate}%</MetricValue>
            <MetricLabel>Conversion Rate</MetricLabel>
            <MetricChange positive>+3% vs last period</MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon>💵</MetricIcon>
            <MetricValue>${currentData.revenue.toLocaleString()}</MetricValue>
            <MetricLabel>Commission Revenue</MetricLabel>
            <MetricChange positive>+18.5% vs last period</MetricChange>
          </MetricCard>
        </MetricsGrid>

        <ChartsSection>
          <ChartCard>
            <ChartTitle>📈 Monthly Performance Trend</ChartTitle>
            <ChartPlaceholder>
              <ChartBar height="60%">Jan</ChartBar>
              <ChartBar height="75%">Feb</ChartBar>
              <ChartBar height="45%">Mar</ChartBar>
              <ChartBar height="80%">Apr</ChartBar>
              <ChartBar height="90%">May</ChartBar>
              <ChartBar height="100%">Jun</ChartBar>
            </ChartPlaceholder>
          </ChartCard>

          <ChartCard>
            <ChartTitle>🏆 Top Performing Loan Types</ChartTitle>
            <LoanTypeList>
              <LoanTypeItem>
                <LoanTypeName>Conventional 30-Year</LoanTypeName>
                <LoanTypeBar width="85%">
                  <LoanTypeValue>42 loans</LoanTypeValue>
                </LoanTypeBar>
              </LoanTypeItem>
              <LoanTypeItem>
                <LoanTypeName>FHA 30-Year</LoanTypeName>
                <LoanTypeBar width="65%">
                  <LoanTypeValue>28 loans</LoanTypeValue>
                </LoanTypeBar>
              </LoanTypeItem>
              <LoanTypeItem>
                <LoanTypeName>VA 30-Year</LoanTypeName>
                <LoanTypeBar width="45%">
                  <LoanTypeValue>18 loans</LoanTypeValue>
                </LoanTypeBar>
              </LoanTypeItem>
              <LoanTypeItem>
                <LoanTypeName>Jumbo 30-Year</LoanTypeName>
                <LoanTypeBar width="30%">
                  <LoanTypeValue>12 loans</LoanTypeValue>
                </LoanTypeBar>
              </LoanTypeItem>
            </LoanTypeList>
          </ChartCard>
        </ChartsSection>

        <ActionButtons>
          <ActionButton primary>📊 Export Report</ActionButton>
          <ActionButton>📧 Email Report</ActionButton>
          <ActionButton onClick={() => navigate('/ai-insights')}>🤖 AI Analysis</ActionButton>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const PeriodSelector = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PeriodButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? '#667eea' : '#f0f4ff'};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const MetricIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? '#38a169' : '#718096'};
  font-size: 0.8rem;
  font-weight: 500;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ChartPlaceholder = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  padding: 1rem 0;
`;

const ChartBar = styled.div<{ height: string }>`
  background: linear-gradient(to top, #667eea, #764ba2);
  width: 40px;
  height: ${props => props.height};
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: end;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
`;

const LoanTypeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoanTypeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LoanTypeName = styled.div`
  color: #2d3748;
  font-weight: 500;
  font-size: 0.9rem;
`;

const LoanTypeBar = styled.div<{ width: string }>`
  background: #e2e8f0;
  height: 24px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.width};
    background: linear-gradient(to right, #667eea, #764ba2);
    border-radius: 12px;
  }
`;

const LoanTypeValue = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #2d3748;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 1;
`;

const ActionButtons = styled.div`
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

export default ReportsPage;
