const { test, expect } = require('@playwright/test');
const {POManager} = require('../pageobjects/POManger')

test('Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const poManager = new POManager(page);
   const username = "pratikkhedekar8208@gmail.com";
   const password = "Playwright@1234"
   const productName = 'ZARA COAT 3';
   console.log("DEBUG:", require('../pageobjects/LoginPage'));
   const loginPage = poManager.getLoginPage();
   await loginPage.goTo();
   await loginPage.validLogin(username, password);
   const dashboardPage = poManager.getDashboardPage();
   await dashboardPage.searchProductAddCart(productName);
   await dashboardPage.navigateToCart();

   const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind","India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
   console.log(orderId);
   await dashboardPage.navigateToOrders();
   const ordersHistoryPage = poManager.getOrdersHistoryPage();
   await ordersHistoryPage.searchOrderAndSelect(orderId);
   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();



















   //Zara Coat 4















});





