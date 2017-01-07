var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var shortId = require('shortid');
var dbRequestHandler = require('./dbRequestHandler');


var serverPort = 5000;
app.set('port', process.env.PORT || serverPort);

// var clients			= [];

io.on('connection', function (socket) {

    var currentUser;

    socket.on('HELLO_SERVER', function () {

        console.log('Users Connected ');
        socket.emit('WELCOME_MESSAGE', {
            msg: "lalala hi"
        });

    });

    socket.on('PICKED_UP_FOOD', function (data) {

        var playerId = data.playerId;
        var playerScore = data.playerScore;


        console.log('User picked up food ');
        socket.emit('PLAYER_SCORED', {
            msg: "active player scored"
        });

    });

    socket.on('GAME_OVER', function (data) {

        var playerId = data.playerId;
        var playerScore = data.playerScore;

        console.log('User requested game over list');

        dbRequestHandler.insertHighScore(playerId, playerScore, function (result) {
            if (result.success){
                console.log('HighScore inserted');
            }
        });

    });

    socket.on('GET_HIGHSCORE_LIST', function () {

        console.log('User requested highscore list');

        dbRequestHandler.getHighScoreList(function (highscores) {
            socket.emit('HIGHSCORE_LIST', {
                // send big json with top 100 player scores
                msg: JSON.stringify(highscores)
            });
        });

    });

    socket.on('SNAKE_POSITION', function (snakeData) {
        var snakePos = JSON.stringify(snakeData)
        console.log('SNAKE_POSITION = ' + snakePos);
    });


    // socket.on('PLAY', function (data){
    // 	currentUser = {
    // 		name:data.name,
    // 		id:shortId.generate(),
    // 		position:data.position
    // 	}

    // 	clients.push(currentUser);
    // 	socket.emit('PLAY',currentUser );
    // 	socket.broadcast.emit('USER_CONNECTED',currentUser);

    // });

    socket.on('disconnect', function () {
        console.log("User disconnected");

        // socket.broadcast.emit('USER_DISCONNECTED',currentUser);
        // for (var i = 0; i < clients.length; i++) {
        // 	if (clients[i].name === currentUser.name && clients[i].id === currentUser.id) {

        // 		console.log("User "+clients[i].name+" id: "+clients[i].id+" has disconnected");
        // 		clients.splice(i,1);

        // 	};
        // };

    });


});


server.listen(app.get('port'), function () {
    console.log("------- server is running port " + serverPort + " -------");
});

