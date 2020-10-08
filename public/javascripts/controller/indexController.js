app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

  $scope.messages = [];

  $scope.init = () => {
    const username = prompt('Please enter your username');
    if (username)
      initSocket(username);
    else
      return false;
  };

  function initSocket(username) {
    const url = 'https://socketio-live-amongus.herokuapp.com'; // live
    //const url = 'http://localhost:3000'; // development
    indexFactory.connectSocket(url, {
      reconnectionAttempts: 3,
      reconnectionDelay: 600
    }).then((socket) => {
      //console.log('connection successfully', socket);
      socket.emit('newUser', {
        username
      });
      socket.on('newUser', (data) => {
        const messageData = {
          type: 0, //info, this mean message sent from server
          username: data.username
        };
        $scope.messages.push(messageData);
        $scope.$apply();
      });
    }).catch((err) => {
      console.log(err);
    });
  }
}]);