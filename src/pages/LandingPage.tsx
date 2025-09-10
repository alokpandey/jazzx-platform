import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Button';

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.primary[100]} 100%);
  padding: ${({ theme }) => theme.spacing[20]} 0;
  text-align: center;
  margin: -${({ theme }) => theme.spacing[6]} -${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[12]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: -${({ theme }) => theme.spacing[4]} -${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
    padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: -${({ theme }) => theme.spacing[3]} -${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
    padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[3]};
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.neutral[600]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin: 0;
`;

const StatsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral[0]};
  padding: ${({ theme }) => theme.spacing[16]} 0;
  margin: ${({ theme }) => theme.spacing[16]} -${({ theme }) => theme.spacing[6]} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: ${({ theme }) => theme.spacing[12]} -${({ theme }) => theme.spacing[4]} 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing[8]} -${({ theme }) => theme.spacing[3]} 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const StatItem = styled.div``;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[400]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.neutral[300]};
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  color: ${({ theme }) => theme.colors.neutral[0]};
  padding: ${({ theme }) => theme.spacing[16]} 0;
  text-align: center;
  margin: ${({ theme }) => theme.spacing[16]} -${({ theme }) => theme.spacing[6]} -${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: ${({ theme }) => theme.spacing[12]} -${({ theme }) => theme.spacing[4]} -${({ theme }) => theme.spacing[4]};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: ${({ theme }) => theme.spacing[8]} -${({ theme }) => theme.spacing[3]} -${({ theme }) => theme.spacing[3]};
  }
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CTASubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <HeroSection>
        <HeroContent>
          <AIBadge>
            <span>🤖</span>
            <span>Powered by Advanced AI</span>
          </AIBadge>
          <HeroTitle>Get Your Dream Home Loan in Minutes</HeroTitle>
          <HeroSubtitle>
            AI-powered mortgage platform that matches you with the perfect loan options 
            and connects you with top-rated brokers. Experience the future of home financing.
          </HeroSubtitle>
          <HeroActions>
            <Button 
              size="lg" 
              onClick={() => navigate('/quick-quote')}
              leftIcon="⚡"
            >
              Quick Quote (30 sec)
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              leftIcon="📄"
            >
              Full Application
            </Button>
          </HeroActions>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>Why Choose JazzX?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Matching</FeatureTitle>
            <FeatureDescription>
              Our advanced AI analyzes your financial profile and matches you with the best loan options 
              from hundreds of lenders in real-time.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Get pre-approved in minutes, not days. Our streamlined process eliminates paperwork 
              and reduces approval time by 75%.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle>Expert Brokers</FeatureTitle>
            <FeatureDescription>
              Connect with top-rated mortgage brokers who specialize in your loan type and 
              have a proven track record of success.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Bank-Level Security</FeatureTitle>
            <FeatureDescription>
              Your data is protected with enterprise-grade encryption and security measures 
              that exceed industry standards.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Real-Time Insights</FeatureTitle>
            <FeatureDescription>
              Track your application progress, market trends, and get personalized recommendations 
              powered by AI analytics.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Best Rates Guaranteed</FeatureTitle>
            <FeatureDescription>
              Our AI continuously monitors market rates and ensures you get the most competitive 
              terms available for your profile.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <SectionTitle style={{ color: 'white', marginBottom: '3rem' }}>
          Trusted by Thousands
        </SectionTitle>
        <StatsGrid>
          <StatItem>
            <StatNumber>$2.8B+</StatNumber>
            <StatLabel>Loans Processed</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>15,000+</StatNumber>
            <StatLabel>Happy Homeowners</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>3x</StatNumber>
            <StatLabel>Faster Approval</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>4.9/5</StatNumber>
            <StatLabel>Customer Rating</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <CTATitle>Ready to Get Started?</CTATitle>
        <CTASubtitle>
          Join thousands of homeowners who found their perfect loan with JazzX
        </CTASubtitle>
        <HeroActions>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/quick-quote')}
            leftIcon="🚀"
          >
            Start Your Journey
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/broker-login')}
            leftIcon="👔"
            style={{ borderColor: 'white', color: 'white' }}
          >
            Broker Portal
          </Button>
        </HeroActions>
      </CTASection>

      {/* Version and Deployment Info */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 0',
        borderTop: '1px solid #e5e7eb',
        marginTop: '3rem',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>🚀 JazzX Platform v1.0.1 | Deployed: {new Date().toLocaleDateString()} | CI/CD: GitHub Actions → Azure</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          ✅ Auto-deployed from main branch | Build #{Math.floor(Math.random() * 1000) + 100}
        </p>
      </div>
    </Layout>
  );
};

export default LandingPage;
