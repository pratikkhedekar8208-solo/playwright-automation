const {LoginPage} = require('./LoginPage');
const {DashboardPage} = require('./DashboardPage');
const {OrdersHistoryPage} = require('./OrderHistoryPage');
const {OrdersReviewPage} = require('./OrderReviewPage');
const {CartPage}= require('./CartPage');
const {LoginPageForExpandTesting} = require('./LoginPageForExpandTesting');
class POManager
{
constructor(page)
{
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.loginpageForExpandTesting = new LoginPageForExpandTesting(this.page);


}

getLoginPage()
{
    return this.loginPage;
}

getCartPage()
{
    return this.cartPage;
}

getDashboardPage()
{
    return this.dashboardPage;
}
getOrdersHistoryPage()
{
    return this.ordersHistoryPage;
}

getOrdersReviewPage()
{
    return this.ordersReviewPage;
}

getLoginPageForExpandTesting(){
    return this.loginpageForExpandTesting;
}
}
module.exports = {POManager};