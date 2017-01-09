/**
 * Created by cj on 2016-12-13.
 */

var mysql = require("mysql");

var connection = mysql.createConnection({

    host: "ireland-snakedb.c9tyflpct36x.eu-west-1.rds.amazonaws.com",
    user: "serverutv",
    password: "!Qaz2wsx",
    database: "snakevrDb"
});

connection.connect(function (error) {
    if (!!error) {
        console.log("Error when connecting to DB, "+ error);
    } else {
        console.log("Connected to DB");
    }

});


module.exports = {

    getHighScoreList: function (callback) {
        var query = "SELECT * FROM Highscore ORDER BY score DESC limit 10";
        var highscores = [];

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {

                for (var i = rows.length - 1; i >= 0; i--) {

                    var rUsername = rows[i].username;
                    var rScore = rows[i].score;

                    var score = {username: rUsername, score: rScore};

                    highscores.push(score);
                }
                var result = {highscores: highscores};

                callback(result);
            }

        });

    },

    insertHighScore: function (playername,playerscore, callback) {

        var timestamp  = new Date();
        var query = "INSERT INTO Highscore (username, score) VALUES ('" + playername + "'," + playerscore + ")";

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in insert highscore query, %j", error.message);

            } else {
                callback({success: true});
            }

        });

    },

    authenticateUser: function (playernamename,playerpassword, callback) {
        var query = "SELECT username FROM User WHERE username ='" + playername + "' and password ='" + playerpassword +"'";

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);
                callback({success: false});
            } else {
                if (rows.length > 0) {
                    var rId = rows[0].id;
                    var rUsername = rows[0].username;

                    callback({success: true, playerid: rId, username: rUsername});
                } else {
                    callback({success: false});
                }
            }
        });
    },


    registerUser: function (username,password, callback) {

        var query = "INSERT INTO User (username, password) VALUES (" + username + "," + password + ")";

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);
                callback({success: false});
            } else {
                callback({success: true});
            }

        });
    }
};
















