import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const QuoteResultsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Your Personalized Loan Options"
      description="Based on your profile, our AI has found the best loan options from top lenders. Compare rates, terms, and features to find your perfect match."
      icon="🎯"
      features={[
        'AI-matched loan options',
        'Competitive rates comparison',
        'Detailed loan terms',
        'Monthly payment calculator',
        'Broker recommendations',
        'Market insights'
      ]}
      primaryAction={{
        label: 'Start Full Application',
        onClick: () => navigate('/login')
      }}
      secondaryAction={{
        label: 'Save & Continue Later',
        onClick: () => navigate('/login')
      }}
    />
  );
};

export default QuoteResultsPage;
