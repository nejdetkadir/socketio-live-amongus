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
  
  function scrollTop() {
    setTimeout(() => {
      const element = document.getElementById('chat-area');
      element.scrollTop = element.scrollHeight;
    });
  }
  
  function showBubble(id, message) {
    $('#' + id).find('.message').show().html(message);
    setTimeout(() => {
      $('#' + id).find('.message').hide();
    }, 2000);
  }

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
        scrollTop();
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
        scrollTop();
      });

      socket.on('animate', (data) => {
        $('#'+data.socketId).animate({
          'left': data.x,
          'top': data.y,
        }, () => {
          animate = false;
        });
      });

      socket.on('newMessage', (data) => {
        $scope.messages.push(data);
        $scope.$apply();
        showBubble(data.socketId, data.text);
        scrollTop();
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

      $scope.newMessage = () => {
        let message = $scope.message;
        const messageData = {
          type: {
            code: 1, //user message, this mean message sent from any player
          },
          username: username,
          text: message
        };
        $scope.messages.push(messageData);
        $scope.message = '';

        socket.emit('newMessage', messageData);
        showBubble(socket.id, message);
        scrollTop();
      };

    }).catch((err) => {
      console.log(err);
    });
  }
}]);