import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const QuickQuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanAmount: '',
    propertyValue: '',
    creditScore: '',
    annualIncome: '',
    propertyType: 'single-family',
    loanPurpose: 'purchase'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showQuoteOptions, setShowQuoteOptions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Simulate AI response as user types
    if (name === 'loanAmount' && value) {
      const amount = parseInt(value);
      if (amount > 0) {
        setAiResponse(`💡 AI Insight: Based on $${amount.toLocaleString()} loan amount, I'm analyzing optimal loan programs. Your estimated monthly payment could range from $${Math.round(amount * 0.004)} to $${Math.round(amount * 0.007)}.`);
      }
    }
  };

  const handleGetQuote = async () => {
    setIsProcessing(true);
    setAiResponse('🤖 AI is processing your information and analyzing 500+ loan programs...');

    // Simulate AI processing
    setTimeout(() => {
      setAiResponse('✅ Analysis complete! Found 12 matching loan programs. Here are your top options:');
      setShowQuoteOptions(true);
      setIsProcessing(false);
    }, 3000);
  };

  const handleSelectOption = (optionId: string) => {
    navigate('/quote-results', { state: { selectedOption: optionId, formData } });
  };

  return (
    <Container>
      <Header>
        <Title>⚡ Quick Quote - 30 Seconds</Title>
        <Subtitle>Get personalized loan options with our AI-powered engine</Subtitle>
      </Header>

      <MainContent>
        <FormSection>
          <FormTitle>Loan Information</FormTitle>

          <FormGroup>
            <Label>Loan Amount</Label>
            <Input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              placeholder="$500,000"
            />
          </FormGroup>

          <FormGroup>
            <Label>Property Value</Label>
            <Input
              type="number"
              name="propertyValue"
              value={formData.propertyValue}
              onChange={handleInputChange}
              placeholder="$600,000"
            />
          </FormGroup>

          <FormGroup>
            <Label>Credit Score</Label>
            <Select name="creditScore" value={formData.creditScore} onChange={handleInputChange}>
              <option value="">Select Range</option>
              <option value="800+">Excellent (800+)</option>
              <option value="740-799">Very Good (740-799)</option>
              <option value="670-739">Good (670-739)</option>
              <option value="580-669">Fair (580-669)</option>
              <option value="<580">Poor (&lt;580)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Annual Income</Label>
            <Input
              type="number"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleInputChange}
              placeholder="$120,000"
            />
          </FormGroup>

          <FormGroup>
            <Label>Property Type</Label>
            <Select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
              <option value="single-family">Single Family Home</option>
              <option value="condo">Condominium</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi-family">Multi-Family</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Loan Purpose</Label>
            <Select name="loanPurpose" value={formData.loanPurpose} onChange={handleInputChange}>
              <option value="purchase">Purchase</option>
              <option value="refinance">Refinance</option>
              <option value="cash-out">Cash-Out Refinance</option>
            </Select>
          </FormGroup>

          <QuoteButton
            onClick={handleGetQuote}
            disabled={!formData.loanAmount || !formData.propertyValue || isProcessing}
          >
            {isProcessing ? '🤖 AI Processing...' : '⚡ Get Quick Quote'}
          </QuoteButton>
        </FormSection>

        <ResponseSection>
          <ResponseTitle>AI Response</ResponseTitle>
          <AIResponse>{aiResponse || '👋 Enter your loan details and I\'ll provide real-time insights and recommendations.'}</AIResponse>

          {showQuoteOptions && (
            <QuoteOptions>
              <OptionsTitle>🎯 Your Top Loan Options</OptionsTitle>

              <OptionCard onClick={() => handleSelectOption('conventional-30')}>
                <OptionHeader>
                  <OptionName>30-Year Conventional</OptionName>
                  <OptionRate>6.25% APR</OptionRate>
                </OptionHeader>
                <OptionDetails>
                  <div>Monthly Payment: ${Math.round(parseInt(formData.loanAmount || '500000') * 0.006).toLocaleString()}</div>
                  <div>Down Payment: 20% • Closing Costs: $8,500</div>
                </OptionDetails>
                <OptionBadge>⭐ Most Popular</OptionBadge>
              </OptionCard>

              <OptionCard onClick={() => handleSelectOption('fha-30')}>
                <OptionHeader>
                  <OptionName>30-Year FHA</OptionName>
                  <OptionRate>6.15% APR</OptionRate>
                </OptionHeader>
                <OptionDetails>
                  <div>Monthly Payment: ${Math.round(parseInt(formData.loanAmount || '500000') * 0.0058).toLocaleString()}</div>
                  <div>Down Payment: 3.5% • PMI Required</div>
                </OptionDetails>
                <OptionBadge>💰 Low Down Payment</OptionBadge>
              </OptionCard>

              <OptionCard onClick={() => handleSelectOption('va-30')}>
                <OptionHeader>
                  <OptionName>30-Year VA</OptionName>
                  <OptionRate>5.95% APR</OptionRate>
                </OptionHeader>
                <OptionDetails>
                  <div>Monthly Payment: ${Math.round(parseInt(formData.loanAmount || '500000') * 0.0055).toLocaleString()}</div>
                  <div>Down Payment: 0% • No PMI</div>
                </OptionDetails>
                <OptionBadge>🇺🇸 Veterans Only</OptionBadge>
              </OptionCard>

              <OptionCard onClick={() => handleSelectOption('jumbo-30')}>
                <OptionHeader>
                  <OptionName>30-Year Jumbo</OptionName>
                  <OptionRate>6.45% APR</OptionRate>
                </OptionHeader>
                <OptionDetails>
                  <div>Monthly Payment: ${Math.round(parseInt(formData.loanAmount || '500000') * 0.0065).toLocaleString()}</div>
                  <div>Down Payment: 20% • High Loan Limits</div>
                </OptionDetails>
                <OptionBadge>🏠 High-Value Properties</OptionBadge>
              </OptionCard>
            </QuoteOptions>
          )}
        </ResponseSection>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #4a5568;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const QuoteButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResponseSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const ResponseTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const AIResponse = styled.div`
  background: #f7fafc;
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 8px;
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const QuoteOptions = styled.div`
  margin-top: 2rem;
`;

const OptionsTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const OptionCard = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OptionName = styled.h4`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const OptionRate = styled.div`
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 700;
`;

const OptionDetails = styled.div`
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const OptionBadge = styled.div`
  position: absolute;
  top: -8px;
  right: 1rem;
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export default QuickQuotePage;
