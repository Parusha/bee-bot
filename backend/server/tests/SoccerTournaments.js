const { getViewport, launchBrowser, getScreenshotPath } = require('./puppeteerUtils');

const runSoccerBetTest = async (formData, io) => {
    const { url, username, password, device } = formData;

    if (!url || !username || !password || !device) {
        throw new Error('URL, username, password, and device are required');
    }

    const viewport = getViewport(device);

    try {
        io.emit('log', 'Launching browser...');
        const browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setViewport(viewport);

        io.emit('log', `Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0' });

        io.emit('log', 'Waiting and clicking Soccer element...');
        await page.waitForSelector('svg[data-src="https://content.hollywoodbets.net/mm_soccer_dbe10659d3.svg"]', { timeout: 5000 });
        await page.click('svg[data-src="https://content.hollywoodbets.net/mm_soccer_dbe10659d3.svg"]');

        // Fallback for older Puppeteer versions: Use setTimeout to pause the execution
        await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for 2 seconds

        io.emit('log', 'Taking screenshot after interactions...');
        const screenshotPath = getScreenshotPath('afterSoccerClick');
        await page.screenshot({ path: screenshotPath });
        io.emit('log', `Screenshot saved at: ${screenshotPath}`);

        // Close the browser
        io.emit('log', 'Closing browser...');
        await browser.close();

        return {
            message: 'Test completed successfully',
            screenshotUrl: 'afterSoccerClick',
        };
    } catch (error) {
        io.emit('log', `Error running Puppeteer test: ${error.stack || error.message}`);
        throw new Error(`Error running test: ${error.message}`);
    }

};

module.exports = runSoccerBetTest;
