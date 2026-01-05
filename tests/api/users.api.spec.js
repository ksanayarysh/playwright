const { test, expect } = require('@playwright/test');

test.describe('User API Tests', () => {
    test('GET user list', async ( { request } ) => {
        const response = await request.get('https://jsonplaceholder.typicode.com/users');

        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(users.length).toBeGreaterThan(0);
        expect(users[0]).toHaveProperty('email');
    });
});