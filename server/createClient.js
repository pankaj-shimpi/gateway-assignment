const { io } = require('socket.io-client');

// Create Socket clients
const createClient = (poolSize) => {
  let clients = [];
  for(let i=0; i<poolSize; i++) {
    clients.push(createSocket());
  }
  return clients;
}

// Sockt connection to interact with server
const createSocket = () => {
  let socket = new io('http://localhost:3000');
  socket.connect();
  return socket;
}

module.exports = { createClient }