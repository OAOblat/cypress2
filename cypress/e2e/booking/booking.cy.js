const selectors = require("../../fixtures/selectors.json");

it("Should be possible to book", () => {
  cy.loginGetAndSaveMoviesData();
  cy.clickRandomPageNavDay();
  cy.selectRandomMovieHallAndTime();
  cy.selectSeatsFromFixture();
  cy.get(selectors.bookingButton).click();

  cy.contains("Вы выбрали билеты:").should("be.visible");
  cy.get("@selectedMovie").then((randomMovie) => {
    cy.checkTicket(selectors.ticketTitle, randomMovie);
  });
  cy.compareSeatsTextWithExpected();
  cy.get("@selectedTime").then((randomTime) => {
    cy.checkTicket(selectors.ticketTime, randomTime);
  });
  cy.get("@selectedHall").then((randomHall) => {
    cy.checkTicket(selectors.ticketHall, randomHall);
  });
});
