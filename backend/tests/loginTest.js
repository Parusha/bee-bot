const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); // Import the fs module

const runLoginTest = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://new.hollywoodbets.net/');
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('div[role="presentation"]');
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('div[role="presentation"]'))
        .find(div => div.innerText.trim() === 'Log in');
      if (button) {
        button.click();
      } else {
        console.log('Button not found');
      }
    });
    await page.waitForSelector('#Username');
    await page.type('#Username', '0614694645');
    await page.type('#password', 'David0000001$');
    await page.click('#btnLogin');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Define the screenshot path and URL
    const screenshotDir = path.join(__dirname, 'public/screenshots/login');
    const screenshotPath = path.join(screenshotDir, 'loggedIn.png');

    // Check if the directory exists and create it if it doesn't
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.screenshot({ path: screenshotPath });
    await browser.close();

    return {
      message: 'Test completed successfully',
      screenshotUrl: `/screenshots/login/loggedIn.png`
    };
  } catch (error) {
    console.error('Error running Puppeteer test:', error.message);
    throw new Error(`Error running test: ${error.message}`);
  }
};

module.exports = runLoginTest;
