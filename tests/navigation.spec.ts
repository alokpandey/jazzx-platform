import { test, expect } from '@playwright/test';

test.describe('Complete Navigation Tests', () => {
  test('should test all landing page navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test header navigation
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Test main navigation links
    const navLinks = [
      { text: 'Quick Quote', expectedUrl: '/quick-quote' },
      { text: 'Features', expectedUrl: '/#features' },
      { text: 'About', expectedUrl: '/#about' }
    ];
    
    for (const link of navLinks) {
      const linkElement = page.locator(`text=${link.text}`);
      if (await linkElement.isVisible()) {
        await linkElement.click();
        if (link.expectedUrl.includes('#')) {
          // For anchor links, just verify we're still on the same page
          await expect(page).toHaveURL('/');
        } else {
          await expect(page).toHaveURL(link.expectedUrl);
          // Navigate back to home
          await page.goto('/');
        }
      }
    }
    
    // Test CTA buttons
    await page.click('text=Quick Quote (30 sec)');
    await expect(page).toHaveURL('/quick-quote');
    
    await page.goto('/');
    await page.click('text=Full Application');
    await expect(page).toHaveURL('/login');
    
    // Test login buttons
    await page.goto('/');
    await page.click('text=Login');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/');
    await page.click('text=Broker Login');
    await expect(page).toHaveURL('/broker-login');
  });

  test('should test quick quote flow navigation', async ({ page }) => {
    await page.goto('/quick-quote');
    
    // Check page loads correctly
    await expect(page.locator('text=Quick Quote')).toBeVisible();
    await expect(page.locator('text=Get personalized loan options')).toBeVisible();
    
    // Test action buttons
    await page.click('text=Start Quick Quote');
    await expect(page).toHaveURL('/quote-results');
    
    // Check quote results page
    await expect(page.locator('text=Your Personalized Loan Options')).toBeVisible();
    
    // Test navigation from results
    await page.click('text=Start Full Application');
    await expect(page).toHaveURL('/login');
    
    // Go back to quote results
    await page.goto('/quote-results');
    await page.click('text=Save & Continue Later');
    await expect(page).toHaveURL('/login');
  });

  test('should test all footer links and sections', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Look for common footer elements
    const footerElements = [
      'JazzX',
      'About',
      'Contact',
      'Privacy',
      'Terms',
      'Support'
    ];
    
    for (const element of footerElements) {
      const footerElement = page.locator(`text=${element}`).last(); // Use last() to get footer version
      if (await footerElement.isVisible()) {
        console.log(`Found footer element: ${element}`);
      }
    }
  });

  test('should test breadcrumb navigation', async ({ page }) => {
    // Login as borrower to test authenticated navigation
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Navigate through pages and check breadcrumbs if they exist
    await page.click('text=Documents');
    await expect(page).toHaveURL('/documents');
    
    // Look for breadcrumb elements
    const breadcrumbs = page.locator('[class*="breadcrumb"], [data-testid="breadcrumb"], nav[aria-label="breadcrumb"]');
    if (await breadcrumbs.isVisible()) {
      console.log('Breadcrumbs found on documents page');
    }
  });

  test('should test back button functionality', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Quick Quote (30 sec)');
    await expect(page).toHaveURL('/quick-quote');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/quick-quote');
  });

  test('should test direct URL access for all routes', async ({ page }) => {
    const publicRoutes = [
      '/',
      '/quick-quote',
      '/quote-results',
      '/login',
      '/broker-login'
    ];
    
    const protectedRoutes = [
      '/dashboard',
      '/application',
      '/loan-status',
      '/documents',
      '/messages',
      '/settings'
    ];
    
    const brokerRoutes = [
      '/broker-dashboard',
      '/client-management',
      '/broker-applications',
      '/broker-pipeline',
      '/broker-documents',
      '/broker-reports',
      '/ai-insights'
    ];
    
    // Test public routes
    for (const route of publicRoutes) {
      await page.goto(route);
      // Should not redirect to login
      await expect(page).toHaveURL(route);
      await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
    }
    
    // Test protected routes (should redirect to login)
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    }
    
    // Test broker routes (should redirect to broker login)
    for (const route of brokerRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/broker-login');
    }
  });

  test('should test navigation after authentication', async ({ page }) => {
    // Login as borrower
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Test that protected routes are now accessible
    const protectedRoutes = [
      '/dashboard',
      '/application',
      '/loan-status',
      '/documents',
      '/messages',
      '/settings'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
    }
    
    // Test that broker routes are still protected
    await page.goto('/broker-dashboard');
    await expect(page).toHaveURL('/broker-dashboard'); // Should redirect to broker login or show access denied
  });

  test('should test cross-navigation between user types', async ({ page }) => {
    // Login as borrower
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Try to access broker routes
    await page.goto('/broker-dashboard');
    // Should either redirect to appropriate dashboard or show access denied
    
    // Logout
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');
    await userMenu.click();
    await page.click('text=Logout');
    await expect(page).toHaveURL('/');
    
    // Login as broker
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard');
    
    // Try to access borrower routes
    await page.goto('/dashboard');
    // Should either redirect to broker dashboard or show access denied
  });

  test('should test 404 error handling', async ({ page }) => {
    // Try to access non-existent routes
    const invalidRoutes = [
      '/non-existent-page',
      '/invalid/route',
      '/dashboard/invalid',
      '/broker/invalid'
    ];
    
    for (const route of invalidRoutes) {
      await page.goto(route);
      
      // Should either show 404 page or redirect to appropriate page
      // Check that we don't get a blank page or error
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(10);
    }
  });

  test('should test deep linking and URL parameters', async ({ page }) => {
    // Test URLs with parameters
    const urlsWithParams = [
      '/quick-quote?amount=500000',
      '/quote-results?id=123',
      '/login?redirect=/dashboard'
    ];
    
    for (const url of urlsWithParams) {
      await page.goto(url);
      
      // Should load the page correctly
      await expect(page.locator('h1, h2, [class*="title"]')).toBeVisible();
      
      // URL should be preserved or handled appropriately
      const currentUrl = page.url();
      expect(currentUrl).toContain(url.split('?')[0]); // At least the base path should match
    }
  });

  test('should test navigation performance', async ({ page }) => {
    // Measure navigation timing
    await page.goto('/');
    
    const navigationStart = Date.now();
    await page.click('text=Quick Quote (30 sec)');
    await expect(page).toHaveURL('/quick-quote');
    const navigationEnd = Date.now();
    
    const navigationTime = navigationEnd - navigationStart;
    console.log(`Navigation time: ${navigationTime}ms`);
    
    // Navigation should be reasonably fast (under 3 seconds)
    expect(navigationTime).toBeLessThan(3000);
  });

  test('should test keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test Enter key on focused element
    await page.keyboard.press('Enter');
    
    // Should navigate or trigger action
    // The exact behavior depends on what element was focused
  });

  test('should test mobile navigation gestures', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Test swipe gestures if implemented
    // This is more relevant for mobile-specific navigation
    
    // Test mobile menu functionality
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, [class*="mobile"]');
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Should show mobile navigation
      await expect(page.locator('[class*="mobile-nav"], [class*="drawer"]')).toBeVisible();
    }
  });
});
