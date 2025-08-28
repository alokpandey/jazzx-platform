import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Account Settings"
      description="Manage your account preferences, security settings, and notification preferences."
      icon="⚙️"
      showSidebar={true}
      showNotifications={true}
      features={[
        'Profile management',
        'Security settings',
        'Notification preferences',
        'Privacy controls',
        'AI assistant settings',
        'Account management'
      ]}
      primaryAction={{
        label: 'Update Profile',
        onClick: () => navigate('/settings')
      }}
      secondaryAction={{
        label: 'Security Settings',
        onClick: () => navigate('/settings')
      }}
    />
  );
};

export default SettingsPage;
