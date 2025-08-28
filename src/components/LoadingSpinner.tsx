import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ fullScreen, theme }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: ${theme.zIndex.overlay};
  `}
  ${({ fullScreen, theme }) => !fullScreen && `
    padding: ${theme.spacing[8]};
  `}
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      case 'md':
      default: return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      case 'md':
      default: return '40px';
    }
  }};
  border: ${({ size }) => {
    switch (size) {
      case 'sm': return '2px';
      case 'lg': return '6px';
      case 'md':
      default: return '4px';
    }
  }} solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: ${({ size }) => {
    switch (size) {
      case 'sm': return '2px';
      case 'lg': return '6px';
      case 'md':
      default: return '4px';
    }
  }} solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;

const LogoSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  showLogo?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullScreen = true, 
  text,
  showLogo = false 
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen}>
      {showLogo ? (
        <LogoSpinner>
          <Logo>JazzX</Logo>
          <Spinner size={size} />
          {text && <LoadingText>{text}</LoadingText>}
        </LogoSpinner>
      ) : (
        <>
          <Spinner size={size} />
          {text && <LoadingText>{text}</LoadingText>}
        </>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
