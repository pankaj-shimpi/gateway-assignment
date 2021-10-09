const requests = (connectionPool, interval) => {
  setInterval(() => {
    connectionPool.map(socket => {
      socket.emit('send message', `This message is from ${socket.id} client at ${new Date().toISOString()}`);
    })
  }, interval*1000);
}

module.exports = { requests };