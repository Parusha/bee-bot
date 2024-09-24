const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const runLoginTest = require('./server/tests/Login/loginTest');
const os = require('os'); // Import os module to get the home directory

const app = express();
const port = 3001;

// Create an HTTP server and pass the express app
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins (configure appropriately in production)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
// Get the user's home directory dynamically
const userHomeDir = os.homedir();

// Point to a folder on the user's Desktop (or any directory inside their home directory)
const desktopImagesDir = path.join(userHomeDir, 'Desktop', 'testing');

app.use('/images', express.static(desktopImagesDir));

app.post('/run-test', async (req, res) => {
  const { testName, formData } = req.body;

  if (!testName) {
    return res.status(400).send('Test name is required');
  }

  if (!formData) {
    return res.status(400).send('Form data is required');
  }

  try {
    let result;

    // Run the test and pass the socket instance to receive logs
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
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


//https://chatgpt.com/c/66eb12e6-7ef8-8001-9be6-b90932b78dad