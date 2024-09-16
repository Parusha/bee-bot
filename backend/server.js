const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Import the fs module
const runLoginTest = require('../src/tests/loginTest'); // Import the test script

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

app.post('/run-test', async (req, res) => {
  const { testName, formData } = req.body; // Extract testName and formData from the request body

  if (!testName) {
    return res.status(400).send('Test name is required');
  }

  if (!formData) {
    return res.status(400).send('Form data is required');
  }

  try {
    let result;
    
    switch (testName) {
      case 'loginTest':
        result = await runLoginTest(formData); // Pass formData to the runLoginTest function
        break;

      default:
        return res.status(400).send('Unknown test name');
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error running Puppeteer test:', error.message);
    res.status(500).send(`Error running test: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
