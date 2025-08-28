import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.neutral[800]};
    background-color: ${({ theme }) => theme.colors.neutral[0]};
    line-height: ${({ theme }) => theme.lineHeights.normal};
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .App {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    color: ${({ theme }) => theme.colors.neutral[900]};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.base};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    font-size: ${({ theme }) => theme.fontSizes.base};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing[4]};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing[6]};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing[8]};
    }
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-2 {
    gap: ${({ theme }) => theme.spacing[2]};
  }

  .gap-4 {
    gap: ${({ theme }) => theme.spacing[4]};
  }

  .gap-6 {
    gap: ${({ theme }) => theme.spacing[6]};
  }

  .mb-2 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  .mb-4 {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  .mb-6 {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }

  .mt-2 {
    margin-top: ${({ theme }) => theme.spacing[2]};
  }

  .mt-4 {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }

  .mt-6 {
    margin-top: ${({ theme }) => theme.spacing[6]};
  }

  .p-4 {
    padding: ${({ theme }) => theme.spacing[4]};
  }

  .p-6 {
    padding: ${({ theme }) => theme.spacing[6]};
  }

  .px-4 {
    padding-left: ${({ theme }) => theme.spacing[4]};
    padding-right: ${({ theme }) => theme.spacing[4]};
  }

  .py-2 {
    padding-top: ${({ theme }) => theme.spacing[2]};
    padding-bottom: ${({ theme }) => theme.spacing[2]};
  }

  .py-4 {
    padding-top: ${({ theme }) => theme.spacing[4]};
    padding-bottom: ${({ theme }) => theme.spacing[4]};
  }

  .rounded {
    border-radius: ${({ theme }) => theme.borderRadius.base};
  }

  .rounded-md {
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  .rounded-lg {
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  .shadow {
    box-shadow: ${({ theme }) => theme.shadows.base};
  }

  .shadow-md {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  .shadow-lg {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral[400]};
  }

  /* Loading animations */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slideInUp {
    animation: slideInUp 0.3s ease-out;
  }
`;
