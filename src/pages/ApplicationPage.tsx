import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Loan Application"
      description="Complete your mortgage application with AI-powered guidance. Our intelligent form adapts to your responses and provides real-time validation."
      icon="📄"
      showSidebar={true}
      showNotifications={true}
      features={[
        'AI-guided application process',
        'Real-time form validation',
        'Smart document requests',
        'Progress auto-save',
        'Instant pre-qualification',
        'Personalized recommendations'
      ]}
      primaryAction={{
        label: 'Continue Application',
        onClick: () => navigate('/documents')
      }}
      secondaryAction={{
        label: 'Save & Continue Later',
        onClick: () => navigate('/dashboard')
      }}
    />
  );
};

export default ApplicationPage;
