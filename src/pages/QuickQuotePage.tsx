import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const QuickQuotePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Quick Quote"
      description="Get personalized loan options in 30 seconds with our AI-powered quote engine. No impact to your credit score."
      icon="⚡"
      features={[
        'AI-powered loan matching',
        'Real-time rate calculations',
        'No credit score impact',
        'Instant pre-qualification',
        'Multiple lender options',
        'Personalized recommendations'
      ]}
      primaryAction={{
        label: 'Start Quick Quote',
        onClick: () => navigate('/quote-results')
      }}
      secondaryAction={{
        label: 'Full Application',
        onClick: () => navigate('/login')
      }}
    />
  );
};

export default QuickQuotePage;
