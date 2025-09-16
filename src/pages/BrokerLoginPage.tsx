import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';

const LoginContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.neutral[800]} 0%, ${({ theme }) => theme.colors.neutral[700]} 100%);
  margin: -${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral[0]};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LoginSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin: 0;
`;

const ProBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.neutral[800]} 0%, ${({ theme }) => theme.colors.neutral[700]} 100%);
  color: ${({ theme }) => theme.colors.neutral[0]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => theme.spacing[2]} 0;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary[500]};
`;

const ForgotPasswordLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DemoCredentials = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const DemoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const DemoInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: ${({ theme }) => theme.lineHeights.snug};
`;

const BorrowerLoginPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[6]} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.neutral[300]};
  }

  span {
    padding: 0 ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.neutral[500]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SocialButton = styled(Button)`
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const BrokerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, error } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/broker-dashboard';

  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
    }
  }, [error, showNotification]);

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email,
        password,
        userType: 'broker',
      });
      
      showNotification('Welcome to JazzX Pro! Redirecting to your dashboard...', 'success');
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      // Error is handled by the auth hook and displayed via notification
    }
  };

  const handleDemoLogin = async () => {
    setEmail('broker@company.com');
    setPassword('Broker123!');

    setTimeout(async () => {
      try {
        await login({
          email: 'broker@company.com',
          password: 'Broker123!',
          userType: 'broker',
        });

        showNotification('Demo login successful! Welcome to JazzX Pro...', 'success');

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } catch (error) {
        // Error handled by auth hook
      }
    }, 500);
  };

  const handleSocialLogin = async (provider: string) => {
    showNotification(`${provider} SSO login initiated...`, 'info');

    // Simulate SSO login for broker
    setTimeout(async () => {
      try {
        await login({
          email: 'broker@company.com',
          password: 'Broker123!',
          userType: 'broker',
        });

        showNotification(`Successfully logged in with ${provider}! Redirecting to broker dashboard...`, 'success');

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } catch (error) {
        showNotification(`${provider} login failed. Please try again.`, 'error');
      }
    }, 1000);
  };

  return (
    <Layout>
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <Logo>JazzX Pro</Logo>
            <ProBadge>
              <span>👔</span>
              <span>Broker Portal</span>
            </ProBadge>
            <LoginTitle>Broker Sign In</LoginTitle>
            <LoginSubtitle>Access your professional dashboard</LoginSubtitle>
          </LoginHeader>

          <DemoCredentials>
            <DemoTitle>🎯 Demo Access</DemoTitle>
            <DemoInfo>
              <strong>Email:</strong> broker@company.com<br />
              <strong>Password:</strong> Broker123!<br />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDemoLogin}
                style={{ marginTop: '8px' }}
              >
                Quick Demo Login
              </Button>
            </DemoInfo>
          </DemoCredentials>

          <LoginForm onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Business Email"
              placeholder="Enter your business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
              fullWidth
              leftIcon="📧"
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              required
              fullWidth
              leftIcon="🔒"
            />

            <RememberMeContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me signed in
              </CheckboxContainer>
              <ForgotPasswordLink to="/forgot-password">
                Forgot password?
              </ForgotPasswordLink>
            </RememberMeContainer>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isLoading}
              leftIcon="🚀"
            >
              Access Broker Portal
            </Button>
          </LoginForm>

          <Divider>
            <span>Or continue with</span>
          </Divider>

          <SocialLoginContainer>
            <SocialButton
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('Microsoft')}
              leftIcon="🪟"
            >
              Continue with Microsoft
            </SocialButton>
            <SocialButton
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('Google')}
              leftIcon="🔍"
            >
              Continue with Google
            </SocialButton>
            <SocialButton
              variant="outline"
              fullWidth
              onClick={() => handleSocialLogin('Apple')}
              leftIcon="🍎"
            >
              Continue with Apple
            </SocialButton>
          </SocialLoginContainer>

          <BorrowerLoginPrompt>
            <strong>Looking for a loan?</strong>
            <br />
            <Link to="/login">Sign in as a borrower →</Link>
          </BorrowerLoginPrompt>

          <SignupPrompt>
            New broker partner?{' '}
            <SignupLink to="/broker-register">Join JazzX Pro</SignupLink>
          </SignupPrompt>
        </LoginCard>
      </LoginContainer>
    </Layout>
  );
};

export default BrokerLoginPage;
