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
        var query = "SELECT * FROM Highscore limit 100";
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

    insertHighScore: function (username,score, callback) {

        var query = "INSERT INTO Highscore (username, score) VALUES (" + username + "," + score + "')";

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                callback({success: true});
            }

        });

    },

    authenticateUser: function (username,password, callback) {
        var query = "SELECT username FROM User WHERE username =" + username + " and password =" + password;

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);
                callback({success: false});
            } else {
                if (rows.length > 0) {
                    callback({success: true});
                } else {
                    callback({success: false});
                }
            }
        });
    },


    registerUser: function (username,password, callback) {

        var query = "INSERT INTO User (username, password) VALUES (" + username + "," + password + "')";

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
















