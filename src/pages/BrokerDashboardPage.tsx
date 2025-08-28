import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const BrokerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Broker Dashboard"
      description="Manage your clients, track pipeline performance, and leverage AI insights to grow your mortgage business with JazzX Pro."
      icon="📊"
      showSidebar={true}
      showSearch={true}
      showNotifications={true}
      features={[
        'Client management system',
        'Pipeline tracking & forecasting',
        'AI-powered client scoring',
        'Performance analytics',
        'Market intelligence',
        'Automated workflow tools'
      ]}
      primaryAction={{
        label: 'Manage Clients',
        onClick: () => navigate('/client-management')
      }}
      secondaryAction={{
        label: 'View AI Insights',
        onClick: () => navigate('/ai-insights')
      }}
    />
  );
};

export default BrokerDashboardPage;
