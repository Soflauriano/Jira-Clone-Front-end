import TimeTrackingModal from "../../pages/TimeTrackingModal";
import { faker } from "@faker-js/faker";

describe("Issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });
  const issueDetails = {
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(4),
  };
  const expectedAmountIssues = 5;
  const timeSpent = 2;
  const timeRemaining = 5;

  it("Should add, edit and remove time estimation successfully", () => {
    TimeTrackingModal.createIssueAndAssert(
      issueDetails.description,
      issueDetails.title,
      expectedAmountIssues
    );
    TimeTrackingModal.addEstimation(issueDetails.title);
    TimeTrackingModal.confirmEstimationHoursAdded();
    TimeTrackingModal.editEstimationHours();
    TimeTrackingModal.confirmEstimationHoursUpdated();
    TimeTrackingModal.deleteEstimationHours();
    TimeTrackingModal.confirmEstimationHoursDeleted();
  });

  it("Should log and remove time successfully", () => {
    TimeTrackingModal.createIssueAndAssert(
      issueDetails.description,
      issueDetails.title,
      expectedAmountIssues
    );
    TimeTrackingModal.logTimeTracking(issueDetails.title);
    TimeTrackingModal.ensureTimeLogged(
      issueDetails.title,
      timeSpent,
      timeRemaining
    );
    TimeTrackingModal.removeLoggedTime(issueDetails.title);
    TimeTrackingModal.ensureTimeRemoved(issueDetails.title);
  });
});
