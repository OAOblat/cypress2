const selectors = require("../fixtures/selectors.json");
const admin = require("../fixtures/admin.json");
const seats = require("../fixtures/seats.json");

Cypress.Commands.add("getAndSaveMoviesData", () => {
  const movieData = {};

  cy.get(selectors.movieTitle)
    .each(($el) => {
      let movieTitle = $el.text().trim();
      movieData[movieTitle] = {};

      cy.get(selectors.seancesMovieTitle).each(($movie) => {
        if ($movie.text().trim() === movieTitle) {
          let hallName = $movie
            .parent()
            .parent()
            .parent()
            .find(selectors.seansesMovieHall)
            .text()
            .trim();

          // Находим соответствующий зал в разделе открытия/закрытия продаж
          cy.get(selectors.startSales)
            .contains(hallName)
            .parent()
            .find(selectors.selectHallButton)
            .click({ force: true });

          // Проверяем значение атрибута data-hall-open для зала
          cy.get(selectors.startSalesButton).then(($button) => {
            const hallOpen = $button.attr("data-hall-open");
            if (hallOpen === "1") {
              if (!movieData[movieTitle][hallName]) {
                movieData[movieTitle][hallName] = [];
              }

              // Находим время сеансов и сохраняем их
              cy.get($movie)
                .parent()
                .find(selectors.seancesMovieStart)
                .each(($time) => {
                  movieData[movieTitle][hallName].push($time.text().trim());
                });
            }
          });
        }
      });
    })
    .then(() => {
      const filePath = "cypress/fixtures/movieData.json";
      cy.writeFile(filePath, JSON.stringify(movieData), { log: false });
    });
});

Cypress.Commands.add("loginGetAndSaveMoviesData", () => {
  cy.login(admin.validLogin.email, admin.validLogin.password);
  cy.getAndSaveMoviesData().then(() => {
    cy.visit("http://qamid.tmweb.ru/client/index.php");
  });
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/admin");
  if (email) {
    cy.get(selectors.emailInput).type(email);
  }
  if (password) {
    cy.get(selectors.passwordInput).type(password);
  }
  cy.get(selectors.loginButton).click();
});

Cypress.Commands.add("clickRandomPageNavDay", () => {
  cy.get(selectors.pageNavDay)
    .its("length")
    .then((numOfDays) => {
      const randomDayIndex = Math.floor(Math.random() * (numOfDays - 1)) + 1;
      //cy.get(`a.page-nav__day:nth-of-type(${randomDayIndex})`).click();
      cy.get(selectors.pageNavDay).eq(randomDayIndex).click();
    });
});

Cypress.Commands.add("selectRandomMovieHallAndTime", () => {
  cy.fixture("movieData.json").then((movieData) => {
    const movies = Object.keys(movieData);
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];

    const halls = Object.keys(movieData[randomMovie]);
    const randomHall = halls[Math.floor(Math.random() * halls.length)];

    const timesInHall = movieData[randomMovie][randomHall];
    const randomTime =
      timesInHall[Math.floor(Math.random() * timesInHall.length)];

    cy.wrap(randomMovie).as("selectedMovie");
    cy.wrap(randomTime).as("selectedTime");
    cy.wrap(randomHall).as("selectedHall");

    cy.get(".movie")
      .contains(randomMovie)
      .parent()
      .parent()
      .parent()
      .find(selectors.movieHall)
      .contains(randomHall)
      .parent()
      .find(selectors.movieTime)
      .contains(randomTime)
      .click();
  });
});

Cypress.Commands.add("selectSeatsFromFixture", () => {
  seats.forEach((seat) => {
    cy.get(
      `${selectors.buyingScheme} > :nth-child(${seat.row}) > :nth-child(${seat.seat})`
    ).click();
  });
});

Cypress.Commands.add("checkTicket", (selector, expectedTitle) => {
  cy.get(selector).should("have.text", expectedTitle);
});

Cypress.Commands.add("compareSeatsTextWithExpected", () => {
  cy.get(selectors.ticketChairs)
    .invoke("text")
    .then((text) => {
      const seats = text.split(",").map((seat) => seat.trim());
      cy.fixture("seats.json").then((expectedSeats) => {
        seats.forEach((seat, index) => {
          const { row, seat: expectedSeat } = expectedSeats[index];
          const expectedText = `${row}/${expectedSeat}`;
          expect(seat).to.equal(expectedText);
        });
      });
    });
});
