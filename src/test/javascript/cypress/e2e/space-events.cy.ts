import {
    titleLoginSelector,
    errorLoginSelector,
    usernameLoginSelector,
    passwordLoginSelector,
    submitLoginSelector,
  } from '../support/commands';

  import {
    entityTableSelector,
    entityCreateButtonSelector,
    entityCreateSaveButtonSelector,
  } from '../support/entity';
  describe('login modal', () => {
    const username = Cypress.env('E2E_USERNAME') ?? 'user';
    const password = Cypress.env('E2E_PASSWORD') ?? 'user';
    const spaceEventsUrl = new RegExp('/space-event(\\?.*)?$');

  
    beforeEach(() => {
      cy.visit('');
      cy.clickOnLoginItem();
    });
  
    beforeEach(() => {
        cy.intercept('GET', '/api/space-events+(?*|)').as('entitiesRequest');       
        cy.intercept('POST', '/api/authenticate').as('authenticate');
    });
  
    beforeEach(() => {
      cy.login(username, password);
    });
    it('Carga space event', () => {

        cy.visit('/');
        cy.clickOnEntityMenuItem('space-event');        
        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response!.body.length === 0) {
            cy.get(entityTableSelector).should('not.exist');
          } else {
            cy.get(entityTableSelector).should('exist');
          }
        });
        cy.getEntityHeading('SpaceEvent').should('exist');
        
        cy.url().should('match', spaceEventsUrl);
      });
  })