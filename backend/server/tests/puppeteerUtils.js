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

module.exports = {
  getDesktopPath,
  getViewport,
  launchBrowser,
  getScreenshotPath,
};