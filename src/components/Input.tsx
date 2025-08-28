import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'flushed';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
`;

const Label = styled.label<{ required?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  
  ${({ required }) => required && css`
    &::after {
      content: ' *';
      color: ${({ theme }) => theme.colors.error[500]};
    }
  `}
`;

const InputWrapper = styled.div<{ 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean;
  size: InputSize;
  variant: InputVariant;
  hasError?: boolean;
  isFocused?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${({ variant, theme, hasError, isFocused }) => {
    switch (variant) {
      case 'filled':
        return css`
          background-color: ${theme.colors.neutral[50]};
          border: 1px solid transparent;
          border-radius: ${theme.borderRadius.md};
          
          ${hasError && css`
            border-color: ${theme.colors.error[500]};
            background-color: ${theme.colors.error[50]};
          `}
          
          ${isFocused && !hasError && css`
            border-color: ${theme.colors.primary[500]};
            background-color: ${theme.colors.neutral[0]};
            box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
          `}
        `;
      case 'flushed':
        return css`
          background-color: transparent;
          border: none;
          border-bottom: 2px solid ${theme.colors.neutral[200]};
          border-radius: 0;
          
          ${hasError && css`
            border-bottom-color: ${theme.colors.error[500]};
          `}
          
          ${isFocused && !hasError && css`
            border-bottom-color: ${theme.colors.primary[500]};
          `}
        `;
      case 'default':
      default:
        return css`
          background-color: ${theme.colors.neutral[0]};
          border: 1px solid ${theme.colors.neutral[300]};
          border-radius: ${theme.borderRadius.md};
          
          ${hasError && css`
            border-color: ${theme.colors.error[500]};
          `}
          
          ${isFocused && !hasError && css`
            border-color: ${theme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
          `}
        `;
    }
  }}
  
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const StyledInput = styled.input<{
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
  size: InputSize;
  variant: InputVariant;
}>`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.neutral[800]};
  
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.fontSizes.sm};
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing[4]} ${theme.spacing[4]};
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
  }}
  
  ${({ hasLeftIcon, theme }) => hasLeftIcon && css`
    padding-left: ${theme.spacing[10]};
  `}
  
  ${({ hasRightIcon, theme }) => hasRightIcon && css`
    padding-right: ${theme.spacing[10]};
  `}
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const IconContainer = styled.div<{ position: 'left' | 'right'; size: InputSize }>`
  position: absolute;
  ${({ position }) => position}: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.neutral[400]};
  pointer-events: none;
  z-index: 1;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
          font-size: 14px;
        `;
      case 'lg':
        return css`
          width: 24px;
          height: 24px;
          font-size: 18px;
        `;
      case 'md':
      default:
        return css`
          width: 20px;
          height: 20px;
          font-size: 16px;
        `;
    }
  }}
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, isError }) => 
    isError ? theme.colors.error[600] : theme.colors.neutral[500]
  };
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  required,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <InputWrapper
        hasLeftIcon={!!leftIcon}
        hasRightIcon={!!rightIcon}
        size={size}
        variant={variant}
        hasError={!!error}
        isFocused={isFocused}
      >
        {leftIcon && (
          <IconContainer position="left" size={size}>
            {leftIcon}
          </IconContainer>
        )}
        <StyledInput
          ref={ref}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon}
          size={size}
          variant={variant}
          required={required}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <IconContainer position="right" size={size}>
            {rightIcon}
          </IconContainer>
        )}
      </InputWrapper>
      {(error || helperText) && (
        <HelperText isError={!!error}>
          {error || helperText}
        </HelperText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
