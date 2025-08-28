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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.neutral[50]} 100%);
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.neutral[200]};
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
`;

const SocialButton = styled(Button)`
  justify-content: flex-start;
  padding-left: ${({ theme }) => theme.spacing[4]};
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

const BrokerLoginPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, error } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

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
        userType: 'borrower',
      });

      showNotification('Welcome back! Redirecting to your dashboard...', 'success');

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      showNotification('Login failed. Please check your credentials.', 'error');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    showNotification(`${provider} login initiated...`, 'info');
    
    // Simulate social login
    setTimeout(async () => {
      try {
        await login({
          email: 'demo@borrower.com',
          password: 'Demo123!',
          userType: 'borrower',
        });
        
        showNotification('Successfully logged in! Redirecting...', 'success');
        
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } catch (error) {
        // Error handled by auth hook
      }
    }, 1000);
  };

  return (
    <Layout>
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <Logo>JazzX</Logo>
            <LoginTitle>Welcome Back</LoginTitle>
            <LoginSubtitle>Sign in to your account to continue</LoginSubtitle>
          </LoginHeader>

          <LoginForm onSubmit={handleSubmit}>
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
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
                Remember me
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
              Sign In
            </Button>
          </LoginForm>

          <Divider>
            <span>Or continue with</span>
          </Divider>

          <SocialLoginContainer>
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
              onClick={() => handleSocialLogin('Microsoft')}
              leftIcon="🪟"
            >
              Continue with Microsoft
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

          <BrokerLoginPrompt>
            <strong>Are you a mortgage broker?</strong>
            <br />
            <Link to="/broker-login">Access the Broker Portal →</Link>
          </BrokerLoginPrompt>

          <SignupPrompt>
            Don't have an account?{' '}
            <SignupLink to="/register">Create one here</SignupLink>
          </SignupPrompt>
        </LoginCard>
      </LoginContainer>
    </Layout>
  );
};

export default LoginPage;
