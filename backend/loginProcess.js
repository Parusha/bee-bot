// backend/LoginProcessTest.js
const LoginProcess = require('LoginProcess');

const runLoginProcessTest = async () => {
  try {
    const browser = await LoginProcess.launch({ headless: false });
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
    await page.screenshot({ path: 'loggedIn.png' });

    await browser.close();
    return 'Test completed successfully';
  } catch (error) {
    console.error('Error running LoginProcess test:', error);
    throw new Error('Error running test');
  }
};

module.exports = runLoginProcessTest;
