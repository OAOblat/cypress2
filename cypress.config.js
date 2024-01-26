const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "krf2s6",
  e2e: {
    video: true,
    baseUrl: "http://qamid.tmweb.ru",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
