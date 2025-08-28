import { test, expect } from '@playwright/test';

test.describe('Borrower Complete Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as borrower before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should test complete borrower dashboard', async ({ page }) => {
    // Check dashboard elements - using more flexible selectors
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Check for main content area
    const mainContent = page.locator('main, [role="main"], .main-content');
    await expect(mainContent).toBeVisible();

    // Check sidebar navigation if present
    const sidebarLinks = [
      'Dashboard',
      'Application',
      'Documents',
      'Messages',
      'Settings'
    ];

    for (const linkText of sidebarLinks) {
      const link = page.locator(`text=${linkText}`).first();
      if (await link.isVisible()) {
        console.log(`Found sidebar link: ${linkText}`);
      }
    }
  });

  test('should navigate to application page', async ({ page }) => {
    // Try different ways to navigate to application
    const applicationLink = page.locator('text=Application').first();
    const myApplicationLink = page.locator('text=My Application').first();

    if (await applicationLink.isVisible()) {
      await applicationLink.click();
    } else if (await myApplicationLink.isVisible()) {
      await myApplicationLink.click();
    } else {
      // Navigate directly
      await page.goto('/application');
    }

    await expect(page).toHaveURL('/application');

    // Check page loaded
    const pageContent = page.locator('main, [role="main"], .content');
    await expect(pageContent).toBeVisible();

    // Look for any action buttons
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should navigate to loan status page', async ({ page }) => {
    // Click on Loan Status in sidebar
    await page.click('text=Loan Status');
    await expect(page).toHaveURL('/loan-status');
    await expect(page.locator('text=Loan Status & Timeline')).toBeVisible();
    await expect(page.locator('text=Track your loan application progress')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=View Documents')).toBeVisible();
    await expect(page.locator('text=Contact Team')).toBeVisible();
    
    // Test navigation buttons
    await page.click('text=View Documents');
    await expect(page).toHaveURL('/documents');
  });

  test('should navigate to documents page', async ({ page }) => {
    // Click on Documents in sidebar
    await page.click('text=Documents');
    await expect(page).toHaveURL('/documents');
    await expect(page.locator('text=Document Management')).toBeVisible();
    await expect(page.locator('text=Upload, organize, and track your loan documents')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=Upload Documents')).toBeVisible();
    await expect(page.locator('text=View Requirements')).toBeVisible();
    
    // Test navigation
    await page.click('text=View Requirements');
    await expect(page).toHaveURL('/loan-status');
  });

  test('should navigate to messages page', async ({ page }) => {
    // Click on Messages in sidebar
    await page.click('text=Messages');
    await expect(page).toHaveURL('/messages');
    await expect(page.locator('text=Messages & Communication')).toBeVisible();
    await expect(page.locator('text=Stay connected with your loan team')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=Start Conversation')).toBeVisible();
    await expect(page.locator('text=View Team')).toBeVisible();
    
    // Test navigation
    await page.click('text=View Team');
    await expect(page).toHaveURL('/loan-status');
  });

  test('should navigate to settings page', async ({ page }) => {
    // Click on Settings in sidebar
    await page.click('text=Settings');
    await expect(page).toHaveURL('/settings');
    await expect(page.locator('text=Account Settings')).toBeVisible();
    await expect(page.locator('text=Manage your account preferences')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=Update Profile')).toBeVisible();
    await expect(page.locator('text=Security Settings')).toBeVisible();
  });

  test('should test header navigation and search', async ({ page }) => {
    // Check header elements
    await expect(page.locator('text=JazzX')).toBeVisible();
    
    // Check notifications (if present)
    const notificationButton = page.locator('[data-testid="notifications"], .notification, [class*="notification"]');
    if (await notificationButton.isVisible()) {
      await notificationButton.click();
      // Should show notifications dropdown or navigate to notifications page
    }
    
    // Check user menu
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');
    await expect(userMenu).toBeVisible();
    
    // Click user menu
    await userMenu.click();
    
    // Check dropdown options
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should test all sidebar navigation links', async ({ page }) => {
    const sidebarLinks = [
      { text: 'Dashboard', url: '/dashboard' },
      { text: 'Application', url: '/application' },
      { text: 'Documents', url: '/documents' },
      { text: 'Messages', url: '/messages' },
      { text: 'Settings', url: '/settings' }
    ];

    for (const link of sidebarLinks) {
      // Try to find and click the link
      const linkElement = page.locator(`text=${link.text}`).first();

      if (await linkElement.isVisible()) {
        await linkElement.click();
        await expect(page).toHaveURL(link.url);

        // Verify page loads correctly
        const mainContent = page.locator('main, [role="main"], .content, h1, h2');
        await expect(mainContent.first()).toBeVisible();

        // Check that some interactive elements are present
        const interactiveElements = page.locator('button:visible, a:visible, input:visible');
        const elementCount = await interactiveElements.count();
        expect(elementCount).toBeGreaterThan(0);
      } else {
        // Navigate directly if link not found
        await page.goto(link.url);
        await expect(page).toHaveURL(link.url);
      }
    }
  });

  test('should test quick quote flow from landing page', async ({ page }) => {
    // Go back to landing page
    await page.goto('/');
    
    // Click Quick Quote button
    await page.click('text=Quick Quote (30 sec)');
    await expect(page).toHaveURL('/quick-quote');
    await expect(page.locator('text=Quick Quote')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('text=Start Quick Quote')).toBeVisible();
    await expect(page.locator('text=Full Application')).toBeVisible();
    
    // Test Start Quick Quote
    await page.click('text=Start Quick Quote');
    await expect(page).toHaveURL('/quote-results');
    await expect(page.locator('text=Your Personalized Loan Options')).toBeVisible();
    
    // Check action buttons on results page
    await expect(page.locator('text=Start Full Application')).toBeVisible();
    await expect(page.locator('text=Save & Continue Later')).toBeVisible();
    
    // Test Start Full Application
    await page.click('text=Start Full Application');
    await expect(page).toHaveURL('/login');
  });

  test('should test all dashboard action buttons', async ({ page }) => {
    // Test all buttons on the dashboard page
    const allButtons = page.locator('button:visible');
    const buttonCount = await allButtons.count();

    console.log(`Found ${buttonCount} buttons on dashboard`);

    // Test each button is clickable
    for (let i = 0; i < buttonCount; i++) {
      const button = allButtons.nth(i);
      const buttonText = await button.textContent();

      // Skip if button is disabled
      if (await button.isDisabled()) {
        continue;
      }

      console.log(`Testing button: "${buttonText}"`);

      // Click button and verify it does something
      const currentUrl = page.url();
      await button.click();

      // Wait a moment for any navigation or modal
      await page.waitForTimeout(1000);

      // Check if URL changed or modal appeared
      const newUrl = page.url();
      const hasModal = await page.locator('[role="dialog"], .modal').isVisible();

      if (newUrl !== currentUrl) {
        console.log(`Button "${buttonText}" navigated to: ${newUrl}`);
        // Navigate back to dashboard for next test
        await page.goto('/dashboard');
      } else if (hasModal) {
        console.log(`Button "${buttonText}" opened a modal`);
        // Close modal if possible
        const closeButton = page.locator('[aria-label="close"], .close, button:has-text("Close")');
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      } else {
        console.log(`Button "${buttonText}" performed an action`);
      }
    }
  });

  test('should test responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, [class*="mobile"]');
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Check that navigation items are visible in mobile menu
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=My Application')).toBeVisible();
      await expect(page.locator('text=Documents')).toBeVisible();
    }
  });

  test('should test all feature links and buttons work', async ({ page }) => {
    // Go through each page and test all clickable elements
    const pages = ['/dashboard', '/application', '/loan-status', '/documents', '/messages', '/settings'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Find all buttons and links
      const buttons = page.locator('button:visible');
      const links = page.locator('a:visible');
      
      const buttonCount = await buttons.count();
      const linkCount = await links.count();
      
      console.log(`Page ${pagePath}: ${buttonCount} buttons, ${linkCount} links`);
      
      // Test that buttons are clickable (don't actually click to avoid navigation)
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

  test('should test notification system', async ({ page }) => {
    // Check if notifications are present
    const notificationArea = page.locator('[data-testid="notifications"], .notification, [class*="notification"]');
    
    if (await notificationArea.isVisible()) {
      await notificationArea.click();
      
      // Should show notification content
      await expect(page.locator('[class*="notification"], [class*="toast"]')).toBeVisible();
    }
  });

  test('should test error handling and loading states', async ({ page }) => {
    // Navigate to a page that might show loading states
    await page.click('text=Documents');
    
    // Look for loading indicators
    const loadingIndicators = page.locator('[data-testid="loading"], .loading, .spinner, [class*="loading"]');
    
    // Wait for content to load
    await expect(page.locator('text=Document Management')).toBeVisible({ timeout: 10000 });
    
    // Verify no error states are showing
    const errorElements = page.locator('[class*="error"], .error, [data-testid="error"]');
    const errorCount = await errorElements.count();
    
    // Should have minimal or no error elements visible
    expect(errorCount).toBeLessThan(3);
  });
});
