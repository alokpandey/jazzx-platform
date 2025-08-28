import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Button';

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const PlaceholderIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['6xl']};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PlaceholderTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PlaceholderDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[600]};
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 800px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
  features?: string[];
  showSidebar?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon,
  features = [],
  showSidebar = false,
  showSearch = false,
  showNotifications = false,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Layout 
      showSidebar={showSidebar}
      showSearch={showSearch}
      showNotifications={showNotifications}
    >
      <PlaceholderContainer>
        <PlaceholderIcon>{icon}</PlaceholderIcon>
        <PlaceholderTitle>{title}</PlaceholderTitle>
        <PlaceholderDescription>{description}</PlaceholderDescription>
        
        {features.length > 0 && (
          <FeaturesList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <span>✨</span>
                <span>{feature}</span>
              </FeatureItem>
            ))}
          </FeaturesList>
        )}
        
        <ActionButtons>
          {primaryAction && (
            <Button 
              size="lg" 
              onClick={primaryAction.onClick}
              leftIcon="🚀"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </ActionButtons>
      </PlaceholderContainer>
    </Layout>
  );
};

export default PlaceholderPage;
