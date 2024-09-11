const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); // Import the fs module
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

app.post('/run-test', async (req, res) => {
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

    // Return the URL of the screenshot
    res.status(200).json({
      message: 'Test completed successfully',
      screenshotUrl: '/screenshots/login/loggedIn.png'
    });
  } catch (error) {
    console.error('Error running Puppeteer test:', error.message);
    res.status(500).send(`Error running test: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
