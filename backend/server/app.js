const express = require('express');
const cors = require('cors');
const path = require('path');
const { desktopImagesDir } = require('./config/paths');
const testRoutes = require('./routes/testRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (e.g., images) from the desktop directory
app.use('/images', express.static(desktopImagesDir));

// Use routes
app.use('/api/tests', testRoutes);

module.exports = app;
