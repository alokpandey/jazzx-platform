# JazzX Platform - React Application

**AI-Powered Mortgage Platform by Alok Pandey, Principal Architect at Xoriant**

## 🚀 Live Demo

**Development Server**: `http://localhost:3000` (after running `npm run dev`)

## 🎯 Demo Credentials

### Borrower Login
- **Email**: `demo@borrower.com`
- **Password**: `Demo123!`

### Broker Login
- **Email**: `broker@company.com`
- **Password**: `Broker123!`

*Note: Any valid email format and 8+ character password will work for demo purposes*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Azure CLI (for deployment)

### Local Development

1. **Install dependencies:**
```bash
cd jazzx-platform
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🏗 Architecture Overview

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Styled Components** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Mock Server** for development (axios-mock-adapter)

### Backend Architecture
- **Mock API Layer** - Simulates real backend services
- **Service Layer** - Abstracted API calls
- **Type Safety** - Full TypeScript coverage
- **Authentication** - JWT-based auth simulation
- **State Management** - React Context + useReducer

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Layout/
│   └── ...
├── pages/              # Page components
│   ├── LandingPage/
│   ├── LoginPage/
│   ├── DashboardPage/
│   └── ...
├── services/           # API services and mock data
│   ├── api.ts
│   ├── authService.ts
│   ├── loanService.ts
│   ├── brokerService.ts
│   ├── mockServer.ts
│   └── mockData.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx
│   ├── useNotification.tsx
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts
├── styles/             # Global styles and theme
│   ├── theme.ts
│   └── GlobalStyles.ts
└── utils/              # Utility functions
```

## 🔐 Demo Credentials

### Borrower Login
- Email: `demo@borrower.com`
- Password: `Demo123!`

### Broker Login  
- Email: `broker@company.com`
- Password: `Broker123!`

## 🎯 Key Features

### Mock Backend Services
- **Authentication Service** - Login/logout with JWT simulation
- **Loan Service** - Quote generation, applications, documents
- **Broker Service** - Client management, AI insights, pipeline
- **Real-time API simulation** - Realistic delays and responses

### AI-Powered Features
- **Smart Quote Generation** - AI calculates personalized loan options
- **Client Scoring** - AI risk assessment for brokers
- **Market Insights** - Predictive analytics and recommendations
- **Document Processing** - Automated categorization and validation

### Professional UI/UX
- **Responsive Design** - Works on all devices
- **Accessibility** - WCAG compliant components
- **Loading States** - Smooth user experience
- **Error Handling** - Graceful error management
- **Notifications** - Toast notifications for user feedback

## 🚀 Azure Deployment

### Option 1: Azure Static Web Apps (Recommended)

1. **Build the application:**
```bash
npm run build
```

2. **Deploy using Azure CLI:**
```bash
# Login to Azure
az login

# Create resource group
az group create --name jazzx-platform --location eastus

# Create static web app
az staticwebapp create \
  --name jazzx-platform \
  --resource-group jazzx-platform \
  --source https://github.com/your-username/jazzx-platform \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

3. **Configure custom domain (optional):**
```bash
az staticwebapp hostname set \
  --name jazzx-platform \
  --resource-group jazzx-platform \
  --hostname your-domain.com
```

### Option 2: Azure App Service

1. **Create App Service:**
```bash
# Create App Service plan
az appservice plan create \
  --name jazzx-plan \
  --resource-group jazzx-platform \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name jazzx-platform \
  --resource-group jazzx-platform \
  --plan jazzx-plan \
  --runtime "NODE|18-lts"
```

2. **Deploy application:**
```bash
# Build and deploy
npm run build
az webapp deployment source config-zip \
  --resource-group jazzx-platform \
  --name jazzx-platform \
  --src dist.zip
```

### Option 3: Azure Container Instances

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```

2. **Deploy container:**
```bash
# Build and push to Azure Container Registry
az acr create --resource-group jazzx-platform --name jazzxregistry --sku Basic
az acr build --registry jazzxregistry --image jazzx-platform .

# Deploy to Container Instances
az container create \
  --resource-group jazzx-platform \
  --name jazzx-platform \
  --image jazzxregistry.azurecr.io/jazzx-platform \
  --cpu 1 \
  --memory 1 \
  --ports 3000
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file for local development:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENVIRONMENT=development
VITE_ENABLE_MOCK_SERVER=true
```

For production deployment:
```env
VITE_API_BASE_URL=https://your-api.azurewebsites.net/api
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_SERVER=false
```

## 📊 Performance Optimization

### Build Optimizations
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Remove unused code
- **Asset Optimization** - Minified CSS/JS
- **Lazy Loading** - Components loaded on demand

### Runtime Optimizations
- **React.memo** - Prevent unnecessary re-renders
- **useMemo/useCallback** - Optimize expensive calculations
- **Virtual Scrolling** - Handle large data sets
- **Image Optimization** - WebP format with fallbacks

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Testing
```bash
npm run lighthouse
```

## 📈 Monitoring & Analytics

### Azure Application Insights
```bash
# Enable Application Insights
az monitor app-insights component create \
  --app jazzx-platform \
  --location eastus \
  --resource-group jazzx-platform
```

### Performance Monitoring
- **Core Web Vitals** tracking
- **User interaction** analytics  
- **Error tracking** and reporting
- **API performance** monitoring

## 🔒 Security Features

### Authentication & Authorization
- **JWT token** management
- **Role-based access** control
- **Session timeout** handling
- **CSRF protection**

### Data Security
- **Input validation** and sanitization
- **XSS protection**
- **Secure headers** configuration
- **HTTPS enforcement**

## 🎯 Next Steps

### Phase 1: Core Platform (Current)
- ✅ React application with TypeScript
- ✅ Mock backend services
- ✅ Authentication system
- ✅ Responsive UI components

### Phase 2: Real Backend Integration
- [ ] Azure Functions API
- [ ] Azure SQL Database
- [ ] Azure Blob Storage for documents
- [ ] Azure Cognitive Services for AI

### Phase 3: Advanced Features
- [ ] Real-time notifications (SignalR)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Third-party integrations

## 📞 Support

**Alok Pandey**  
Principal Architect, Xoriant  
*AI-Powered Fintech Solutions*

For technical support or deployment assistance, please contact the development team.
