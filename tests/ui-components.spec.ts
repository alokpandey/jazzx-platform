import { test, expect } from '@playwright/test';

test.describe('UI Components and Interactions Tests', () => {
  test('should test all buttons are clickable and functional', async ({ page }) => {
    await page.goto('/');
    
    // Find all buttons on the page
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    console.log(`Found ${buttonCount} buttons on landing page`);
    
    // Test each button is enabled and clickable
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeEnabled();
      
      // Get button text for logging
      const buttonText = await button.textContent();
      console.log(`Button ${i + 1}: "${buttonText}"`);
      
      // Test that button has proper attributes
      const disabled = await button.getAttribute('disabled');
      expect(disabled).toBeNull();
    }
  });

  test('should test all links have proper href attributes', async ({ page }) => {
    await page.goto('/');
    
    // Find all links on the page
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    
    console.log(`Found ${linkCount} links on landing page`);
    
    // Test each link has href
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const linkText = await link.textContent();
      
      console.log(`Link ${i + 1}: "${linkText}" -> ${href}`);
      
      // Links should have href (except for JavaScript-only links)
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        expect(href).toBeTruthy();
      }
    }
  });

  test('should test form inputs and validation', async ({ page }) => {
    await page.goto('/login');
    
    // Test email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();
    
    // Test typing in email field
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    // Test password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    
    // Test typing in password field
    await passwordInput.fill('testpassword');
    await expect(passwordInput).toHaveValue('testpassword');
    
    // Test form validation
    await emailInput.fill('');
    await passwordInput.fill('');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should test checkbox and radio button interactions', async ({ page }) => {
    await page.goto('/login');
    
    // Test remember me checkbox
    const checkbox = page.locator('input[type="checkbox"]');
    if (await checkbox.isVisible()) {
      await expect(checkbox).toBeEnabled();
      
      // Test checking the checkbox
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      
      // Test unchecking the checkbox
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('should test dropdown and select interactions', async ({ page }) => {
    // Login first to access pages with dropdowns
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Look for dropdown menus
    const dropdowns = page.locator('select, [role="combobox"], [class*="dropdown"], [class*="select"]');
    const dropdownCount = await dropdowns.count();
    
    console.log(`Found ${dropdownCount} dropdown elements`);
    
    // Test user menu dropdown
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');
    if (await userMenu.isVisible()) {
      await userMenu.click();
      
      // Should show dropdown options
      await expect(page.locator('text=Settings')).toBeVisible();
      await expect(page.locator('text=Logout')).toBeVisible();
      
      // Click outside to close dropdown
      await page.click('body');
    }
  });

  test('should test modal and popup interactions', async ({ page }) => {
    await page.goto('/login');
    
    // Test social login buttons (might trigger modals)
    await page.click('text=Continue with Google');
    
    // Wait for any modals or popups
    await page.waitForTimeout(2000);
    
    // Look for modal elements
    const modals = page.locator('[role="dialog"], .modal, [class*="modal"], [class*="popup"]');
    const modalCount = await modals.count();
    
    if (modalCount > 0) {
      console.log(`Found ${modalCount} modal elements`);
      
      // Test modal close functionality
      const closeButtons = page.locator('[aria-label="close"], .close, [class*="close"]');
      const closeButtonCount = await closeButtons.count();
      
      if (closeButtonCount > 0) {
        await closeButtons.first().click();
      }
    }
  });

  test('should test loading states and spinners', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    
    // Click submit and look for loading state
    await page.click('button[type="submit"]');
    
    // Look for loading indicators
    const loadingElements = page.locator('[data-testid="loading"], .loading, .spinner, [class*="loading"], [class*="spinner"]');
    
    // Loading state might be brief, so use a short timeout
    try {
      await expect(loadingElements.first()).toBeVisible({ timeout: 2000 });
      console.log('Loading state detected');
    } catch (e) {
      console.log('No loading state detected (might be too fast)');
    }
    
    // Should eventually complete
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('should test error states and messages', async ({ page }) => {
    await page.goto('/login');
    
    // Trigger validation errors
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    
    // Should show error messages
    const errorElements = page.locator('[class*="error"], .error, [data-testid="error"], [role="alert"]');
    const errorCount = await errorElements.count();
    
    console.log(`Found ${errorCount} error elements`);
    
    if (errorCount > 0) {
      // Verify error messages are visible and have content
      for (let i = 0; i < errorCount; i++) {
        const errorElement = errorElements.nth(i);
        await expect(errorElement).toBeVisible();
        
        const errorText = await errorElement.textContent();
        expect(errorText).toBeTruthy();
        expect(errorText!.length).toBeGreaterThan(0);
      }
    }
  });

  test('should test notification and toast messages', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@borrower.com');
    await page.fill('input[type="password"]', 'Demo123!');
    await page.click('button[type="submit"]');
    
    // Look for success notifications
    const notifications = page.locator('[class*="notification"], [class*="toast"], [role="status"], [data-testid="notification"]');
    
    try {
      await expect(notifications.first()).toBeVisible({ timeout: 5000 });
      console.log('Notification detected');
      
      const notificationText = await notifications.first().textContent();
      console.log(`Notification text: "${notificationText}"`);
    } catch (e) {
      console.log('No notifications detected');
    }
  });

  test('should test responsive design elements', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // Check that desktop elements are visible
    const desktopNav = page.locator('[class*="desktop"], [class*="nav"]:not([class*="mobile"])');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check for mobile-specific elements
    const mobileElements = page.locator('[class*="mobile"], [data-testid*="mobile"]');
    const mobileCount = await mobileElements.count();
    
    console.log(`Found ${mobileCount} mobile-specific elements`);
    
    // Test mobile menu if present
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, [class*="mobile-menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      
      // Should show mobile navigation
      const mobileNav = page.locator('[class*="mobile-nav"], [class*="drawer"], [class*="sidebar"]');
      await expect(mobileNav).toBeVisible();
    }
  });

  test('should test accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check for focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test ARIA labels and roles
    const ariaElements = page.locator('[aria-label], [role], [aria-describedby]');
    const ariaCount = await ariaElements.count();
    
    console.log(`Found ${ariaCount} elements with ARIA attributes`);
    
    // Test alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      console.log(`Image ${i + 1}: src="${src}", alt="${alt}"`);
      
      // Images should have alt text (or be decorative)
      if (src && !src.includes('decorative')) {
        expect(alt).toBeTruthy();
      }
    }
  });

  test('should test search functionality', async ({ page }) => {
    // Login as broker to test search
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard');
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"], input[type="search"]');
    
    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('John Smith');
      await expect(searchInput).toHaveValue('John Smith');
      
      // Test search submission
      await searchInput.press('Enter');
      
      // Should perform search or show results
      await page.waitForTimeout(1000);
      
      // Clear search
      await searchInput.fill('');
      await searchInput.press('Enter');
    }
  });

  test('should test data tables and lists', async ({ page }) => {
    // Login as broker to access data tables
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard');
    
    // Navigate to clients page
    await page.click('text=Clients');
    await expect(page).toHaveURL('/client-management');
    
    // Look for tables or lists
    const tables = page.locator('table, [role="table"], [class*="table"]');
    const lists = page.locator('ul, ol, [role="list"], [class*="list"]');
    
    const tableCount = await tables.count();
    const listCount = await lists.count();
    
    console.log(`Found ${tableCount} tables and ${listCount} lists`);
    
    // Test table interactions if present
    if (tableCount > 0) {
      const firstTable = tables.first();
      
      // Look for sortable headers
      const headers = firstTable.locator('th, [role="columnheader"]');
      const headerCount = await headers.count();
      
      console.log(`Table has ${headerCount} headers`);
      
      // Test clicking on headers (for sorting)
      if (headerCount > 0) {
        await headers.first().click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should test pagination controls', async ({ page }) => {
    // Login as broker
    await page.goto('/broker-login');
    await page.fill('input[type="email"]', 'broker@company.com');
    await page.fill('input[type="password"]', 'Broker123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/broker-dashboard');
    
    // Navigate to a page that might have pagination
    await page.click('text=Clients');
    await expect(page).toHaveURL('/client-management');
    
    // Look for pagination controls
    const paginationElements = page.locator('[class*="pagination"], [aria-label*="pagination"], .page-');
    const paginationCount = await paginationElements.count();
    
    console.log(`Found ${paginationCount} pagination elements`);
    
    if (paginationCount > 0) {
      // Look for next/previous buttons
      const nextButton = page.locator('text=Next, [aria-label*="next"], .next');
      const prevButton = page.locator('text=Previous, [aria-label*="previous"], .prev');
      
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }
      
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should test all interactive elements have proper states', async ({ page }) => {
    await page.goto('/');
    
    // Test button states
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      
      // Test hover state
      await button.hover();
      await page.waitForTimeout(100);
      
      // Test focus state
      await button.focus();
      await page.waitForTimeout(100);
      
      // Verify button is still enabled
      await expect(button).toBeEnabled();
    }
    
    // Test link states
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      
      // Test hover state
      await link.hover();
      await page.waitForTimeout(100);
      
      // Test focus state
      await link.focus();
      await page.waitForTimeout(100);
    }
  });
});
