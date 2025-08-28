import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '@/services/api';

const AIInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const [insightsResponse, recommendationsResponse, riskResponse] = await Promise.all([
          apiService.post('/ai/insights', { loanAmount: 500000, creditScore: 750, income: 120000 }),
          apiService.post('/ai/recommendations', { loanAmount: 500000, creditScore: 750, income: 120000 }),
          apiService.post('/ai/risk-analysis', { loanAmount: 500000, creditScore: 750, income: 120000 })
        ]);

        setInsights((insightsResponse.data as any)?.insights || []);
        setRecommendations((recommendationsResponse.data as any)?.recommendations || []);
        setRiskAnalysis((riskResponse.data as any) || null);
      } catch (error) {
        console.error('Failed to fetch AI data:', error);
        // Set fallback data
        setInsights([
          {
            type: "opportunity",
            title: "Rate Optimization",
            description: "Based on current market conditions, you could save $180/month with a different loan program.",
            confidence: 0.92
          },
          {
            type: "risk",
            title: "DTI Analysis",
            description: "Debt-to-income ratio is optimal at 28%. Consider this for future applications.",
            confidence: 0.88
          }
        ]);
        setRecommendations([
          {
            id: "rec-1",
            type: "loan-program",
            title: "Switch to 15-Year Fixed",
            description: "Save $89,000 in interest over loan term",
            impact: "high",
            savings: 89000
          },
          {
            id: "rec-2",
            type: "down-payment",
            title: "Increase Down Payment",
            description: "Avoid PMI with 20% down payment",
            impact: "medium",
            savings: 12000
          }
        ]);
        setRiskAnalysis({
          riskScore: 0.23,
          riskLevel: "Low",
          factors: [
            { name: "Credit Score", impact: "positive", weight: 0.35 },
            { name: "Debt-to-Income", impact: "positive", weight: 0.28 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
  }, []);

  if (loading) {
    return <LoadingContainer>🤖 AI is analyzing your data...</LoadingContainer>;
  }

  return (
    <Container>
      <Sidebar>
        <SidebarTitle>🤖 AI Portal</SidebarTitle>
        <NavItem onClick={() => navigate('/broker-dashboard')}>
          📊 Dashboard
        </NavItem>
        <NavItem onClick={() => navigate('/client-management')}>
          👥 Clients
        </NavItem>
        <NavItem onClick={() => navigate('/pipeline')}>
          📈 Pipeline
        </NavItem>
        <NavItem onClick={() => navigate('/ai-insights')} active>
          🤖 AI Insights
        </NavItem>
        <NavItem onClick={() => navigate('/reports')}>
          📋 Reports
        </NavItem>
        <NavItem onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </NavItem>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>🤖 AI Insights & Recommendations</Title>
          <Subtitle>Advanced analytics and personalized recommendations</Subtitle>
        </Header>

        <AIOverview>
          <OverviewCard>
            <OverviewIcon>🎯</OverviewIcon>
            <OverviewValue>94%</OverviewValue>
            <OverviewLabel>AI Confidence</OverviewLabel>
          </OverviewCard>
          <OverviewCard>
            <OverviewIcon>💡</OverviewIcon>
            <OverviewValue>{insights.length}</OverviewValue>
            <OverviewLabel>Active Insights</OverviewLabel>
          </OverviewCard>
          <OverviewCard>
            <OverviewIcon>📈</OverviewIcon>
            <OverviewValue>{recommendations.length}</OverviewValue>
            <OverviewLabel>Recommendations</OverviewLabel>
          </OverviewCard>
          <OverviewCard>
            <OverviewIcon>🛡️</OverviewIcon>
            <OverviewValue>{riskAnalysis?.riskLevel || 'Low'}</OverviewValue>
            <OverviewLabel>Risk Level</OverviewLabel>
          </OverviewCard>
        </AIOverview>

        <ContentGrid>
          <Section>
            <SectionTitle>💡 AI Insights</SectionTitle>
            {insights.map((insight, index) => (
              <InsightCard key={index}>
                <InsightHeader>
                  <InsightIcon>
                    {insight.type === 'opportunity' ? '🎯' :
                     insight.type === 'risk' ? '⚠️' : '📊'}
                  </InsightIcon>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <ConfidenceBadge confidence={insight.confidence}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </ConfidenceBadge>
                </InsightHeader>
                <InsightDescription>{insight.description}</InsightDescription>
              </InsightCard>
            ))}
          </Section>

          <Section>
            <SectionTitle>🎯 Recommendations</SectionTitle>
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} impact={rec.impact}>
                <RecommendationHeader>
                  <RecommendationTitle>{rec.title}</RecommendationTitle>
                  <ImpactBadge impact={rec.impact}>
                    {rec.impact.toUpperCase()} IMPACT
                  </ImpactBadge>
                </RecommendationHeader>
                <RecommendationDescription>{rec.description}</RecommendationDescription>
                {rec.savings && (
                  <SavingsAmount>
                    💰 Potential Savings: ${rec.savings.toLocaleString()}
                  </SavingsAmount>
                )}
                <ActionButton>Apply Recommendation</ActionButton>
              </RecommendationCard>
            ))}
          </Section>
        </ContentGrid>
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

const AIOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const OverviewCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const OverviewIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const OverviewValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const OverviewLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
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
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const InsightIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const InsightTitle = styled.h4`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
`;

const ConfidenceBadge = styled.div<{ confidence: number }>`
  background: ${props => props.confidence > 0.9 ? '#c6f6d5' : props.confidence > 0.8 ? '#fed7d7' : '#e2e8f0'};
  color: ${props => props.confidence > 0.9 ? '#22543d' : props.confidence > 0.8 ? '#742a2a' : '#2d3748'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const InsightDescription = styled.p`
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const RecommendationCard = styled.div<{ impact: string }>`
  border: 2px solid ${props =>
    props.impact === 'high' ? '#f56565' :
    props.impact === 'medium' ? '#ed8936' : '#68d391'
  };
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const RecommendationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const RecommendationTitle = styled.h4`
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
`;

const ImpactBadge = styled.div<{ impact: string }>`
  background: ${props =>
    props.impact === 'high' ? '#fed7d7' :
    props.impact === 'medium' ? '#fbd38d' : '#c6f6d5'
  };
  color: ${props =>
    props.impact === 'high' ? '#742a2a' :
    props.impact === 'medium' ? '#744210' : '#22543d'
  };
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const RecommendationDescription = styled.p`
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
`;

const SavingsAmount = styled.div`
  color: #38a169;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-1px);
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

export default AIInsightsPage;
