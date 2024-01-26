const selectors = require("../fixtures/selectors.json");

it("Should show correct number of days", () => {
  cy.visit("/");
  cy.get(selectors.pageNavDay).should("have.length", 7);
});
