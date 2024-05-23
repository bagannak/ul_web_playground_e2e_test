import HomePage from "../screens/homePage";
import LoginPage from "../screens/loginPage";
import SearchResultPage from "../screens/searchResultPage";
import PageActions from "../actions/pageActions";
import credential from "../testdata/credentials";
import ProductPage from "../screens/productPage";
import CartPage from "../screens/cartPage";
import PaymentPage from "../screens/paymentPage";
import AccoutPage from "../screens/accountPage";

describe("Smoke test", () => {
  const homePage = new HomePage();
  const searchResultPage = new SearchResultPage();
  const pageActions = new PageActions();
  const loginPage = new LoginPage();
  const productPage = new ProductPage();
  const cartPage = new CartPage();
  const paymentPage = new PaymentPage();
  const accountPage = new AccoutPage();
  const validEmail = credential.validCredentials.email;
  const validPassword = credential.validCredentials.password;

  beforeEach(() => {
    cy.visit("https://web-playground.ultralesson.com/");
  });
  
  it("test happy path", () => {
    homePage.getTitle().should("eq", "ul-web-playground");

    homePage.navigateToLoginPage();
    homePage.getTitle().should("include", "Account");
    loginPage.login(validEmail, validPassword);
    homePage.getTitle().should("eq", "Account – ul-web-playground");

    homePage.searchForProduct("Shirt\n");
    pageActions
      .getText(searchResultPage.getFirstResult())
      .should("include", "Shirt");
    searchResultPage.navigateToProductPage();
    pageActions
      .getText(productPage.getProductTitle())
      .should("include", "Shirt");

    productPage.addProductToCart();
    productPage.getCartNotificationPopUp().should("be.visible");
    productPage.navigateToCartPage();
    homePage.getTitle().should("include", "Your Shopping Cart");
    cartPage.getCartItems().should("have.length", 1);

    cartPage.checkout();

    // paymentPage.getOrderSummarySection().should("be.visible");

    paymentPage.completeOrder();
    homePage.getTitle().should("include", "Thank you for your purchase!");
    paymentPage.continueShopping();
    homePage.navigateToLoginPage();
    accountPage.logout();
  });
});
