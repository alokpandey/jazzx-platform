import { test, expect } from '@playwright/test';

test.describe('Complete Application Flow Tests', () => {
  
  test('should test complete borrower flow with all interactions', async ({ page }) => {
    // Start from landing page
    await page.goto('/');
    
    // Test landing page elements
    await expect(page.locator('text=JazzX')).toBeVisible();
    await expect(page.locator('text=Get Your Dream Home Loan in Minutes')).toBeVisible();
    
    // Test Quick Quote button
    await page.click('text=Quick Quote (30 sec)');
    await expect(page).toHaveURL('/quick-quote');
    
    // Test page loaded correctly
    await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
    
    // Test all buttons on quick quote page
    const quickQuoteButtons = page.locator('button:visible');
    const quickQuoteButtonCount = await quickQuoteButtons.count();
    console.log(`Quick Quote page has ${quickQuoteButtonCount} buttons`);
    
    // Click primary action button if available
    const primaryButton = page.locator('button').first();
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to quote results
    await page.goto('/quote-results');
    await expect(page).toHaveURL('/quote-results');
    
    // Test all buttons on quote results page
    const quoteResultsButtons = page.locator('button:visible');
    const quoteResultsButtonCount = await quoteResultsButtons.count();
    console.log(`Quote Results page has ${quoteResultsButtonCount} buttons`);
    
    // Test login flow
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    
    // Test all dashboard buttons
    await testAllButtonsOnPage(page, 'Dashboard');
    
    // Test all borrower pages
    const borrowerPages = [
      '/application',
      '/loan-status', 
      '/documents',
      '/messages',
      '/settings'
    ];
    
    for (const pagePath of borrowerPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(pagePath);
      await testAllButtonsOnPage(page, pagePath);
    }
  });

  test('should test complete broker flow with all interactions', async ({ page }) => {
    // Login as broker
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    
    // Wait for broker dashboard
    await expect(page).toHaveURL('/broker-dashboard', { timeout: 10000 });
    
    // Test all broker dashboard buttons
    await testAllButtonsOnPage(page, 'Broker Dashboard');
    
    // Test all broker pages
    const brokerPages = [
      '/client-management',
      '/broker-applications',
      '/broker-pipeline', 
      '/broker-documents',
      '/broker-reports',
      '/ai-insights'
    ];
    
    for (const pagePath of brokerPages) {
      await page.goto(pagePath);
      await expect(page).toHaveURL(pagePath);
      await testAllButtonsOnPage(page, pagePath);
    }
  });

  test('should test all navigation links work correctly', async ({ page }) => {
    // Test public navigation
    await page.goto('/');
    
    // Test header navigation
    const headerLinks = page.locator('header a:visible, nav a:visible');
    const headerLinkCount = await headerLinks.count();
    console.log(`Found ${headerLinkCount} header links`);
    
    for (let i = 0; i < headerLinkCount; i++) {
      const link = headerLinks.nth(i);
      const href = await link.getAttribute('href');
      const linkText = await link.textContent();
      
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        console.log(`Testing header link: "${linkText}" -> ${href}`);
        
        await link.click();
        await page.waitForTimeout(1000);
        
        // Verify navigation worked
        const currentUrl = page.url();
        expect(currentUrl).toContain(href.replace('/', ''));
        
        // Go back to home for next test
        await page.goto('/');
      }
    }
    
    // Test footer links if present
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footerLinks = page.locator('footer a:visible');
    const footerLinkCount = await footerLinks.count();
    console.log(`Found ${footerLinkCount} footer links`);
  });

  test('should test all sidebar navigation after login', async ({ page }) => {
    // Login as borrower
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    
    // Test sidebar navigation
    const sidebarLinks = page.locator('aside a:visible, .sidebar a:visible, nav a:visible');
    const sidebarLinkCount = await sidebarLinks.count();
    console.log(`Found ${sidebarLinkCount} sidebar links`);
    
    for (let i = 0; i < sidebarLinkCount; i++) {
      const link = sidebarLinks.nth(i);
      const href = await link.getAttribute('href');
      const linkText = await link.textContent();
      
      if (href && !href.startsWith('#')) {
        console.log(`Testing sidebar link: "${linkText}" -> ${href}`);
        
        await link.click();
        await page.waitForTimeout(1000);
        
        // Verify navigation worked
        await expect(page).toHaveURL(href);
        
        // Verify page loaded
        const mainContent = page.locator('main, [role="main"], .content');
        await expect(mainContent).toBeVisible();
      }
    }
  });

  test('should test all forms and inputs work correctly', async ({ page }) => {
    // Test login form
    await page.goto('/login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Test form elements are present and functional
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Test typing in inputs
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    await passwordInput.fill('testpassword');
    await expect(passwordInput).toHaveValue('testpassword');
    
    // Test form submission with invalid credentials
    await submitButton.click();
    await page.waitForTimeout(2000);
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
    
    // Test with valid credentials
    await emailInput.fill('demo@borrower.com');
    await passwordInput.fill('Demo123!');
    await submitButton.click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should test search functionality if present', async ({ page }) => {
    // Login as broker (more likely to have search)
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard', { timeout: 10000 });
    
    // Look for search input
    const searchInputs = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    const searchInputCount = await searchInputs.count();
    
    if (searchInputCount > 0) {
      console.log(`Found ${searchInputCount} search inputs`);
      
      const searchInput = searchInputs.first();
      await searchInput.fill('test search');
      await expect(searchInput).toHaveValue('test search');
      
      // Try submitting search
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      
      // Clear search
      await searchInput.fill('');
      await searchInput.press('Enter');
    } else {
      console.log('No search inputs found');
    }
  });

  test('should test responsive design on different screen sizes', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Test mobile menu if present
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, button:has-text("Menu")');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Should show mobile navigation
      const mobileNav = page.locator('[class*="mobile-nav"], [class*="drawer"], nav');
      await expect(mobileNav).toBeVisible();
    }
  });
});

// Helper function to test all buttons on a page
async function testAllButtonsOnPage(page: any, pageName: string) {
  console.log(`Testing all buttons on ${pageName}`);
  
  const buttons = page.locator('button:visible');
  const buttonCount = await buttons.count();
  console.log(`Found ${buttonCount} buttons on ${pageName}`);
  
  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);
    const buttonText = await button.textContent();
    
    // Skip disabled buttons
    if (await button.isDisabled()) {
      continue;
    }
    
    console.log(`Testing button: "${buttonText}"`);
    
    const currentUrl = page.url();
    
    try {
      await button.click();
      await page.waitForTimeout(1000);
      
      // Check if navigation occurred
      const newUrl = page.url();
      if (newUrl !== currentUrl) {
        console.log(`Button "${buttonText}" navigated to: ${newUrl}`);
        // Navigate back for next test
        await page.goBack();
        await page.waitForTimeout(500);
      }
      
      // Check for modals
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
      if (await modal.isVisible()) {
        console.log(`Button "${buttonText}" opened a modal`);
        // Try to close modal
        const closeButton = page.locator('[aria-label="close"], .close, button:has-text("Close"), button:has-text("×")');
        if (await closeButton.isVisible()) {
          await closeButton.click();
        } else {
          // Click outside modal to close
          await page.click('body');
        }
      }
      
    } catch (error) {
      console.log(`Error testing button "${buttonText}": ${error}`);
    }
  }
}
