# Azure Static Web Apps - Complete Setup Guide

## 🚀 Step-by-Step Recreation Process

### Prerequisites
- Azure CLI installed and logged in
- GitHub repository access
- Azure subscription with appropriate permissions

---

## Step 1: Clean Up Existing Resources

### 1.1 Delete Current Azure Static Web Apps Resource
```bash
# List existing static web apps
az staticwebapp list --output table

# Delete the existing resource (replace with your resource name and group)
az staticwebapp delete --name jazzx-platform --resource-group jazzx-platform-rg
```

### 1.2 Remove Old GitHub Secret
1. Go to: https://github.com/alokpandey/jazzx-platform/settings/secrets/actions
2. Delete: `AZURE_STATIC_WEB_APPS_API_TOKEN_JAZZX_PLATFORM`

---

## Step 2: Create New Azure Static Web Apps Resource

### 2.1 Create Resource Group (if needed)
```bash
az group create --name jazzx-platform-rg --location "East US"
```

### 2.2 Create Azure Static Web Apps Resource
```bash
az staticwebapp create \
  --name jazzx-platform-new \
  --resource-group jazzx-platform-rg \
  --source https://github.com/alokpandey/jazzx-platform \
  --location "East US" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist" \
  --login-with-github
```

### 2.3 Get the Deployment Token
```bash
az staticwebapp secrets list --name jazzx-platform-new --resource-group jazzx-platform-rg
```

---

## Step 3: Configure GitHub Repository

### 3.1 Add New GitHub Secret
1. Go to: https://github.com/alokpandey/jazzx-platform/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_NEW`
4. Value: [Paste the deployment token from Step 2.3]

### 3.2 Update Custom Domain (if needed)
```bash
az staticwebapp hostname set \
  --name jazzx-platform-new \
  --resource-group jazzx-platform-rg \
  --hostname jazzx.alokpandey.org
```

---

## Step 4: Verify Configuration

### 4.1 Check Resource Configuration
```bash
# Verify the static web app configuration
az staticwebapp show --name jazzx-platform-new --resource-group jazzx-platform-rg --output table

# Check functions (should show after first deployment)
az staticwebapp functions list --name jazzx-platform-new --resource-group jazzx-platform-rg
```

### 4.2 Monitor Deployment
1. Go to: https://github.com/alokpandey/jazzx-platform/actions
2. Watch for the new deployment workflow
3. Ensure both frontend and API deploy successfully

---

## Step 5: Test the Deployment

### 5.1 Test API Endpoints
```bash
# Test basic API functionality
curl https://jazzx-platform-new.azurestaticapps.net/api/test

# Test login endpoint
curl -X POST https://jazzx-platform-new.azurestaticapps.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@borrower.com","password":"Demo123!"}'
```

### 5.2 Test Custom Domain (if configured)
```bash
curl https://jazzx.alokpandey.org/api/test
```

---

## Alternative: Azure Portal Method

If you prefer using the Azure Portal:

### 1. Create via Portal
1. Go to: https://portal.azure.com
2. Search for "Static Web Apps"
3. Click "Create"
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: jazzx-platform-rg (create new if needed)
   - **Name**: jazzx-platform-new
   - **Plan Type**: Free
   - **Region**: East US
   - **Source**: GitHub
   - **GitHub Account**: alokpandey
   - **Repository**: jazzx-platform
   - **Branch**: main
   - **Build Presets**: Custom
   - **App location**: /
   - **Api location**: api
   - **Output location**: dist

### 2. Get Deployment Token
1. After creation, go to the resource
2. Click "Manage deployment token"
3. Copy the token

### 3. Add to GitHub Secrets
1. Go to: https://github.com/alokpandey/jazzx-platform/settings/secrets/actions
2. Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_NEW`
3. Paste the token

---

## Expected Results

After successful recreation:

✅ **Frontend**: Deployed to Azure Static Web Apps  
✅ **API**: Azure Functions properly deployed and accessible  
✅ **Login**: Working with demo credentials  
✅ **Custom Domain**: jazzx.alokpandey.org (if configured)  

---

## Troubleshooting

### If API still doesn't work:
1. Check Azure Portal → Static Web Apps → Functions tab
2. Verify GitHub Actions deployment logs
3. Check that TypeScript compilation succeeded
4. Ensure all function.json files are correct

### If custom domain doesn't work:
1. Check DNS settings
2. Verify SSL certificate provisioning
3. Allow 24-48 hours for DNS propagation

---

## Demo Credentials

**Borrower Login:**
- Email: demo@borrower.com
- Password: Demo123!

**Broker Login:**
- Email: broker@company.com  
- Password: Broker123!
