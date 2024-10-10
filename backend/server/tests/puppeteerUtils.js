const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Utility to get the desktop path
const getDesktopPath = () =>
  process.platform === 'win32'
    ? path.join(process.env.USERPROFILE, 'Desktop')
    : path.join(process.env.HOME, 'Desktop');

// Utility to get the viewport based on device type
const getViewport = (device) => {
  const viewportDimensions = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 1080, height: 1024 },
  };
  return viewportDimensions[device] || viewportDimensions.desktop;
};

// Utility to launch Puppeteer browser
const launchBrowser = async () => {
  return puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors'],
  });
};

// Utility to get the screenshot path
const getScreenshotPath = (fileName) => {
  const desktopDir = getDesktopPath();
  const testingDir = path.join(desktopDir, 'testing');

  if (!fs.existsSync(testingDir)) {
    fs.mkdirSync(testingDir);
  }

  return path.join(testingDir, fileName + '.png');
};
//TODO: need to find a way to get the token
// Function to get the bearer token, accepting a URL parameter
 const getBearerToken = async (url, username, password, io) => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // Enable request interception to listen to network requests
  await page.setRequestInterception(true);

  let bearerToken = null;

  // Create a Promise to wait for the bearer token
  const tokenPromise = new Promise((resolve, reject) => {
    page.on('request', (request) => {
      const headers = request.headers();

      // Check if the request has an Authorization header with a Bearer token
      if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
        bearerToken = headers.authorization;
        console.log('Bearer Token found in request:', bearerToken);
        resolve(bearerToken);  // Resolve the Promise when the token is found
      }

      request.continue();
    });
  });

  // Navigate to the site where the token is issued (URL is passed dynamically)
  await page.goto(url, { waitUntil: 'networkidle0' });

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

  // Wait for the bearer token to be intercepted
  const token = await tokenPromise;

  await browser.close();

  if (token) {
    return token;
  } else {
    throw new Error('Bearer token not found.');
  }
};

module.exports = {
  getDesktopPath,
  getViewport,
  launchBrowser,
  getScreenshotPath,
  getBearerToken,
};