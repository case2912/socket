const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
  ctx.body = new Date();
});
const server = app.listen(3000, '10.0.1.54');
const io = require('socket.io').listen(server);
const data = {}
io.on('connection', (socket) => {
  console.log('connected count:' + socket.server.eio.clientsCount);
  socket.on("positionFromClient", function(dataFromClient) {
    if (data[socket.id] === void 0) data[socket.id] = {}
    data[socket.id].position = {
      x: dataFromClient.position_x,
      y: dataFromClient.position_y
    }
  });
  socket.on("rotationFromClient", function(dataFromClient) {
    if (data[socket.id] === void 0) data[socket.id] = {}
    data[socket.id].rotation = {
      x: dataFromClient.rotation_x,
      y: dataFromClient.rotation_y,
      z: dataFromClient.rotation_z
    }
    console.log(data[socket.id].rotation);
  });
  socket.on('disconnect', function() {
    console.log('disconnected count:' + socket.server.eio.clientsCount);
    delete data[socket.id];
  });
});
