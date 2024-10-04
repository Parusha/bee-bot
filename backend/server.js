const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os'); // Import os module to get the home directory
const fs = require('fs').promises; // Use promises for file system operations
const multer = require('multer'); // Import multer for file uploads

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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'server', 'tests')); // Directory to save files
  },
  filename: (req, file, cb) => {
    let fileName = path.parse(file.originalname).name; // Get the original file name without extension
    cb(null, `${fileName}.js`); // Save the file with a .js extension
  },
});

const upload = multer({ storage });

// Define the /upload-test route to handle file uploads
app.post('/upload-test', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully!' });
});

// Get the user's home directory dynamically
const userHomeDir = os.homedir();

// Point to a folder on the user's Desktop (or any directory inside their home directory)
const desktopImagesDir = path.join(userHomeDir, 'Desktop', 'testing');

app.use('/images', express.static(desktopImagesDir));

app.post('/update-accordion-data', async (req, res) => {
  const updatedData = req.body;

  console.log('Updating accordion data:', updatedData); // Log the incoming data

  try {
    // Define the path to your JSON file in the src directory
    const accordionDataPath = path.join(__dirname, '../src/data/accordionData.json');

    // Write the updated data back to the JSON file
    await fs.writeFile(accordionDataPath, JSON.stringify(updatedData, null, 2));

    res.status(200).json({ message: 'Accordion data updated successfully' });
  } catch (error) {
    console.error('Error writing to accordionData.json:', error); // Log the error
    res.status(500).json({ message: 'Error writing to accordionData.json' });
  }
});
app.post('/run-test', async (req, res) => {
  const { testName, formData } = req.body;
  console.log(testName);

  if (!testName) {
    return res.status(400).send('Test name is required');
  }

  if (!formData) {
    return res.status(400).send('Form data is required');
  }

  try {
    // Construct the path to the test file
    const testFilePath = path.join(__dirname, 'server', 'tests', `${testName}.js`);

    // Check if the test file exists
    await fs.access(testFilePath);

    // Dynamically require the test file
    const testModule = require(testFilePath);

    // Run the test and pass Socket.IO instance to receive logs
    io.emit('log', `Starting ${testName}...`);
    const result = await testModule(formData, io);

    res.status(200).json(result);
  } catch (error) {
    // Check if the error is due to the file not existing
    if (error.code === 'ENOENT') {
      return res.status(404).send(`Test file for "${testName}" not found`);
    }

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
