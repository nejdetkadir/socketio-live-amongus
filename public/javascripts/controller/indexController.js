app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

  $scope.messages = [];
  $scope.players = {};
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

      socket.on('initPlayers', (data) => {
        $scope.players = data;
        $scope.$apply();
      });

      socket.on('newUser', (data) => {
        const messageData = {
          type: {
            code: 0, //info, this mean message sent from server
            message: 1
          },
          username: data.username
        };
        $scope.messages.push(messageData);
        $scope.players[data.id] = data;
        $scope.$apply();
      });

      socket.on('disUser', (data) => {
        //console.log(data);
        const messageData = {
          type: {
            code: 0,
            message: 0
          },
          username: data.username
        };
        $scope.messages.push(messageData);
        delete $scope.players[data.id];
        $scope.$apply();
      });

      socket.on('animate', (data) => {
        $('#'+data.socketId).animate({
          'left': data.x,
          'top': data.y,
        }, () => {
          animate = false;
        });
      });

      let animate = false;
      $scope.onClickPlayer = ($event) => {
        let x = $event.offsetX;
        let y = $event.offsetY;
        socket.emit('animate', {x, y});

        if (!animate) {
          animate=true;
          $('#'+socket.id).animate({
            'left': x,
            'top': y,
          }, () => {
            animate = false;
          });
        }
      };
    }).catch((err) => {
      console.log(err);
    });
  }
}]);