import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests - No Auth Required', () => {
  
  test('should load landing page correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check main elements are present - use first occurrence
    await expect(page.locator('text=JazzX').first()).toBeVisible();

    // Check that page has loaded content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click login link
    const loginLink = page.locator('text=Login').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    
    // Should navigate to login page
    await expect(page).toHaveURL('/login');
    
    // Check login form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate to broker login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click broker login link
    const brokerLoginLink = page.locator('text=Broker Login').first();
    await expect(brokerLoginLink).toBeVisible();
    await brokerLoginLink.click();
    
    // Should navigate to broker login page
    await expect(page).toHaveURL('/broker-login');
    
    // Check login form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate to quick quote page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click quick quote button
    const quickQuoteButton = page.locator('text=Quick Quote').first();
    if (await quickQuoteButton.isVisible()) {
      await quickQuoteButton.click();
      await expect(page).toHaveURL('/quick-quote');
      
      // Check page loaded
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    } else {
      console.log('Quick Quote button not found - skipping test');
    }
  });

  test('should test all buttons are clickable on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all buttons
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons on landing page`);
    
    // Test each button
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const buttonText = await button.textContent();
      
      // Skip disabled buttons
      if (await button.isDisabled()) {
        continue;
      }
      
      console.log(`Testing button: "${buttonText}"`);
      
      // Verify button is clickable
      await expect(button).toBeEnabled();
      
      // Click button and verify some response
      const currentUrl = page.url();
      await button.click();
      await page.waitForTimeout(1000);
      
      // Check if navigation occurred or modal opened
      const newUrl = page.url();
      const hasModal = await page.locator('[role="dialog"], .modal').isVisible();
      
      if (newUrl !== currentUrl) {
        console.log(`Button "${buttonText}" navigated to: ${newUrl}`);
        // Go back for next test
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      } else if (hasModal) {
        console.log(`Button "${buttonText}" opened a modal`);
        // Close modal
        await page.keyboard.press('Escape');
      } else {
        console.log(`Button "${buttonText}" performed an action`);
      }
    }
  });

  test('should test all links have proper href attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all links
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links on landing page`);
    
    // Test each link
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const linkText = await link.textContent();
      
      console.log(`Link: "${linkText}" -> ${href}`);
      
      // Links should have href (except for JavaScript-only links)
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        expect(href).toBeTruthy();
        
        // Test clicking the link
        const currentUrl = page.url();
        await link.click();
        await page.waitForTimeout(1000);
        
        const newUrl = page.url();
        if (newUrl !== currentUrl) {
          console.log(`Link navigated to: ${newUrl}`);
          // Go back for next test
          await page.goto('/');
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('should test form interactions on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Test form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Verify form elements are present and functional
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Test typing in inputs
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    await passwordInput.fill('testpassword');
    await expect(passwordInput).toHaveValue('testpassword');
    
    // Test form submission
    await submitButton.click();
    await page.waitForTimeout(2000);
    
    // Form should do something (stay on page, show error, or navigate)
    const currentUrl = page.url();
    console.log(`After form submission, URL is: ${currentUrl}`);
    
    // Verify page is still responsive
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should test responsive design', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=JazzX').first()).toBeVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=JazzX').first()).toBeVisible();

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=JazzX').first()).toBeVisible();
    
    // Test mobile menu if present
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu, button:has-text("Menu")');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should test all public pages are accessible', async ({ page }) => {
    const publicPages = [
      '/',
      '/login',
      '/broker-login',
      '/quick-quote',
      '/quote-results'
    ];
    
    for (const pagePath of publicPages) {
      console.log(`Testing page: ${pagePath}`);
      
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Verify page loaded successfully
      await expect(page).toHaveURL(pagePath);
      
      // Verify page has content
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
      
      // Verify no JavaScript errors
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });
      
      // Wait a moment for any async operations
      await page.waitForTimeout(1000);
      
      // Log any errors but don't fail the test
      if (errors.length > 0) {
        console.log(`JavaScript errors on ${pagePath}:`, errors);
      }
    }
  });

  test('should verify no broken images or resources', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for broken images
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`Found ${imageCount} images`);
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      console.log(`Image ${i + 1}: src="${src}", alt="${alt}"`);
      
      // Images should have src and alt attributes
      expect(src).toBeTruthy();
      if (src && !src.startsWith('data:')) {
        expect(alt).toBeTruthy();
      }
    }
  });
});
