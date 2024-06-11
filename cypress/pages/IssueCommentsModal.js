import { faker } from "@faker-js/faker";

class IssueCommentsModal {
  constructor() {
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.addingComment = "Add a comment...";
    this.commentText = 'textarea[placeholder="Add a comment..."]';
    this.issueComment = '[data-testid="issue-comment"]';
    this.saveButton = "button:contains('Save')";
    this.editButton = "Edit";
    this.deleteButton = "Delete";
    this.deleteConfirmation = '[data-testid="modal:confirm"]';
    this.confirmationButton = "Delete comment";
    this.comment = faker.lorem.sentence(5);
    this.commentEdited = this.comment + " " + faker.lorem.words(2);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  addComment() {
    this.getIssueDetailModal().within(() => {
      cy.contains(this.addingComment).click();
      cy.get(this.commentText).type(this.comment);
      cy.get(this.saveButton).click().should("not.exist");
      cy.contains(this.addingComment).should("exist");
      cy.get(this.issueComment).should("exist").and("contain", this.comment);
    });
  }

  editComment() {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueComment)
        .first()
        .should("contain", this.comment)
        .contains(this.editButton)
        .click()
        .should("not.exist");
      cy.get(this.commentText)
        .should("contain", this.comment)
        .clear()
        .type(this.commentEdited);
      cy.get(this.saveButton).click().should("not.exist");
      cy.get(this.issueComment).should("contain", this.commentEdited);
    });
  }

  deleteComment() {
    this.getIssueDetailModal().within(() => {
      cy.contains(this.commentEdited).click();
      cy.contains(this.deleteButton).click();
    });
    cy.get(this.deleteConfirmation)
      .should("be.visible")
      .contains(this.confirmationButton)
      .click();
    cy.get(this.deleteConfirmation).should("not.exist");
  }
}
export default new IssueCommentsModal();
