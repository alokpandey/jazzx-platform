import React from 'react';
import styled, { css } from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const getButtonStyles = (variant: ButtonVariant, theme: any) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary[500]};
        color: ${theme.colors.neutral[0]};
        border: 1px solid ${theme.colors.primary[500]};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
          border-color: ${theme.colors.primary[700]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.neutral[100]};
        color: ${theme.colors.neutral[700]};
        border: 1px solid ${theme.colors.neutral[200]};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.neutral[200]};
          border-color: ${theme.colors.neutral[300]};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.neutral[300]};
          border-color: ${theme.colors.neutral[400]};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary[600]};
        border: 1px solid ${theme.colors.primary[500]};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[50]};
          border-color: ${theme.colors.primary[600]};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.primary[100]};
          border-color: ${theme.colors.primary[700]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${theme.colors.neutral[600]};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
          background-color: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[800]};
        }
      `;
    case 'danger':
      return css`
        background-color: ${theme.colors.error[500]};
        color: ${theme.colors.neutral[0]};
        border: 1px solid ${theme.colors.error[500]};

        &:hover:not(:disabled) {
          background-color: ${theme.colors.error[600]};
          border-color: ${theme.colors.error[600]};
        }

        &:active:not(:disabled) {
          background-color: ${theme.colors.error[700]};
          border-color: ${theme.colors.error[700]};
        }
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: ButtonSize, theme: any) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing[2]} ${theme.spacing[3]};
        font-size: ${theme.fontSizes.sm};
        min-height: 32px;
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing[4]} ${theme.spacing[6]};
        font-size: ${theme.fontSizes.lg};
        min-height: 48px;
      `;
    case 'md':
    default:
      return css`
        padding: ${theme.spacing[3]} ${theme.spacing[4]};
        font-size: ${theme.fontSizes.base};
        min-height: 40px;
      `;
  }
};

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  
  ${({ variant, theme }) => getButtonStyles(variant, theme)}
  ${({ size, theme }) => getSizeStyles(size, theme)}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  ${({ loading }) => loading && css`
    color: transparent;
  `}
`;

const ButtonContent = styled.span<{ loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  opacity: ${({ loading }) => loading ? 0 : 1};
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      <ButtonContent loading={loading}>
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </ButtonContent>
      {loading && (
        <LoadingContainer>
          <LoadingSpinner size="sm" fullScreen={false} />
        </LoadingContainer>
      )}
    </StyledButton>
  );
};

export default Button;
