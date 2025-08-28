import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const LoanStatusPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Loan Status & Timeline"
      description="Track your loan application progress with detailed timeline, AI insights, and real-time updates from your loan team."
      icon="📊"
      showSidebar={true}
      showNotifications={true}
      features={[
        'Real-time status tracking',
        'Detailed progress timeline',
        'AI-powered insights',
        'Expected completion dates',
        'Next action items',
        'Team communication'
      ]}
      primaryAction={{
        label: 'View Documents',
        onClick: () => navigate('/documents')
      }}
      secondaryAction={{
        label: 'Contact Team',
        onClick: () => navigate('/messages')
      }}
    />
  );
};

export default LoanStatusPage;
