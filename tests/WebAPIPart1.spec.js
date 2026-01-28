const {test,expect,request} = require("@playwright/test");
const {APiUtils} = require("../tests/utils/APiUtils.spec");

let response;

const loginPayload = {userEmail:"pratikkhedekar8208@gmail.com",userPassword:"Playwright@1234"};
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"68a961459320a140fe1ca57a"}]};


test.beforeAll( async()=>
{
    const ApiContext= await request.newContext();
    const apiUtils = new APiUtils(ApiContext,loginPayload);
    response = await apiUtils.createOrder(orderPayload);

})


test('@Webst Client App login', async ({ page }) => {
    await page.addInitScript(value =>
    {
        window.localStorage.setItem('token',value);
    }, response.token
    );

   await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (response.orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
 
});