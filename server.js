function getLocalAddress() {
  var ifacesObj = {}
  ifacesObj.ipv4 = [];
  var interfaces = require('os').networkInterfaces();
  for (var dev in interfaces) {
    interfaces[dev].forEach(function(details) {
      if (!details.internal) {
        switch (details.family) {
          case "IPv4":
            ifacesObj.ipv4.push({
              name: dev,
              address: details.address
            });
            break;
        }
      }
    });
  }
  return ifacesObj.ipv4[0].address;
};
const Koa = require('koa');
const app = new Koa();
const address = getLocalAddress();
app.use(require('koa-static')('./client'));
const server = app.listen(3000, address, function() {
  console.log('\u001b[33m' + 'Available on:');
  console.log('\u001b[32m' + '  http://' + address + ':3000/display.html' + '\u001b[0m');
  console.log('Hit CTRL-C to stop the server');
});
const io = require('socket.io').listen(server);
const data = {};
io.on('connection', (socket) => {
  console.log('connected count:' + socket.server.eio.clientsCount);
  socket.on("dataFromClient", function(dataFromClient) {
    data["id-" + socket.id] = dataFromClient;
    socket.broadcast.emit("data", data);
  });
  socket.on('disconnect', function() {
    console.log('disconnected count:' + socket.server.eio.clientsCount);
    delete data["id-" + socket.id];
    socket.broadcast.emit("disconnectClientID", "id-" + socket.id);
  });
});
