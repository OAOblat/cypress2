const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "5sqi7d",
  e2e: {
    video: true,
    baseUrl: "http://qamid.tmweb.ru",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
