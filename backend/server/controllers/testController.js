const runLoginTest = require('../tests//Login/loginTest');
const io = require('../services/socketService');

// Controller function to handle test execution
const runTest = async (req, res) => {
  const { testName, formData } = req.body;

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
        io.emit('log', 'Starting login test...');
        result = await runLoginTest(formData, io); // Pass Socket.IO to the runLoginTest function
        break;

      default:
        return res.status(400).send('Unknown test name');
    }

    res.status(200).json(result);
  } catch (error) {
    io.emit('log', `Error running test: ${error.message}`);
    res.status(500).send(`Error running test: ${error.message}`);
  }
};

module.exports = {
  runTest,
};
