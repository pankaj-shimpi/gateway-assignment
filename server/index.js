// Global dependencies
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { networkInterfaces } = require('os');

// Local dependencies
const { createClient } = require('./createClient');
const { requests } = require('./request');

// Local Variables
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;
const network = networkInterfaces();
let connectionPool = [];
let ips = [];

// Loop over to network variable to get IP addresses
for (const item of Object.keys(network)) {
  for (const net of network[item]) {
    if (net.family === 'IPv4') {
      if (!ips.includes(net.address)) {
        ips.push(`http://${net.address}:${PORT}`);
      }
    }
  }
}

// Route to create clients.
app.get('/createClients/:clients', (req, res) => {
  let { clients } = req.params;
  let poolSize = Number(clients);
  connectionPool = createClient(poolSize);
  res.status(200).send();
});

// Route to get interval to call or send message to server.
app.get('/setInterval/:interval', (req, res) => {
  let { interval } = req.params;
  requests(connectionPool, Number(interval));
  res.status(200).send();
});

// Server instantciation.
const ipAdress = [...ips, `http://localhost:${PORT}`].join(', ');
console.log(`You can request to these => ${ipAdress}`);
httpServer.listen(PORT, () => { console.log(`Server is running `)});

// Socket instance to 
let socketInstace = io.listen(httpServer);
socketInstace.on('connection', client => {
  client.on('send message', message => {
    console.log(message);
  });
});