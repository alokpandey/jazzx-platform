import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const ClientManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Client Management"
      description="Manage your client relationships with AI-powered insights, automated workflows, and comprehensive client profiles."
      icon="👥"
      showSidebar={true}
      showSearch={true}
      showNotifications={true}
      features={[
        'AI client scoring & risk assessment',
        'Automated workflow management',
        'Comprehensive client profiles',
        'Communication tracking',
        'Performance analytics',
        'Lead management system'
      ]}
      primaryAction={{
        label: 'Add New Client',
        onClick: () => navigate('/client-management')
      }}
      secondaryAction={{
        label: 'View AI Insights',
        onClick: () => navigate('/ai-insights')
      }}
    />
  );
};

export default ClientManagementPage;
