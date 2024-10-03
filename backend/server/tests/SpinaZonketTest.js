const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 852, height: 911 });

    await page.goto('https://new.hollywoodbets.net/');
    await page.waitForNavigation();

    await Promise.race([
        page.waitForSelector("html > body > #root > div:nth-of-type(1) > div.Container-sc-m0qm6t-0 > div.StyledMobileOnly-sc-v5ixf6-0 > div.Container-sc-pra5fc-0 > div > [data-testid='list-container'] > [data-testid='list-item'] > img", {timeout}),
        page.waitForXPath('//*[@data-testid="list-item"]/img', {timeout})
    ])
    .then(async (elementHandle) => {
        await elementHandle.click({ offset: { x: 29, y: 31 } });
    });

    await Promise.race([
        page.waitForSelector('li:nth-of-type(2) > div', {timeout}),
        page.waitForXPath('//*[@id="root"]/div[1]/div[3]/div/section[1]/section/div/div/div/ul/li[2]/div', {timeout})
    ])
    .then(async (elementHandle) => {
        await elementHandle.click({ offset: { x: 201, y: 196 } });
    });

    await page.waitForNavigation();
    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});


// const puppeteer = require('puppeteer');
// const path = require('path');

// // Helper function to get the desktop path
// const getDesktopPath = () => 
//   process.platform === 'win32' 
//     ? path.join(process.env.USERPROFILE, 'Desktop') 
//     : path.join(process.env.HOME, 'Desktop');

// const runLogoutTest = async (formData, io) => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     ignoreHTTPSErrors: true,
//     args: ['--ignore-certificate-errors'],
//   });

//   const page = await browser.newPage();


//   // Set viewport
//   await page.setViewport({
//     width: 852,
//     height: 911
//   });

//   // Go to the URL and wait for navigation
//   await page.goto('https://new.hollywoodbets.net/', { waitUntil: 'networkidle2' });

//   // Click the first target element (list item image)
//   const listItemImage = await page.$("[data-testid='list-container'] [data-testid='list-item'] img");
//   if (listItemImage) {
//     await listItemImage.click({ offset: { x: 29, y: 31 } });
//   } else {
//     throw new Error("List item image not found");
//   }

//   // Click the second target element (list item)
//   const secondListItem = await page.$("li:nth-of-type(2) > div");
//   if (secondListItem) {
//     await secondListItem.click({ offset: { x: 201, y: 196 } });
//   } else {
//     throw new Error("Second list item not found");
//   }

//   // Close the browser
//   await browser.close();
// };

// module.exports = runLogoutTest;
