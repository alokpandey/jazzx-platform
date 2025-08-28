import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Messages & Communication"
      description="Stay connected with your loan team through secure messaging, file sharing, and real-time notifications."
      icon="💬"
      showSidebar={true}
      showNotifications={true}
      features={[
        'Real-time messaging',
        'Secure file sharing',
        'Team communication',
        'AI smart replies',
        'Message history',
        'Mobile notifications'
      ]}
      primaryAction={{
        label: 'Start Conversation',
        onClick: () => navigate('/messages')
      }}
      secondaryAction={{
        label: 'View Team',
        onClick: () => navigate('/loan-status')
      }}
    />
  );
};

export default MessagesPage;
