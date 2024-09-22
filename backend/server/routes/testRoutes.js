const express = require('express');
const { runTest } = require('../controllers/testController');

const router = express.Router();

// Define POST route to run tests
router.post('/run-test', runTest);

module.exports = router;
