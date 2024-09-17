const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Helper function to get the desktop path
const getDesktopPath = () => {
  if (process.platform === 'win32') {
    return path.join(process.env.USERPROFILE, 'Desktop');
  } else {
    return path.join(process.env.HOME, 'Desktop');
  }
};

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

    io.emit('log', 'Entering username and password...');
    await page.waitForSelector('#Username', { timeout: 5000 });
    await page.type('#Username', username);
    await page.type('#password', password);
    await page.click('#btnLogin');

    io.emit('log', 'Waiting for navigation...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });

    let screenshotPath;
    try {
      const desktopDir = getDesktopPath();
      const testingDir = path.join(desktopDir, 'testing'); // Create the 'testing' folder on desktop

      io.emit('log', 'Ensuring screenshot directory exists...');
      if (!fs.existsSync(testingDir)) {
        fs.mkdirSync(testingDir);
      }

      screenshotPath = path.join(testingDir, 'loggedIn.png');
    } catch (pathError) {
      io.emit('log', `Error setting up screenshot directory or path: ${pathError.message}`);
      throw new Error(`Error setting up screenshot directory or path: ${pathError.message}`);
    }

    io.emit('log', 'Taking screenshot...');
    try {
      await page.screenshot({ path: screenshotPath });
      io.emit('log', `Screenshot saved at: ${screenshotPath}`);
    } catch (screenshotError) {
      io.emit('log', `Error taking screenshot: ${screenshotError.message}`);
      throw new Error(`Error taking screenshot: ${screenshotError.message}`);
    }

    io.emit('log', 'Waiting before closing the browser...');
    io.emit('log', 'Closing browser...');
    await browser.close();
    io.emit('log', 'Browser closed...');

    return {
      message: 'Test completed successfully',
      screenshotUrl: `loggedIn.png`, // Provide a file URL for easier access
    };
  } catch (error) {
    io.emit('log', `Error running Puppeteer test: ${error.stack || error.message}`);
    throw new Error(`Error running test: ${error.message}`);
  }
};

module.exports = runLoginTest;
