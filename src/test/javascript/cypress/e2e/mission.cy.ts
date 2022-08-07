import {
    entityTableSelector,
    entityCreateButtonSelector,
    entityCreateSaveButtonSelector,
  } from '../support/entity';

  describe('Mission test', () => {
    const missionUrl = '/mission';
    const missionUrlPattern = new RegExp('/mission(\\?.*)?$');
    const username = Cypress.env('E2E_USERNAME') ?? 'user';
    const password = Cypress.env('E2E_PASSWORD') ?? 'user';  
  
    beforeEach(() => {
      cy.login(username, password);
    });
  
    beforeEach(() => {
      cy.intercept('GET', '/api/missions+(?*|)').as('entitiesRequest');
      cy.intercept('POST', '/api/missions').as('postEntityRequest');
    });

    it('Carga blogs', () => {
      cy.visit('/');
      cy.clickOnEntityMenuItem('mission');
      cy.wait('@entitiesRequest').then(({ response }) => {
        if (response!.body.length === 0) {
          cy.get(entityTableSelector).should('not.exist');
        } else {
          cy.get(entityTableSelector).should('exist');
        }
      });
      cy.getEntityHeading('Mission').should('exist');
      cy.url().should('match', missionUrlPattern);
    });

    let mission: any;

    afterEach(() => {
        if (mission) {
        cy.authenticatedRequest({
            method: 'DELETE',
            url: `/api/missions/${mission.id}`,
        }).then(() => {
          mission = undefined;
        });
        }
    });
    describe('nuevo mission', () => {
        
      beforeEach(() => {
        cy.visit(`${missionUrl}`);
        cy.get(entityCreateButtonSelector).click();
        cy.getEntityCreateUpdateHeading('Mission');
      });
  
      it('should create an instance of Blog', () => {
        cy.get(`[data-cy="name"]`).type('Super Ultra name').should('have.value', 'Super Ultra name');
  
        cy.get(`[data-cy="description"]`).type('Super Ultra descripcion').should('have.value', 'Super Ultra descripcion');
  
        cy.get(entityCreateSaveButtonSelector).click();
  
        cy.wait('@postEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(201);
          mission = response!.body;
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', missionUrlPattern);
      });
    });
  });