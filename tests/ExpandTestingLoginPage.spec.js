const {test, expect} = require("@playwright/test");
const {POManager} = require('../pageobjects/POManger')

let poManager;
let loginPage;

test.beforeEach(async({page})=>{
   poManager = new POManager(page); 
   loginPage = poManager.getLoginPageForExpandTesting();
   await loginPage.goToDynamicPaginationTable(); 
})

test('Expand Testing Login', async({page})=>{
    const poManager = new POManager(page);
    const username = "practice";
    const password = "SuperSecretPassword!";
    const logout = page.locator(".icon-signout");
    const loginPage = poManager.getLoginPageForExpandTesting();

    await loginPage.goTo();
    await loginPage.validLogin(username,password);
    console.log(await page.locator(".subheader").textContent());
    await expect(page.locator(".subheader")).toContainText("Welcome to the Secure Area. When you are done click logout below.");
    await loginPage.validlogOut();
    await expect(page.locator("#flash b")).toContainText("You logged out of the secure area!");
    // console.log(await page.locator(".alert b").textContent());
    // await expect(await page.locator(".alert b")).toContainText("Your password is invalid!");
    


})

test('Validate Chrome CPU value', async({page})=>{
    const poManager = new POManager(page); 
    const loginPage = poManager.getLoginPageForExpandTesting();
    await loginPage.goToDynamicTable(); 
    await expect(page).toHaveURL('https://practice.expandtesting.com/dynamic-table');
    const headers = await page.locator(".table tr th").allTextContents();
    const cpuIndex = await headers.indexOf('CPU'); 
    console.log(headers);
    const chromeRow = await page.locator('tr',{hasText : 'Chrome'});
    const chromCpuValuesActual = await chromeRow.locator('td').nth(cpuIndex).textContent();
    const chromeCpuExpectedValue = (await page.locator('#chrome-cpu').textContent()).split(":")[1].trim();
    await expect(chromCpuValuesActual).toBe(chromeCpuExpectedValue);
})

test('Validate page and table presence', async ({page})=>{
    const expectedHeaders = ['Student Name', 'Gender', 'Class Level', 'Home State', 'Major', 'Extracurricular Activity'];
    const poManager = new POManager(page); 
    const loginPage = poManager.getLoginPageForExpandTesting();
    await loginPage.goToDynamicPaginationTable();
    const pageTitle = await page.locator('h1',{hasText : 'Dynamic pagination Table page for Automation Testing Practice'});
    const table = await page.locator(".table-responsive");
    const actualHeaders = await page.locator(".table th").allTextContents();
    await expect(pageTitle).toBeVisible();
    await expect(table).toBeVisible();
    expect(actualHeaders).toEqual(expectedHeaders);

})

test('Validate Default Rows count and Footer Text', async({page})=>{
    const poManager = new POManager(page); 
    const loginPage = poManager.getLoginPageForExpandTesting();
    await loginPage.goToDynamicPaginationTable();
    const entriesActual = await page.locator("[name='example_length']").inputValue();
    const tableEntries = page.locator("tbody tr");
    const tableEntriesCount = await tableEntries.count()
    const footerTextActual = await page.locator(".dataTables_info").innerText();
    expect(entriesActual).toEqual('3');
    expect(tableEntriesCount).toBe(3);
    expect(footerTextActual).toContain('Showing 1 to 3 of 10 entries');

})

test('Validate Page Navigatipn', async({page})=>{
    const poManager = new POManager(page); 
    const loginPage = poManager.getLoginPageForExpandTesting();
    await loginPage.goToDynamicPaginationTable();

    //Default Page
    expect(await page.locator(".dataTables_info").innerText()).toContain('Showing 1 to 3 of 10 entries');
    expect(await page.locator("tbody tr").count()).toBe(3);
    const previousButton = page.locator("#example_previous");
    await expect(previousButton).toHaveClass(/disabled/);

    //Next Page
    await page.locator("#example_next").click();
    expect(await page.locator("#example_info").innerText()).toContain('Showing 4 to 6 of 10 entries')   
    expect(await page.locator("tbody tr").count()).toBe(3);
    const nextButton = page.locator("#example_next");

    //Last Page
    await page.locator("a[data-dt-idx='3']").click();
    expect(await page.locator(".dataTables_info").innerText()).toContain('Showing 10 to 10 of 10 entries')
    expect(await page.locator("tbody tr").count()).toBe(1);
    await expect(nextButton).toHaveClass(/disabled/);

    //Previous Button
    await previousButton.click();
    expect(await page.locator(".dataTables_info").innerText()).toContain('Showing 7 to 9 of 10 entries');
    expect(await page.locator("tbody tr").count()).toBe(3);

})

