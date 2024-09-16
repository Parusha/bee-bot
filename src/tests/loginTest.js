const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); // Import the fs module

const runLoginTest = async (formData) => {
  const { url, username, password, device } = formData;
  // Validate required fields
  if (!url || !username || !password || !device) {
    throw new Error('URL, username, password, and device are required');
  }

  const viewportDimensions = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 1080, height: 1024 },
  };
  const viewport = viewportDimensions[device] || viewportDimensions.desktop;

  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: ['--ignore-certificate-errors'],
    });
    
    const page = await browser.newPage();
    await page.setViewport(viewport);
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url); 

    console.log('Waiting for login button...');
    await page.waitForSelector('div[role="presentation"]', { timeout: 5000 });
    
    console.log('Finding and clicking the login button...');
    const buttonFound = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('div[role="presentation"]'))
        .find(div => div.innerText.trim() === 'Log in');
      if (button) {
        button.click();
        return true;
      }
      return false;
    });

    if (!buttonFound) {
      throw new Error('Login button not found');
    }

    console.log('Entering username and password...');
    await page.waitForSelector('#Username', { timeout: 5000 });
    await page.type('#Username', username); 
    await page.type('#password', password); 
    await page.click('#btnLogin');
    
    console.log('Waiting for navigation...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });

    const screenshotDir = path.join(__dirname, '..', '..', 'screenshots');
    const screenshotPath = path.join(screenshotDir, 'loggedIn.png');

    console.log('Ensuring screenshot directory exists...');
    if (!fs.existsSync(screenshotDir)) {
      try {
        fs.mkdirSync(screenshotDir, { recursive: true });
        console.log(`Directory created at: ${screenshotDir}`);
      } catch (dirError) {
        console.error(`Error creating directory: ${dirError.message}`);
        throw new Error(`Error creating directory: ${dirError.message}`);
      }
    }

    console.log('Taking screenshot...');
    try {
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved at: ${screenshotPath}`);
    } catch (screenshotError) {
      console.error(`Error taking screenshot: ${screenshotError.message}`);
      throw new Error(`Error taking screenshot: ${screenshotError.message}`);
    }

    console.log('Waiting before closing the browser...');
   
    
    console.log('Closing browser...');
    await browser.close();
    console.log('browser closed...');

    return {
      message: 'Test completed successfully',
      screenshotUrl: `screenshots/loggedIn.png`,
    };
  } catch (error) {
    console.error('Error running Puppeteer test:', error.stack || error.message);
    throw new Error(`Error running test: ${error.message}`);
  }
};

module.exports = runLoginTest;
