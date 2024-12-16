const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os');
const fs = require('fs').promises;
const multer = require('multer');
require('dotenv').config();

const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
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

// Function to load the JSON data
const loadYourJsonData = async () => {
  try {
    const filePath = path.join(__dirname, '../src/data/dragDropData.json'); // Adjust path as necessary
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading JSON data:', error);
    throw error; // Rethrow or handle error as needed
  }
}

// Route to delete an item from the dragDropData.json
app.delete('/delete-drag-drop-item', async (req, res) => {
  const { drag } = req.body; // Extract the 'drag' value from the request body

  if (!drag) {
    return res.status(400).json({ message: 'Drag field is required.' });
  }

  try {
    const dragDropData = await loadYourJsonData(); // Load current data

    // Check if the item exists before attempting to delete
    const initialItemCount = dragDropData.items.length;

    // Filter out the item to delete
    dragDropData.items = dragDropData.items.filter(item => item.drag !== drag);

    // Check if an item was removed
    if (dragDropData.items.length === initialItemCount) {
      return res.status(404).json({ message: `Item with drag "${drag}" not found.` });
    }

    // Write the updated data back to the JSON file
    const dragDropDataPath = path.join(__dirname, '../src/data/dragDropData.json');
    await fs.writeFile(dragDropDataPath, JSON.stringify(dragDropData, null, 2));

    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (error) {
    console.error('Error deleting item from dragDropData.json:', error);
    res.status(500).json({ message: 'Error deleting item' });
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

const hintTestTablePath = path.join(__dirname, '../src/data/hintTestTable.json');

// Get hint tests
app.get('/get-hint-tests', async (req, res) => {
  try {
    const data = await fs.readFile(hintTestTablePath, 'utf8');
    const parsedData = JSON.parse(data); // Parsing the JSON
    res.status(200).json(parsedData); // Sending the parsed data
  } catch (error) {
    console.error('Error reading hintTestTable.json:', error);
    res.status(500).json({ message: 'Error reading hintTestTable.json' }); // Return a general error message
  }
});

app.post('/add-hint-test', async (req, res) => {
  const newTest = req.body;

  // Basic validation: check if the necessary data is provided
  if (!newTest || Object.keys(newTest).length === 0) {
    return res.status(400).json({ message: 'Invalid input: Missing test data' });
  }

  try {
    // Read existing tests
    const data = await fs.readFile(hintTestTablePath, 'utf8');
    const tests = JSON.parse(data);

    // Add the new test
    tests.push(newTest);

    // Write the updated tests back to the file
    await fs.writeFile(hintTestTablePath, JSON.stringify(tests, null, 2));

    // Send the updated list of tests as response
    res.status(200).json({ message: 'Test added successfully', tests });
  } catch (error) {
    // Enhanced error handling: log and return more specific error messages
    console.error('Error writing to hintTestTable.json:', error);
    res.status(500).json({ message: 'Error writing to hintTestTable.json', error: error.message });
  }
});

app.post('/delete-hint-test', async (req, res) => {
  const { index } = req.body;

  try {
    const data = await fs.readFile(hintTestTablePath, 'utf8');
    const tests = JSON.parse(data);

    if (index >= 0 && index < tests.length) {
      tests.splice(index, 1); // Remove the test at the specified index
      await fs.writeFile(hintTestTablePath, JSON.stringify(tests, null, 2));
      res.status(200).json(tests); // Return the updated list
    } else {
      res.status(400).json({ message: 'Invalid index' });
    }
  } catch (error) {
    console.error('Error writing to hintTestTable.json:', error);
    res.status(500).json({ message: 'Error writing to hintTestTable.json' });
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
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
