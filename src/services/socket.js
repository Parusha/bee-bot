import io from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:3001';

// Connect to the Socket.IO server
const socket = io(SERVER_URL, {
  transports: ['websocket'], // Specify the transport protocol for the connection (optional)
});

export default socket;
