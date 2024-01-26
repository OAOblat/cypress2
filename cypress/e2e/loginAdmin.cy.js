const selectors = require("../fixtures/selectors.json");
const admin = require("../fixtures/admin.json");

describe("Testing admin login", () => {
  it("Successful admin login", () => {
    cy.login(admin.validLogin.email, admin.validLogin.password);
    cy.get(selectors.adminTitle).should("have.text", "Администраторррская");
  });

  it("Validation error when password is missing", () => {
    cy.login(admin.validLogin.email, null);
    cy.get(selectors.passwordInput).then((elements) => {
      expect(elements[0].checkValidity()).to.be.false;
      expect(elements[0].validationMessage).to.be.eql(
        "Заполните это поле."
      );
    });
  });

  it("Validation error when email is missing", () => {
    cy.login(null, admin.validLogin.password);
    cy.get(selectors.emailInput).then((elements) => {
      expect(elements[0].checkValidity()).to.be.false;
      expect(elements[0].validationMessage).to.be.eql(
        "Заполните это поле."
      );
    });
  });

  it("Validation error with incorrect password", () => {
    cy.login(admin.invalidPassword.email, admin.invalidPassword.password);
    cy.contains("Ошибка авторизации!").should("be.visible");
  });

  it("Validation error with incorrect email", () => {
    cy.fixture("admin").then((admin) => {
      cy.login(admin.invalidEmail.email, admin.invalidEmail.password);
      cy.contains("Ошибка авторизации!").should("be.visible");
    });
  });
});
