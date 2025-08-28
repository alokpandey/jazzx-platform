import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderPage from '@/components/PlaceholderPage';

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlaceholderPage
      title="Document Management"
      description="Upload, organize, and track your loan documents with AI-powered categorization and verification status."
      icon="📁"
      showSidebar={true}
      showNotifications={true}
      features={[
        'Drag & drop file upload',
        'AI document categorization',
        'Real-time verification status',
        'Smart document requests',
        'Secure cloud storage',
        'Mobile document capture'
      ]}
      primaryAction={{
        label: 'Upload Documents',
        onClick: () => navigate('/documents')
      }}
      secondaryAction={{
        label: 'View Requirements',
        onClick: () => navigate('/loan-status')
      }}
    />
  );
};

export default DocumentsPage;
