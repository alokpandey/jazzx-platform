import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const AIInsightsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="AI Insights Dashboard"
      description="Leverage advanced AI analytics to optimize your mortgage business with predictive insights, market intelligence, and performance recommendations."
      icon="🤖"
      showSidebar={true}
      showSearch={true}
      showNotifications={true}
      features={[
        'Predictive analytics & forecasting',
        'Market intelligence & trends',
        'Client behavior analysis',
        'Performance optimization',
        'Risk assessment tools',
        'Automated recommendations'
      ]}
      primaryAction={{
        label: 'View Recommendations',
        onClick: () => navigate('/ai-insights')
      }}
      secondaryAction={{
        label: 'Generate Report',
        onClick: () => navigate('/ai-insights')
      }}
    />
  );
};

export default AIInsightsPage;
