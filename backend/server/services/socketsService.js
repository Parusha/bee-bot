const http = require('http');
const socketIO = require('socket.io');

// Create an HTTP server and set up Socket.IO
const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins (configure appropriately in production)
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = io;
