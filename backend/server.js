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

// Update accordion data route
app.post('/update-accordion-data', async (req, res) => {
  const updatedData = req.body;

  console.log('Updating accordion data:', updatedData); // Log the incoming data

  try {
    // Define the path to your JSON file in the src directory
    const testSuitDataStructurePath = path.join(__dirname, '../src/data/testSuitDataStructure.json');

    // Write the updated data back to the JSON file
    await fs.writeFile(testSuitDataStructurePath, JSON.stringify(updatedData, null, 2));

    res.status(200).json({ message: 'Accordion data updated successfully' });
  } catch (error) {
    console.error('Error writing to testSuitDataStructure.json:', error); // Log the error
    res.status(500).json({ message: 'Error writing to testSuitDataStructure.json' });
  }
});

// Route to add a new item to the dragDropData.json
app.post('/add-drag-drop-item', async (req, res) => {
  const newItem = req.body; // Get the new item from the request body

  if (!newItem.drag || !newItem.drop || !newItem.codeBlock) {
      return res.status(400).json({ message: 'Drag, drop, and codeBlock fields are required.' });
  }

  try {
      // Define the path to your dragDropData JSON file
      const dragDropDataPath = path.join(__dirname, '../src/data/dragDropData.json');

      // Read the existing data from the JSON file
      const data = await fs.readFile(dragDropDataPath, 'utf8');
      const dragDropData = JSON.parse(data);

      // Add the new item to the items array
      dragDropData.items.push(newItem);

      // Write the updated data back to the JSON file
      await fs.writeFile(dragDropDataPath, JSON.stringify(dragDropData, null, 2));

      res.status(200).json({ message: 'Item added successfully!' });
  } catch (error) {
      console.error('Error adding new item to dragDropData.json:', error);
      res.status(500).json({ message: 'Error adding new item' });
  }
});

// Delete a test item route
app.post('/delete-test', async (req, res) => {
  const { testTitle } = req.body; // Get the test title from the request body

  if (!testTitle) {
    return res.status(400).json({ message: 'Test title is required' });
  }

  try {
    // Define the path to your JSON file in the src directory
    const testSuitDataStructurePath = path.join(__dirname, '../src/data/testSuitDataStructure.json');

    // Read the existing data from the JSON file
    const data = await fs.readFile(testSuitDataStructurePath, 'utf8');
    const testSuitData = JSON.parse(data);

    // Find the test suit that contains the test with the given title
    let testFound = false;
    testSuitData.forEach((suit) => {
      const initialTestCount = suit.tests.length;

      // Filter out the test with the matching title
      suit.tests = suit.tests.filter((test) => test.title !== testTitle);

      if (suit.tests.length < initialTestCount) {
        testFound = true; // A test was removed
      }
    });

    if (!testFound) {
      return res.status(404).json({ message: `Test with title "${testTitle}" not found` });
    }

    // Write the updated data back to the JSON file
    await fs.writeFile(testSuitDataStructurePath, JSON.stringify(testSuitData, null, 2));

    res.status(200).json({ message: `Test "${testTitle}" deleted successfully` });
  } catch (error) {
    console.error('Error deleting test:', error); // Log the error
    res.status(500).json({ message: 'Error deleting test' });
  }
});

// Route to run a test
app.post('/run-test', async (req, res) => {
  const { testName, formData } = req.body;

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
