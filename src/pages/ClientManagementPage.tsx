import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const ClientManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingClient, setAddingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    loanAmount: ''
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiService.get('/broker/clients');
        setClients((response.data as any) || []);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        // Set fallback data
        setClients([
          {
            id: "client-1",
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "(555) 123-4567",
            loanAmount: 450000,
            status: "Pre-approved",
            lastContact: "2024-01-20"
          },
          {
            id: "client-2",
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            phone: "(555) 987-6543",
            loanAmount: 320000,
            status: "In Review",
            lastContact: "2024-01-18"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate form
    if (!newClient.name || !newClient.email || !newClient.phone || !newClient.loanAmount) {
      alert('Please fill in all fields');
      return;
    }

    setAddingClient(true);

    try {
      // Prepare client data
      const clientData = {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        loanAmount: parseInt(newClient.loanAmount) || 0
      };

      // Call the API and wait for confirmation
      const response = await apiService.post('/broker/clients', clientData);

      // Create the client object with server response data
      const addedClient = {
        id: (response.data as any)?.id || `client-${Date.now()}`,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        loanAmount: clientData.loanAmount,
        status: (response.data as any)?.status || 'New Lead',
        lastContact: (response.data as any)?.createdDate?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      // Add to the client list only after server confirmation
      setClients(prev => [addedClient, ...prev]);

      // Reset form and close modal
      setNewClient({ name: '', email: '', phone: '', loanAmount: '' });
      setShowAddForm(false);

      // Show success message
      alert('Client added successfully and saved to server!');

    } catch (error) {
      console.error('Failed to add client:', error);
      alert('Failed to add client to server. Please check your connection and try again.');
    } finally {
      setAddingClient(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading clients...</LoadingContainer>;
  }

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>🏢 Broker Portal</SidebarTitle>
          <LogoutButton onClick={handleLogout}>
            🏠 Home
          </LogoutButton>
        </SidebarHeader>
        <NavItem onClick={() => navigate('/broker-dashboard')}>
          📊 Dashboard
        </NavItem>
        <NavItem onClick={() => navigate('/client-management')} active>
          👥 Clients
        </NavItem>
        <NavItem onClick={() => navigate('/pipeline')}>
          📈 Pipeline
        </NavItem>
        <NavItem onClick={() => navigate('/documents')}>
          📄 Documents
        </NavItem>
        <NavItem onClick={() => navigate('/reports')}>
          📋 Reports
        </NavItem>
        <NavItem onClick={() => navigate('/ai-insights')}>
          🤖 AI Insights
        </NavItem>
        <NavItem onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </NavItem>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>👥 Client Management</Title>
          <HeaderActions>
            <AddClientButton onClick={() => setShowAddForm(true)}>
              + Add New Client
            </AddClientButton>
          </HeaderActions>
        </Header>

        <ClientsGrid>
          {clients.map((client) => (
            <ClientCard key={client.id}>
              <ClientHeader>
                <ClientAvatar>
                  {client.name.split(' ').map((n: string) => n[0]).join('')}
                </ClientAvatar>
                <ClientInfo>
                  <ClientName>{client.name}</ClientName>
                  <ClientEmail>{client.email}</ClientEmail>
                  <ClientPhone>{client.phone}</ClientPhone>
                </ClientInfo>
                <ClientStatus status={client.status}>
                  {client.status}
                </ClientStatus>
              </ClientHeader>

              <ClientDetails>
                <DetailItem>
                  <DetailLabel>Loan Amount:</DetailLabel>
                  <DetailValue>${client.loanAmount?.toLocaleString()}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Last Contact:</DetailLabel>
                  <DetailValue>{client.lastContact}</DetailValue>
                </DetailItem>
              </ClientDetails>

              <ClientActions>
                <ActionButton primary>Contact</ActionButton>
                <ActionButton>View Details</ActionButton>
                <ActionButton>Edit</ActionButton>
              </ClientActions>
            </ClientCard>
          ))}
        </ClientsGrid>

        {showAddForm && (
          <AddClientModal onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddForm(false);
            }
          }}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Add New Client</ModalTitle>
                <CloseButton onClick={() => setShowAddForm(false)}>×</CloseButton>
              </ModalHeader>
              <AddClientForm onSubmit={handleAddClient}>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    required
                    disabled={addingClient}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    placeholder="john@email.com"
                    required
                    disabled={addingClient}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    required
                    disabled={addingClient}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Loan Amount</Label>
                  <Input
                    type="number"
                    name="loanAmount"
                    value={newClient.loanAmount}
                    onChange={handleInputChange}
                    placeholder="500000"
                    required
                    disabled={addingClient}
                  />
                </FormGroup>
                <FormActions>
                  <ActionButton
                    type="submit"
                    primary
                    disabled={addingClient}
                  >
                    {addingClient ? '🔄 Adding Client...' : 'Add Client'}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    disabled={addingClient}
                  >
                    Cancel
                  </ActionButton>
                </FormActions>
              </AddClientForm>
            </ModalContent>
          </AddClientModal>
        )}
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 0;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h2`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #edf2f7;
    color: #2d3748;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  background: ${props => props.active ? '#f0f4ff' : 'transparent'};
  border-right: ${props => props.active ? '3px solid #667eea' : 'none'};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    background: #f0f4ff;
    color: #667eea;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddClientButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a67d8;
    transform: translateY(-2px);
  }
`;

const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ClientCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ClientAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ClientEmail = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ClientPhone = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const ClientStatus = styled.div<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props =>
    props.status === 'Pre-approved' ? '#c6f6d5' :
    props.status === 'In Review' ? '#fed7d7' :
    '#e2e8f0'
  };
  color: ${props =>
    props.status === 'Pre-approved' ? '#22543d' :
    props.status === 'In Review' ? '#742a2a' :
    '#2d3748'
  };
`;

const ClientDetails = styled.div`
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.span`
  color: #718096;
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: #2d3748;
  font-weight: 500;
  font-size: 0.9rem;
`;

const ClientActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.primary ? '#667eea' : 'white'};
  color: ${props => props.primary ? 'white' : '#667eea'};
  border: ${props => props.primary ? 'none' : '1px solid #667eea'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddClientModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;

  &:hover {
    color: #2d3748;
  }
`;

const AddClientForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #4a5568;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus:not(:disabled) {
    outline: none;
    border-color: #667eea;
  }

  &:disabled {
    background-color: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #718096;
`;

export default ClientManagementPage;
