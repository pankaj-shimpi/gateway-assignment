const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { networkInterfaces } = require('os');
const { createClient } = require('./createClient');
const { requests } = require('./request');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;
const network = networkInterfaces();
let connectionPool = [];
let ips = [];
for (const item of Object.keys(network)) {
  for (const net of network[item]) {
    if (net.family === 'IPv4') {
      if (!ips.includes(net.address)) {
        ips.push(`http://${net.address}:${PORT}`);
      }
    }
  }
}
app.get('/', (req, res) => {
  res.status(200).send("Success");
});

app.get('/createClients/:clients', (req, res) => {
  let { clients } = req.params;
  let poolSize = Number(clients);
  connectionPool = createClient(poolSize);
  res.status(200).send();
});

app.get('/setInterval/:interval', (req, res) => {
  let { interval } = req.params;
  requests(connectionPool, Number(interval));
  res.status(200).send();
});

const ipAdress = [...ips, `http://localhost:${PORT}`].join(', ');
console.log(`You can request to these => ${ipAdress}`);
httpServer.listen(PORT, () => { console.log(`Server is running `)});

let socketInstace = io.listen(httpServer);
socketInstace.on('connection', client => {
  client.on('send message', message => {
    console.log(message);
  })
})