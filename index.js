const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');




(async () => {
    const dataLogger = (url, totalBTC) => {
        const filePath = path.join(__dirname, 'log.txt');

        fs.appendFile(filePath, `${url} ---> ${totalBTC} \n`, (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        })
    }

    const searchBTC = async (page) => {
        let totalBTC;
        let intervalId;

        await new Promise((res) => intervalId = setInterval(async () => {
            totalBTC = await page.$$eval('.js-balances-bitcoin [data-original-title="Total balance"]', (el) => el[0]?.textContent?.trim());
            if (totalBTC !== 'undefined') res(clearInterval(intervalId));
        }, 100))

        if (totalBTC !== "0") dataLogger(page.url(), totalBTC);

        await page.$$eval('.pagination .page-link', (links) => {
            links.find(el => el.textContent.trim() === "Random").click();
            setTimeout(() => {
                if(window.location.href.includes("#google_vignette")) window.location.reload();
            }, 2000);
        });
    }

    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1200, height: 1000} });
    const page = await browser.newPage();

    page.on('load', () => searchBTC(page));

    await page.goto(`https://privatekeys.pw/keys/bitcoin/${Math.round(Math.random() * 99999999e10)}`)


})();