const puppeteer = require('puppeteer');
const { getViewport, launchBrowser, getScreenshotPath } = require('./puppeteerUtils');

// Main function for device testing with the dynamic token
const runDeviceTest = async (formData, io) => {
  const { url, username, password } = formData;
  try {
    // Fetch the bearer token using the provided URL
    const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdW50ZXJJZCI6Ijk2MjIxNzUiLCJSZWZlcnJlciI6IjEyMzk4NTI1NDgiLCJuYmYiOjE3Mjg2Mjc5MzQsImV4cCI6MTcyODY0OTUzNCwiaWF0IjoxNzI4NjI3OTM0fQ.83j_JN1NbXEFszouJUo2HmRdpJrikrBFKDLcALbz_aY";
    console.log(`Using Bearer Token: ${bearerToken}`);

    // Replace the token in the URL dynamically
    const spinaZonkeurl = encodeURI(`${url}spina-zonke/all/BikiniIsland?url=https://app-hollywood.insvr.com/go.ashx?brandid=108c8538-4070-eb11-b566-dc9840018f80&mode=real&lobbyUrl=https://new.hollywoodbets.net/spina-zonke/habanero&brandgameid=2dc86305-2c51-48cd-9677-e9f9108888f2&token=${bearerToken}`);

    // Device list with Apple address bar variations and more Android resolutions
    const devices = [
      { name: 'iPhone SE (2016)', width: 320, height: 568 },
      { name: 'iPhone 6_7_8', width: 375, height: 667 },
      { name: 'iPhone 6_7_8 Plus', width: 414, height: 736 },
      { name: 'iPhone X_XS_11 Pro', width: 375, height: 812 },
      { name: 'iPhone XR_11', width: 414, height: 896 },
      { name: 'iPhone 12_12 Pro', width: 390, height: 844 },
      { name: 'Galaxy S21', width: 360, height: 800 },
      { name: 'Galaxy Z Fold3 (Open)', width: 768, height: 1024 },
    ];

    io.emit('log', 'Launching browser...');
    const browser = await launchBrowser();  // Use the reusable browser launch function

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      const viewport = getViewport(device);  // Use the reusable viewport function
      const page = await browser.newPage();
      await page.setViewport(viewport);

      io.emit('log', `Navigating to URL: Bikini Island on ${device.name}`);
      await page.goto(spinaZonkeurl, { waitUntil: 'networkidle0' });

      const x = device.width / 2;
      const y = device.height / 2;
      io.emit('log', `Clicking at (${x}, ${y}) on ${device.name}`);
      await page.mouse.click(x, y);

      const screenshotPath = getScreenshotPath(device.name);  // Use the reusable screenshot path function
      io.emit('log', `Taking screenshot for device: ${device.name}`);
      await page.screenshot({ path: screenshotPath });
      io.emit('log', `Screenshot saved at: ${screenshotPath}`);

      // Add a delay of 2 seconds after taking the screenshot

      await page.close();
    }

    io.emit('log', 'Closing browser...');
    await browser.close();

    return { message: 'Device testing completed successfully', screenshotUrl: 'iPhone XR_11' };
  } catch (error) {
    io.emit('log', `Error during device testing: ${error.stack || error.message}`);
    throw new Error(`Test failed: ${error.message}`);
  }
};

module.exports = runDeviceTest;
