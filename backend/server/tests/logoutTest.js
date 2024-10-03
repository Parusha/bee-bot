const puppeteer = require('puppeteer');
const path = require('path');

// Helper function to get the desktop path
const getDesktopPath = () => 
  process.platform === 'win32' 
    ? path.join(process.env.USERPROFILE, 'Desktop') 
    : path.join(process.env.HOME, 'Desktop');

const runLogoutTest = async (formData, io) => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors'],
  });

  const page = await browser.newPage();

  // Go to the URL and wait for navigation
  await page.goto('https://new.hollywoodbets.net/', { waitUntil: 'networkidle2' });

  // Click the first target element (list item image)
  const listItemImage = await page.$("[data-testid='list-container'] [data-testid='list-item'] img");
  if (listItemImage) {
    await listItemImage.click({ offset: { x: 29, y: 31 } });
  } else {
    throw new Error("List item image not found");
  }

  // Click the second target element (list item)
  const secondListItem = await page.$("li:nth-of-type(2) > div");
  if (secondListItem) {
    await secondListItem.click({ offset: { x: 201, y: 196 } });
  } else {
    throw new Error("Second list item not found");
  }

  // Close the browser
  await browser.close();
};

module.exports = runLogoutTest;
