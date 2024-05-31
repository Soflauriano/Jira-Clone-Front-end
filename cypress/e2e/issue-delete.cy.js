describe("Issue delete", () => {
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  //Assignment 3 - Issue Deletion -
  it("Should successfully delete an issue", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.get("button").contains("Delete issue").click();
      });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains("This is an issue of type: Task.").should("not.exist");
    });
  });

  it("Should initiate to delete an issue and then cancel the deletion", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.get("button").contains("Cancel").click();
      });

    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains("This is an issue of type: Task.").should("be.visible");
    });
  });
});
