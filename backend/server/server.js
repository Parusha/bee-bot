const app = require('./app');
const server = require('./services/socketService');

const port = 3001;

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
