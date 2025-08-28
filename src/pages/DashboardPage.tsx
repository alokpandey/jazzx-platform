import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Welcome to Your Dashboard"
      description="Track your loan application progress, manage documents, and stay updated with real-time insights from our AI-powered platform."
      icon="🏠"
      showSidebar={true}
      showNotifications={true}
      features={[
        'Application progress tracking',
        'Document management',
        'Real-time status updates',
        'AI-powered insights',
        'Direct broker communication',
        'Market trend analysis'
      ]}
      primaryAction={{
        label: 'Continue Application',
        onClick: () => navigate('/application')
      }}
      secondaryAction={{
        label: 'View Loan Status',
        onClick: () => navigate('/loan-status')
      }}
    />
  );
};

export default DashboardPage;
