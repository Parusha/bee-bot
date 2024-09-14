const puppeteer = require('puppeteer'); 
const path = require('path');
const fs = require('fs'); // Import the fs module

const runLoginTest = async (formData) => {
  // Validate required fields
  const { url, username, password, device } = formData;

  // Validate required fields
  if (!url || !username || !password || !device) {
    throw new Error('URL, username, password, and device are required');
  }
  const viewportDimensions = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 1080, height: 1024 } 
  };
  const viewport = viewportDimensions[device] || viewportDimensions.desktop;

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url); 
    await page.setViewport(viewport);
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
    await page.type('#Username', username); 
    await page.type('#password', password); 
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
