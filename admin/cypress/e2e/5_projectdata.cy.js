it("project ", () => {
    //go to page
    cy.visit("http://localhost:8788/login/")
    cy.get("#inp-email").clear().type('a@b.com');
    cy.get("#inp-password1").type('1');
    cy.get("#btn-login").click();
    cy.get("#projects-cy").click();
    cy.get("#datap-project-1-0").click();
});