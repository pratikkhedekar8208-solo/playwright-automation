class LoginPageForExpandTesting{

    constructor(page){
        this.page = page;
        this.username = page.locator("#username");
        this.password = page.locator("#password");;
        this.submit = page.locator("#submit-login");
        this.logout = page.locator(".icon-signout");
    }

    async goTo(){
        await this.page.goto("https://practice.expandtesting.com/login");
    }

    async validLogin(username,passsword){
        await this.username.fill(username);
        await this.password.fill(passsword);
        await this.submit.click();
    }

    async validlogOut(){
        this.logout.click();
    }

    async goToDynamicTable(){
        await this.page.goto("https://practice.expandtesting.com/dynamic-table");
    }

    async goToDynamicPaginationTable(){
        await this.page.goto("https://practice.expandtesting.com/dynamic-pagination-table");
    }

}
module.exports = {LoginPageForExpandTesting}