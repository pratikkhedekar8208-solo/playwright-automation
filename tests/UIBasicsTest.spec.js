const {test, expect} = require('@playwright/test');



test ('Browser Context Playwright test', async ({browser})=>
{

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());
    await userName.fill("rahulshetty");
    await password.fill("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);

});

test ('Page Playwright test', async ({page})=>
{
    await page.goto("https://www.google.com/");
    //get title - Assertion
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
} );

test ('Assignement1', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const signIn = page.locator("#login");
    const cardTitles = page.locator(".card-body b");
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await userName.fill("pratikkhedekar8208@gmail.com");
    await password.fill("Playwright@1234");
    await signIn.click();
    await page.waitForLoadState('networkidle');
    console.log(await cardTitles.allTextContents());
    console.log(await cardTitles.nth(0).textContent());

});

test ('UI Controls test', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const documentLink = page.locator("[href*='documents-request']");
    const radioButtonUser = page.locator(".radiotextsty");
    await radioButtonUser.nth(1).click();
    await page.locator("#okayBtn").click();
    await expect(radioButtonUser.nth(1)).toBeChecked();
    console.log(await radioButtonUser.nth(1).isChecked());
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption('consult');
    await page.locator("#terms").click()
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
    await page.pause();

});

test('@Child windows hadl', async ({browser})=>
 {
    const context = await browser.newContext();
    const page =  await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");
 
    const [newPage]=await Promise.all(
   [
      context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened
   
 
   const  text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain =  arrayText[1].split(" ")[0]
    //console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());
 
 });

 test ('Assignement2', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const email = "pratikkhedekar8208@gmail.com";
    const signIn = page.locator("#login");
    const cardTitles = page.locator(".card-body b");
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await userName.fill(email);
    await password.fill("Playwright@1234");
    await signIn.click();
    await page.waitForLoadState('networkidle');
    const product = page.locator(".card-body");
    const productName = "ADIDAS ORIGINAL";
    const count = await product.count();
    console.log(count)
    for (let i=0; i<count; ++i)
    {
        console.log(await product.nth(i).locator("b").textContent());
        if(await product.nth(i).locator("b").textContent() === productName)
        {
            await product.nth(i).locator(".fa.fa-shopping-cart").click();
            break;
        }
    }
    await page.locator("[routerlink='/dashboard/cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    const filling = await page.locator(".form__cc .input").count();
    await page.locator(".form__cc .input").nth(4).fill("456");
    await page.locator(".form__cc .input").nth(5).fill("Pratik");
    // await page.locator(".form__cc .input").nth(5).fill("rahulshettyacademy");
    // await page.locator("[type='submit']").click().waitFor();
    await page.locator("[placeholder*='Country']").pressSequentially("ind", {delay : 150});
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for(let i=0; i<optionsCount; ++i)
    {
        const text = " India";
        const btnText = await dropdown.locator("button").nth(i).textContent();
        
        if(text === btnText)
        {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);
    const orderIdExpected = orderId.split(" ")[2];
    await page.locator("[routerlink*='myorders'] .fa").click();
    await page.locator(".table .ng-star-inserted").first().waitFor();
    const ordersCount = await page.locator(".table .ng-star-inserted").count();
    console.log(ordersCount);
    for(let i=0; i<ordersCount; ++i)
    {
        const orderText = await page.locator(".table .ng-star-inserted [scope='row']").nth(i).textContent();
        if(orderText === orderIdExpected)
        {
            await page.locator(".table .btn-primary").nth(i).click();
            break;
        }
    }
    await page.pause();

});

test.only('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "pratikkhedekar8208@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Playwright@1234");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count = await products.count();
   for (let i = 0; i < count; ++i) {
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }
 
   await page.locator("[routerlink*='cart']").click();
   //await page.pause();
 
   await page.locator("div li").first().waitFor();
   const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();
 
   await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }
 
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
 
});