# JazzX Platform - Azure Deployment Guide

**AI-Powered Mortgage Platform by Alok Pandey, Principal Architect at Xoriant**

## 🚀 Quick Deployment Options

### Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is perfect for React applications with automatic CI/CD, global distribution, and integrated API support.

#### Prerequisites
- Azure CLI installed
- GitHub account
- Azure subscription

#### Step 1: Create Azure Static Web App

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name jazzx-platform-rg \
  --location eastus

# Create static web app
az staticwebapp create \
  --name jazzx-platform \
  --resource-group jazzx-platform-rg \
  --source https://github.com/YOUR_USERNAME/jazzx-platform \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

#### Step 2: Configure GitHub Repository

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: JazzX Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jazzx-platform.git
git push -u origin main
```

2. **GitHub Actions will automatically deploy** using the workflow in `.github/workflows/azure-static-web-apps.yml`

#### Step 3: Configure Custom Domain (Optional)

```bash
# Add custom domain
az staticwebapp hostname set \
  --name jazzx-platform \
  --resource-group jazzx-platform-rg \
  --hostname your-domain.com
```

### Option 2: Azure App Service

For more control over the hosting environment and server-side features.

#### Step 1: Create App Service

```bash
# Create App Service plan
az appservice plan create \
  --name jazzx-plan \
  --resource-group jazzx-platform-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name jazzx-platform-app \
  --resource-group jazzx-platform-rg \
  --plan jazzx-plan \
  --runtime "NODE|18-lts"
```

#### Step 2: Deploy Application

```bash
# Build the application
npm run build

# Create deployment package
zip -r jazzx-platform.zip dist/

# Deploy to App Service
az webapp deployment source config-zip \
  --resource-group jazzx-platform-rg \
  --name jazzx-platform-app \
  --src jazzx-platform.zip
```

### Option 3: Azure Container Instances

For containerized deployment with full control over the runtime environment.

#### Step 1: Build and Push Container

```bash
# Create Azure Container Registry
az acr create \
  --resource-group jazzx-platform-rg \
  --name jazzxregistry \
  --sku Basic

# Build and push image
az acr build \
  --registry jazzxregistry \
  --image jazzx-platform:latest .
```

#### Step 2: Deploy Container

```bash
# Deploy to Container Instances
az container create \
  --resource-group jazzx-platform-rg \
  --name jazzx-platform-container \
  --image jazzxregistry.azurecr.io/jazzx-platform:latest \
  --cpu 1 \
  --memory 1 \
  --ports 80 \
  --dns-name-label jazzx-platform
```

## 🔧 Environment Configuration

### Development Environment

Create `.env.local` for local development:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENVIRONMENT=development
VITE_ENABLE_MOCK_SERVER=true
```

### Production Environment

Configure environment variables in Azure:

#### For Static Web Apps:
```bash
az staticwebapp appsettings set \
  --name jazzx-platform \
  --resource-group jazzx-platform-rg \
  --setting-names VITE_API_BASE_URL=https://your-api.azurewebsites.net/api \
  --setting-names VITE_ENVIRONMENT=production \
  --setting-names VITE_ENABLE_MOCK_SERVER=false
```

#### For App Service:
```bash
az webapp config appsettings set \
  --resource-group jazzx-platform-rg \
  --name jazzx-platform-app \
  --settings VITE_API_BASE_URL=https://your-api.azurewebsites.net/api \
             VITE_ENVIRONMENT=production \
             VITE_ENABLE_MOCK_SERVER=false
```

## 🔒 Security Configuration

### SSL/TLS Certificate

Azure Static Web Apps and App Service provide automatic SSL certificates. For custom domains:

```bash
# For App Service with custom domain
az webapp config ssl bind \
  --certificate-thumbprint YOUR_CERT_THUMBPRINT \
  --ssl-type SNI \
  --name jazzx-platform-app \
  --resource-group jazzx-platform-rg
```

### Security Headers

Security headers are configured in:
- `staticwebapp.config.json` for Static Web Apps
- `nginx.conf` for containerized deployments

