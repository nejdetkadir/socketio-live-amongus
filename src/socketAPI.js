const socketio = require('socket.io');
const io = socketio();
const socketAPI = {};
socketAPI.io = io;
const users = {};

io.on('connection', (socket) => {
  //console.log('user connected.');
  socket.on('newUser', (data) => {
    const defaultData = {
      id: socket.id,
      position: {
        x: 0,
        y: 0
      }
    };
    const userData = Object.assign(data, defaultData);
    users[socket.id] = userData;
    //console.log(users);
    socket.broadcast.emit('newUser', users[socket.id]);
    socket.emit('initPlayers', users);
  });

  socket.on('disconnect', () => {
    //console.log('user disconnected.');
    socket.broadcast.emit('disUser', users[socket.id]);
    delete users[socket.id];
    console.log(users);
  });
});

module.exports = socketAPI;