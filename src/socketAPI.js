const socketio = require('socket.io');
const io = socketio();
const socketAPI = {};
socketAPI.io = io;
const users = [];

io.on('connection', (socket) => {
  console.log('user connected.');
  socket.on('newUser', (data) => {
    const defaultData = {
      id: socket.id,
      position: {
        x: 0,
        y: 0
      }
    };
    const userData = Object.assign(data, defaultData);
    users.push(userData);
    //console.log(users);
    socket.broadcast.emit('newUser', userData);
  });
});

module.exports = socketAPI;