### Authentication (Future Enhancement)

For production deployment with real authentication:

```bash
# Configure Azure AD authentication
az webapp auth update \
  --name jazzx-platform-app \
  --resource-group jazzx-platform-rg \
  --enabled true \
  --action LoginWithAzureActiveDirectory \
  --aad-client-id YOUR_CLIENT_ID \
  --aad-client-secret YOUR_CLIENT_SECRET \
  --aad-tenant-id YOUR_TENANT_ID
```

## 📊 Monitoring & Analytics

### Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app jazzx-platform-insights \
  --location eastus \
  --resource-group jazzx-platform-rg \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app jazzx-platform-insights \
  --resource-group jazzx-platform-rg \
  --query instrumentationKey
```

Add to environment variables:
```env
VITE_APPINSIGHTS_INSTRUMENTATIONKEY=your-instrumentation-key
```

### Performance Monitoring

Configure alerts and monitoring:

```bash
# Create availability test
az monitor app-insights web-test create \
  --resource-group jazzx-platform-rg \
  --name jazzx-availability-test \
  --location eastus \
  --web-test-name "JazzX Platform Availability" \
  --web-test-kind ping \
  --frequency 300 \
  --timeout 30 \
  --enabled true \
  --locations "us-east-1" \
  --url "https://your-domain.com"
```

## 🚀 CI/CD Pipeline

### GitHub Actions (Included)

The repository includes a complete GitHub Actions workflow:
- Automatic builds on push to main
- TypeScript compilation and linting
- Automated deployment to Azure Static Web Apps
- Environment-specific configurations

### Azure DevOps (Alternative)

Use `azure-pipelines.yml` for Azure DevOps:

```bash
# Create Azure DevOps project and configure pipeline
az devops project create --name "JazzX Platform"
az pipelines create --name "JazzX-Platform-CI-CD" --repository https://github.com/YOUR_USERNAME/jazzx-platform --branch main
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check TypeScript errors: `npm run build`
   - Verify environment variables are set correctly
   - Ensure all dependencies are installed: `npm ci`

2. **Deployment Issues:**
   - Verify Azure CLI is logged in: `az account show`
   - Check resource group and app names are correct
   - Ensure sufficient Azure subscription permissions

3. **Runtime Issues:**
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible
   - Check network requests in browser dev tools

### Debugging Commands

```bash
# Check deployment status
az staticwebapp show --name jazzx-platform --resource-group jazzx-platform-rg

# View application logs
az webapp log tail --name jazzx-platform-app --resource-group jazzx-platform-rg

# Test local build
npm run build && npm run preview
```

## 📈 Scaling & Performance

### Auto-scaling (App Service)

```bash
# Configure auto-scaling
az monitor autoscale create \
  --resource-group jazzx-platform-rg \
  --resource jazzx-platform-app \
  --resource-type Microsoft.Web/sites \
  --name jazzx-autoscale \
  --min-count 1 \
  --max-count 5 \
  --count 2
```

### CDN Configuration

```bash
# Create CDN profile
az cdn profile create \
  --resource-group jazzx-platform-rg \
  --name jazzx-cdn \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --resource-group jazzx-platform-rg \
  --profile-name jazzx-cdn \
  --name jazzx-platform-cdn \
  --origin your-domain.azurestaticapps.net
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Custom domain configured (if applicable)
- [ ] Application Insights enabled
- [ ] Security headers configured
- [ ] Performance monitoring set up
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline tested
- [ ] Load testing completed
- [ ] Security scan performed

## 📞 Support

For deployment assistance or technical support:

**Alok Pandey**  
Principal Architect, Xoriant  
*AI-Powered Fintech Solutions*

---

## 🎉 Success!

Your JazzX Platform is now deployed to Azure with:
- ✅ Production-ready React application
- ✅ Automated CI/CD pipeline
- ✅ Security headers and SSL
- ✅ Performance monitoring
- ✅ Scalable architecture
- ✅ Professional deployment
