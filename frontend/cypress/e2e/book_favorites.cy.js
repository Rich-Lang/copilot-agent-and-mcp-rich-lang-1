describe('Book Favorites App', () => {
  // generate a random username and password for the e2e tests
  const username = `e2euser${Math.floor(Math.random() * 1000)}`;
  const password = `e2epass${Math.floor(Math.random() * 1000)}`;
  const user = { username, password };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should allow a new user to register and login', () => {
    cy.contains('Create Account').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    // wait for a bit to ensure the success message is visible
    cy.wait(2000);
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains(`Hi, ${user.username}`).should('exist');
    cy.contains('Favorites').should('exist');
  });

  it('should show books and allow adding to favorites', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.contains('Books').click();
    cy.contains('h2', 'Books').should('exist');
    cy.get('button').contains('Add to Favorites').first().click();
    cy.get('a#favorites-link').click();
    cy.get('h2').contains('My Favorite Books').should('exist');
  });

  it('should logout and protect routes', () => {
    // Login first
    cy.contains('Login').click();
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);
    cy.get('button#login').click();
    cy.get('button#logout').click();
    cy.contains('Login').should('exist');
    cy.visit('http://localhost:5173/books');
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('should display user type next to username in header', () => {
    // Login with sandra who is an administrator
    cy.contains('Login').click();
    cy.get('input[name="username"]').type('sandra');
    cy.get('input[name="password"]').type('sandra');
    cy.get('button#login').click();
    // Check that user type is displayed next to username
    cy.get('#user-info').should('contain', 'Hi, sandra (Administrator)');
    cy.get('button#logout').click();
    
    // Test with a new member user
    cy.contains('Create Account').click();
    const memberUser = `member${Math.floor(Math.random() * 1000)}`;
    cy.get('input[name="username"]').type(memberUser);
    cy.get('input[name="password"]').type('password');
    cy.get('button#register').click();
    cy.contains('Registration successful! You can now log in.').should('exist');
    // Verify redirect to login page
    cy.url().should('include', '/login');
    cy.get('input[name="username"]').type(memberUser);
    cy.get('input[name="password"]').type('password');
    cy.get('button#login').click();
    // Check that new users default to member type
    cy.get('#user-info').should('contain', `Hi, ${memberUser} (Member)`);
  });
});
