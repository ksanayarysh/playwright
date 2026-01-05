const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');    


test.describe('Login Page Tests', () => {
    test('successful login', async ({ page }) => {
        const loginPage = new LoginPage(page);
    
        await loginPage.open();
        await loginPage.login('tomsmith', 'SuperSecretPassword!');
        
        await expect(loginPage.flashMessage).toContainText(/You logged into a secure area!/);
    });
});
