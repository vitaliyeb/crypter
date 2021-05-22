const puppeteer = require('puppeteer');

(async () => {
    const searchBTC = async (page) => {
        const totalBTC = await page.$$eval('.js-balances-bitcoin [data-original-title="Total balance"]', (el) => el[0].textContent.trim());


        if (totalBTC === "0") {
            await page.$$eval('.pagination .page-link', (links) => {links.find(el => el.textContent.trim() === "Random").click()});
        }
    }

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    page.on('load', () => searchBTC(page));
    await page.goto(`https://privatekeys.pw/keys/bitcoin/${Math.round(Math.random() * 99999999e10)}`)


})();