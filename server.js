var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var shortId = require('shortid');
var dbRequestHandler = require('./dbRequestHandler');


var serverPort = 5000;
app.set('port', process.env.PORT || serverPort);


var players = [];
var lobby = [];
io.on('connection', function (socket) {

    var currentUser = {};

    socket.on('HELLO_SERVER', function (snakeData) {
        var snakePos = JSON.stringify(snakeData)
		console.log('Users Connected ' + snakePos);
		socket.emit('WELCOME_MESSAGE',snakeData);
        //socket.broadcast.emit('NEWPLAYER_JOINED',snakeData);

    });

    socket.on('PICKED_UP_FOOD', function (data) {

        var playerId = data.playerid;
        var playername = data.playername;
        var score = data.score;
        console.log('User picked up food, username: '+ playername + 'score: ' + score);
        var strData = JSON.stringify(data);
        console.log('User picked up food' + strData);
        socket.broadcast.emit('PLAYER_SCORED', data);
        socket.broadcast.emit('SPAWN_FOOD',data);

    });

    socket.on('PLAYER_READY', function (snakeData) {

        var playerId = snakeData.playerid;
        var playername = snakeData.playername;

        console.log('User id:  '+ playerId+ ' name: ' + playername +' PLAYER_READY');

        socket.emit('PLAYER_BEGIN_GAME',snakeData);
        socket.broadcast.emit('NEWPLAYER_JOINED',snakeData);
    });

    socket.on('GAME_OVER', function (data) {

        var playerId = data.playerId;
        var playerScore = data.playerScore;

        console.log('User requested game over list');

        dbRequestHandler.insertHighScore(playerId, playerScore, function (result) {
            if (result.success) {
                console.log('HighScore inserted');
            }
        });

    });

    socket.on('PLAYER_DIED', function (snakeData) {

        var playerId = snakeData.playerid;
        var playername = snakeData.playername;

        console.log('User id:  '+ playerId+ ' name: ' + playername +' PLAYER_READY');

        socket.emit('RESPAWN_PLAYER',snakeData);

    });

    socket.on('LOGIN', function (indata) {
        var data = JSON.parse(indata.utf8Data)
        var username = data.username;
        var password = data.password;

        dbRequestHandler.authenticateUser(username, password, function (result) {
            if (result.success){
                console.log('Login successful, user: ' + username + ': pw: '+password);
                socket.emit('LOGIN_SUCCESS');
            } else {
                console.log('Login failed, user: ' + username + ': pw: '+password);
                socket.emit('LOGIN_FAILED');
            }
        })
    });

    socket.on('REGISTER', function (indata) {
        var data = JSON.parse(indata.utf8Data)
        var username = data.username;
        var password = data.password;

        dbRequestHandler.registerUser(username, password, function (result) {
            if (result.success){
                console.log('Register successful, user: ' + username + ': pw: '+password);
                socket.emit('REGISTER_SUCCESS');
            } else {
                console.log('Register failed, user: ' + username + ': pw: '+password);
                socket.emit('REGISTER_FAILED');
            }
        });
    });

    socket.on('POST_HIGHSCORE', function (indata) {

        var username = indata.playername;
        var score = indata.score;
        console.log('Goin to save high score for name: ' + username + ', whit score: ' + score);



        dbRequestHandler.insertHighScore(username, score, function (result) {
            if (result.success){
                console.log('Highscore saved successful');
            } else {
                console.log('Highscore saved failed');
            }
        });
    });



    socket.on('GET_HIGHSCORE_LIST', function () {

        console.log('User requested highscore list');

        dbRequestHandler.getHighScoreList(function (highscores) {

            console.log('highscore list: '+ JSON.stringify(highscores));
            socket.emit('HIGHSCORE_LIST', highscores);
        });

    });

    socket.on('SNAKE_POSITION', function (snakeData) {
        var snakePos = JSON.stringify(snakeData)
        //console.log('SNAKE_POSITION = ' + snakePos);
        // socket.emit('SNAKE_POSITION_UPDATE',snakeData);
        socket.broadcast.emit('SNAKE_POSITION_UPDATE', snakeData);
    });


    socket.on('disconnect', function () {
        console.log("User disconnected, och auto deploy works");

    });
});


server.listen(app.get('port'), function () {
    console.log("------- server is running port " + serverPort + " -------");
});

