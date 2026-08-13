const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 10000,
    reuseExistingServer: true,
  },
  reporter: [['html', { open: 'never' }], ['list']],
});
