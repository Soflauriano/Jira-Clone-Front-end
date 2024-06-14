class TimeTrackingModal {
  constructor() {
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.descriptionField = ".ql-editor";
    this.submitButton = 'button[type="submit"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.issueSuccess = "Issue has been successfully created.";
    this.closeDetailModalButton = '[data-testid="icon:close"]';
    this.originalEstimateHours = 'input[placeholder="Number"]';
    this.noTimeLogged = "No time logged";
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.timeTrackingIcon = '[data-testid="icon:stopwatch"]';
    this.timeSpent = 'input[placeholder="Number"]';
    this.timeRemaining = 'input[placeholder="Number"]';
    this.doneButton = 'button:contains("Done")';
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  inputDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  inputTitle(title) {
    cy.get(this.title).type(title);
  }
  //Create a new issue for time tracking
  createIssue(description, title) {
    this.getIssueModal().within(() => {
      this.inputDescription(description);
      this.inputTitle(title);

      cy.get(this.submitButton).click();
    });
  }
  ensureIssueIsCreated(expectedAmountOfIssues, title) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains(this.issueSuccess).should("not.exist");
    cy.get(this.backlogList)
      .should("be.visible")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountOfIssues)
          .first()
          .find("p")
          .contains(title);
      });
  }
  //This is the method that creates and validates the issue
  createIssueAndAssert(description, title, expectedAmountOfIssues) {
    this.createIssue(description, title);
    this.ensureIssueIsCreated(expectedAmountOfIssues, title);
  }

  openCreatedIssue(title) {
    cy.get(this.backlogList).contains(title).click({ force: true });
  }

  closeIssue() {
    cy.get(this.closeIssueModalButton).first().click({ force: true });
  }
  //Time Estimation Functionality
  //Edit issue adding estimation hours
  addEstimation(title) {
    cy.get(this.backlogList).contains(title).click();
    cy.contains(title, { timeout: 10000 }).should("be.visible");
    cy.get(this.issueDetailModal, { timeout: 60000 }).within(() => {
      cy.contains(this.noTimeLogged).should("exist");
      cy.get(this.originalEstimateHours).type("10").wait(1000);
      cy.get(this.closeDetailModalButton).click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }
  //Check estimation hours are saved
  confirmEstimationHoursAdded() {
    cy.reload();
    cy.get(this.issuesList).first().click();
    cy.get(this.issueDetailModal).within(() => {
      cy.get(this.originalEstimateHours).should("have.value", "10");
      cy.get(this.closeDetailModalButton).first().click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }

  //Editing estimation hours and check the update
  editEstimationHours() {
    cy.get(this.issuesList).first().click();
    cy.get(this.issueDetailModal, { timeout: 60000 }).within(() => {
      cy.get(this.originalEstimateHours).clear().type("20").wait(1000);
      cy.get(this.closeDetailModalButton).click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }
  confirmEstimationHoursUpdated() {
    cy.get(this.issuesList).first().click();
    cy.get(this.issueDetailModal).within(() => {
      cy.get(this.originalEstimateHours).should("have.value", "20");
      cy.get(this.closeDetailModalButton).click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }
  //Deleting estimation hours and check the value is removed
  deleteEstimationHours() {
    cy.get(this.issuesList).first().click();
    cy.get(this.issueDetailModal, { timeout: 60000 }).within(() => {
      cy.get(this.originalEstimateHours).clear().wait(1000);
      cy.get(this.closeDetailModalButton).click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }
  confirmEstimationHoursDeleted() {
    cy.get(this.issuesList).first().click();
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(this.noTimeLogged).should("be.visible");
      cy.get(this.closeDetailModalButton).first().click();
      cy.get(this.issueDetailModal).should("not.exist");
    });
  }

  //Logging spent time and remaining time and confirming the visibility//
  logTimeTracking(title) {
    cy.get(this.backlogList).contains(title).click();
    cy.get(this.issueDetailModal, { timeout: 60000 }).within(() => {
      cy.get(this.timeTrackingIcon).click();
    });
    cy.get(this.timeTrackingModal).within(() => {
      cy.get(this.timeSpent).eq(0).clear().type("2").wait(1000);
      cy.get(this.timeRemaining).eq(1).clear().type("5").wait(1000);
      cy.get(this.doneButton).click();
    });
    cy.contains(this.noTimeLogged).should("not.exist");
    cy.get(this.closeDetailModalButton).click();
  }

  ensureTimeLogged(title, spentTime, remainingTime) {
    cy.get(this.backlogList).contains(title).click();
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(`${spentTime}h logged`).should("be.visible");
      cy.contains(`${remainingTime}h remaining`).should("be.visible");
    });
  }

  //Removing the logged time for both spent and remaining and confirming the removal//
  removeLoggedTime(title) {
    cy.get(this.backlogList).contains(title).click({ force: true });
    cy.get(this.issueDetailModal).within(() => {
      cy.get(this.timeTrackingIcon).click();
    });
    cy.get(this.timeTrackingModal).within(() => {
      cy.get(this.timeSpent).eq(0).clear().should("have.attr", "value", "");
      cy.get(this.timeRemaining).eq(1).clear().should("have.attr", "value", "");
      cy.get(this.doneButton).click();
    });
  }
  ensureTimeRemoved(title) {
    cy.get(this.backlogList).contains(title).click({ force: true });
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(this.noTimeLogged).should("exist");
      cy.get(this.closeDetailModalButton).first().click();
    });
  }
}

export default new TimeTrackingModal();