test('Search and Pagination Validationb', async({page})=>{
    await page.locator("input[type='search']").fill("alice");
    const totalRows = await page.locator("tbody tr").count();
    expect(totalRows).toBe(1);
    const footerText = await page.locator("#example_info").innerText();
    console.log(footerText);
    expect(footerText).toContain("Showing 1 to 1 of 1 entries (filtered from 10 total entries)");
    const previousButton = page.locator("#example_previous");
    await expect(previousButton).toHaveClass(/disabled/);
    expect(await page.locator("tbody tr").count()).toBe(1);
    const nextButton = page.locator("#example_next");
    await expect(nextButton).toHaveClass(/disabled/);

})

test('Validating table sorting with pagination', async({page})=>{
    await page.locator(".form-select").selectOption('All');
    const studentHeaders = page.locator("th",{hasText: "Student Name"});
    const studentNames = await page.locator("tbody tr td:nth-child(1)").allTextContents();
    const expectedDescStudentNames = studentNames.sort().reverse();
    await studentHeaders.click();
    const actualDescStudentNames = await page.locator("tbody tr td:nth-child(1)").allTextContents();
    expect(actualDescStudentNames).toEqual(expectedDescStudentNames);
    await studentHeaders.click();
    const actualAscStudentNames = await page.locator("tbody tr td:nth-child(1)").allTextContents();
    const expectedAscStudentNames = await studentNames.sort();
    expect(actualAscStudentNames).toEqual(expectedAscStudentNames);
    
})

test('Validate complete row date for a student', async({page})=>{
    await page.locator(".form-control").fill("Bob");
    const expectedStudentValues = ['Bob Williams','Male','Freshman','Florida','Physics','Soccer'];
    const actualStudentValues = await page.locator("tbody tr td").allTextContents();
    expect(actualStudentValues).toEqual(expectedStudentValues);

})

test('Find a student across the pagination', async({page})=>{
    const studenNameToFind = "Olivia Wilson";
    let found = false;

    while(true){
        const studentName = await page.locator("tbody tr td:nth-child(1)").allTextContents();
        if(studentName.includes(studenNameToFind)){
            found = true;
            console.log("1")
            break;
        }

        const nextPage = page.locator("a[data-dt-idx='next']");
        const classValue = await nextPage.getAttribute('class');

        if(await classValue?.includes('disabled')){
            break;
        }

        await nextPage.click();
        await page.waitForTimeout(500)
    }

    expect(found).toBe(true);
})

test('Validate Student Name Column', async({page})=>{
    const studentNames = await page.locator("tbody tr td:nth-child(1)").allTextContents();

    const expectedStudentNames = ['Alice Johnson','Bob Williams','Daniel Martinez'];

    studentNames.forEach(studentName => {
        expect(expectedStudentNames).toContain(studentName);
    })
})

test('Validating student names across pagination', async({page})=>{
    const allStudentNames = [];
    let lastFooterText = '';

    while(true){
        await page.waitForFunction((prev)=> document.querySelector("#example_info")?.innerText !== prev, lastFooterText);

        const footerText = await page.locator("#example_info").innerText();
        lastFooterText = footerText;

        const names = await page.locator("tbody tr td:nth-child(1)").allTextContents();
        allStudentNames.push(...names);

        const nextPage = await page.locator("a[data-dt-idx='next']");
        const classValue = await page.locator("#example_next").getAttribute('class');

        if(classValue?.includes('disabled')){
            break;
        }

        await nextPage.click();
    }
    allStudentNames.forEach(name => {console.log(name);})
    await expect(allStudentNames.length).toBe(10);
})

test.only("Validate Student name which does not exist", async({page})=>{
    const StudentName = page.locator(".form-control");
    await StudentName.fill("Rahul");
    await expect(page.locator(".dataTables_empty")).toContainText("No matching records found");
    
})