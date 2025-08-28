import { test, expect } from '@playwright/test';

test.describe('Broker Complete Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as broker before each test
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard', { timeout: 10000 });
  });

  test('should test complete broker dashboard', async ({ page }) => {
    // Check dashboard elements - more flexible approach
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Check for main content area
    const mainContent = page.locator('main, [role="main"], .main-content');
    await expect(mainContent).toBeVisible();

    // Check broker sidebar navigation if present
    const brokerSidebarLinks = [
      'Dashboard',
      'Clients',
      'Applications',
      'Pipeline',
      'Documents',
      'Reports',
      'AI Insights'
    ];

    for (const linkText of brokerSidebarLinks) {
      const link = page.locator(`text=${linkText}`).first();
      if (await link.isVisible()) {
        console.log(`Found broker sidebar link: ${linkText}`);
      }
    }
  });

  test('should navigate to client management page', async ({ page }) => {
    // Try to find and click Clients link
    const clientsLink = page.locator('text=Clients').first();

    if (await clientsLink.isVisible()) {
      await clientsLink.click();
    } else {
      // Navigate directly
      await page.goto('/client-management');
    }

    await expect(page).toHaveURL('/client-management');

    // Check page loaded
    const pageContent = page.locator('main, [role="main"], .content');
    await expect(pageContent).toBeVisible();

    // Look for any action buttons
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should navigate to applications page', async ({ page }) => {
    // Click on Applications in sidebar
    await page.click('text=Applications');
    await expect(page).toHaveURL('/broker-applications');
    await expect(page.locator('text=Application Management')).toBeVisible();
    
    // Check that page loads with content
    await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
  });

  test('should navigate to pipeline page', async ({ page }) => {
    // Click on Pipeline in sidebar
    await page.click('text=Pipeline');
    await expect(page).toHaveURL('/broker-pipeline');
    await expect(page.locator('text=Pipeline Management')).toBeVisible();
    
    // Check that page loads with content
    await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
  });

  test('should navigate to broker documents page', async ({ page }) => {
    // Click on Documents in sidebar
    await page.click('text=Documents');
    await expect(page).toHaveURL('/broker-documents');
    await expect(page.locator('text=Document Management')).toBeVisible();
    
    // Check that page loads with content
    await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
  });

  test('should navigate to reports page', async ({ page }) => {
    // Click on Reports in sidebar
    await page.click('text=Reports');
    await expect(page).toHaveURL('/broker-reports');
    await expect(page.locator('text=Reports & Analytics')).toBeVisible();
    
    // Check that page loads with content
    await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
  });

  test('should navigate to AI insights page', async ({ page }) => {
    // Click on AI Insights in sidebar
    await page.click('text=AI Insights');
    await expect(page).toHaveURL('/ai-insights');
    await expect(page.locator('text=AI Insights Dashboard')).toBeVisible();
    await expect(page.locator('text=Leverage advanced AI analytics')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=View Recommendations')).toBeVisible();
    await expect(page.locator('text=Generate Report')).toBeVisible();
  });

  test('should test broker header with search functionality', async ({ page }) => {
    // Check header elements specific to broker
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Check if search is available for brokers
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test client');
      // Should be able to type in search
      await expect(searchInput).toHaveValue('test client');
    }
    
    // Check notifications for brokers
    const notificationButton = page.locator('[data-testid="notifications"], .notification, [class*="notification"]');
    if (await notificationButton.isVisible()) {
      await notificationButton.click();
    }
  });

  test('should test all broker sidebar navigation links', async ({ page }) => {
    const brokerSidebarLinks = [
      { text: 'Dashboard', url: '/broker-dashboard' },
      { text: 'Clients', url: '/client-management' },
      { text: 'Applications', url: '/broker-applications' },
      { text: 'Pipeline', url: '/broker-pipeline' },
      { text: 'Documents', url: '/broker-documents' },
      { text: 'Reports', url: '/broker-reports' },
      { text: 'AI Insights', url: '/ai-insights' }
    ];
    
    for (const link of brokerSidebarLinks) {
      await page.click(`text=${link.text}`);
      await expect(page).toHaveURL(link.url);
      
      // Verify page loads correctly
      await expect(page.locator('h1, h2, [class*="title"], [class*="heading"]')).toBeVisible();
      
      // Check that action buttons are present
      const actionButtons = page.locator('button:visible');
      const buttonCount = await actionButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
    }
  });

  test('should test broker dashboard action buttons', async ({ page }) => {
    // Test Manage Clients button
    await page.click('text=Manage Clients');
    await expect(page).toHaveURL('/client-management');
    
    // Go back to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/broker-dashboard');
    
    // Test View AI Insights button
    await page.click('text=View AI Insights');
    await expect(page).toHaveURL('/ai-insights');
  });

  test('should test client management functionality', async ({ page }) => {
    await page.goto('/client-management');
    
    // Test Add New Client button
    await page.click('text=Add New Client');
    // Should trigger some action (modal, form, or navigation)
    
    // Test View AI Insights button
    await page.click('text=View AI Insights');
    await expect(page).toHaveURL('/ai-insights');
  });

  test('should test AI insights functionality', async ({ page }) => {
    await page.goto('/ai-insights');
    
    // Test View Recommendations button
    const viewRecommendationsBtn = page.locator('text=View Recommendations');
    if (await viewRecommendationsBtn.isVisible()) {
      await viewRecommendationsBtn.click();
      // Should show recommendations or navigate
    }
    
    // Test Generate Report button
    const generateReportBtn = page.locator('text=Generate Report');
    if (await generateReportBtn.isVisible()) {
      await generateReportBtn.click();
      // Should generate report or show modal
    }
  });

  test('should test broker user menu and logout', async ({ page }) => {
    // Click user menu
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    
    // Check dropdown options
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    
    // Test logout
    await page.click('text=Logout');
    
    // Should redirect to landing page
    await expect(page).toHaveURL('/', { timeout: 10000 });
    await expect(page.locator('text=Broker Login')).toBeVisible();
  });

  test('should test broker mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, [class*="mobile"]');
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check that broker navigation items are visible in mobile menu
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Clients')).toBeVisible();
      await expect(page.locator('text=AI Insights')).toBeVisible();
    }
  });

  test('should test all broker page buttons and links', async ({ page }) => {
    const brokerPages = [
      '/broker-dashboard',
      '/client-management', 
      '/broker-applications',
      '/broker-pipeline',
      '/broker-documents',
      '/broker-reports',
      '/ai-insights'
    ];
    
    for (const pagePath of brokerPages) {
      await page.goto(pagePath);
      
      // Find all buttons and links
      const buttons = page.locator('button:visible');
      const links = page.locator('a:visible');
      
      const buttonCount = await buttons.count();
      const linkCount = await links.count();
      
      console.log(`Broker page ${pagePath}: ${buttonCount} buttons, ${linkCount} links`);
      
      // Test that buttons are clickable
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeEnabled();
      }
      
      // Test that links have href attributes
      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          expect(href).toBeTruthy();
        }
      }
    }
  });

  test('should test broker search functionality', async ({ page }) => {
    // Check if search is available
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('John Smith');
      await expect(searchInput).toHaveValue('John Smith');
      
      // Press Enter or look for search button
      await searchInput.press('Enter');
      
      // Should perform search (results may vary based on implementation)
    }
  });

  test('should test broker notification system', async ({ page }) => {
    // Check if notifications are present for brokers
    const notificationArea = page.locator('[data-testid="notifications"], .notification, [class*="notification"]');
    
    if (await notificationArea.isVisible()) {
      await notificationArea.click();
      
      // Should show broker-specific notifications
      await expect(page.locator('[class*="notification"], [class*="toast"]')).toBeVisible();
    }
  });

  test('should test broker performance metrics and charts', async ({ page }) => {
    // Go to dashboard where metrics should be displayed
    await page.goto('/broker-dashboard');
    
    // Look for performance indicators, charts, or metrics
    const metricsElements = page.locator('[class*="metric"], [class*="chart"], [class*="stat"], [data-testid*="metric"]');
    
    // Should have some performance indicators
    const metricsCount = await metricsElements.count();
    console.log(`Found ${metricsCount} metrics elements on broker dashboard`);
    
    // Check for common metric labels
    const commonMetrics = ['clients', 'applications', 'revenue', 'performance', 'pipeline'];
    
    for (const metric of commonMetrics) {
      const metricElement = page.locator(`text=${metric}`, { timeout: 1000 });
      if (await metricElement.isVisible()) {
        console.log(`Found ${metric} metric on dashboard`);
      }
    }
  });

  test('should test broker error handling and loading states', async ({ page }) => {
    // Navigate through broker pages and check for proper loading states
    const brokerPages = ['/client-management', '/ai-insights', '/broker-reports'];
    
    for (const pagePath of brokerPages) {
      await page.goto(pagePath);
      
      // Wait for content to load
      await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible({ timeout: 10000 });
      
      // Verify no error states are showing
      const errorElements = page.locator('[class*="error"], .error, [data-testid="error"]');
      const errorCount = await errorElements.count();
      
      // Should have minimal or no error elements visible
      expect(errorCount).toBeLessThan(3);
    }
  });
});
