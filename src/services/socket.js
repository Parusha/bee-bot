import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:3001');

// Export the socket for reuse
export default socket;
