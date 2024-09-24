const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Helper function to get the desktop path
const getDesktopPath = () => 
  process.platform === 'win32' 
    ? path.join(process.env.USERPROFILE, 'Desktop') 
    : path.join(process.env.HOME, 'Desktop');

const runLoginTest = async (formData, io) => {
  const { url, username, password, device } = formData;

  if (!url || !username || !password || !device) {
    throw new Error('URL, username, password, and device are required');
  }

  const viewportDimensions = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 1080, height: 1024 },
  };

  const viewport = viewportDimensions[device] || viewportDimensions.desktop;

  try {
    io.emit('log', 'Launching browser...');
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: ['--ignore-certificate-errors'],
    });

    const page = await browser.newPage();
    await page.setViewport(viewport);

    io.emit('log', `Navigating to URL: ${url}`);
    await page.goto(url);

    // Handle login based on device type
    if (device === 'desktop') {
      io.emit('log', 'Waiting for login button...');
      await page.waitForSelector('button[data-testid="login-btn"]', { timeout: 5000 });

      io.emit('log', 'Login button found, clicking the button...');
      await page.click('button[data-testid="login-btn"]');
    } else {
      io.emit('log', 'Waiting for login button...');
      await page.waitForSelector('div[role="presentation"]', { timeout: 5000 });

      io.emit('log', 'Finding and clicking the login button...');
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
    }

    io.emit('log', 'Entering username and password...');
    await page.waitForSelector('#Username', { timeout: 5000 });
    await page.type('#Username', username);
    await page.type('#password', password);
    await page.click('#btnLogin');

    io.emit('log', 'Waiting for navigation...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });

    // Handle screenshot saving
    const desktopDir = getDesktopPath();
    const testingDir = path.join(desktopDir, 'testing');

    if (!fs.existsSync(testingDir)) {
      fs.mkdirSync(testingDir);
    }

    const screenshotPath = path.join(testingDir, 'loggedIn.png');
    io.emit('log', 'Taking screenshot...');
    await page.screenshot({ path: screenshotPath });
    io.emit('log', `Screenshot saved at: ${screenshotPath}`);

    // Close the browser
    io.emit('log', 'Closing browser...');
    await browser.close();

    return {
      message: 'Test completed successfully',
      screenshotUrl: 'loggedIn.png',
    };
  } catch (error) {
    io.emit('log', `Error running Puppeteer test: ${error.stack || error.message}`);
    throw new Error(`Error running test: ${error.message}`);
  }
};

module.exports = runLoginTest;
