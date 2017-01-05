/**
 * Created by cj on 2016-12-13.
 */

var mysql = require("mysql");

var connection = mysql.createConnection({

    host: "localhost",
    user: "serverutv",
    password: "!Qaz2wsx",
    database: "communityDB"
});

connection.connect(function (error) {
    if (!!error) {
        console.log("Error when connecting to DB");
    } else {
        console.log("Connected to DB");
    }

});


module.exports = {

    getGroups: function (id, callback) {
        var groups = []
        var query = "SELECT * FROM CommunityDB.Group";

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {

                for (var i = rows.length - 1; i >= 0; i--) {
                    var rId = rows[i].id;
                    var rName = rows[i].name;

                    var group = {id: rId, name: rName};

                    groups.push(group);
                }
                ;
                callback(groups);
            }

        });
    },


    getMessagesByGroup: function (id, callback) {
        var messages = [];
        var query = "SELECT * FROM MESSAGE WHERE groupId=" + id;

        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);
            } else {
                for (var i = rows.length - 1; i >= 0; i--) {
                    var rId = rows[i].id;
                    var rFromId = rows[i].fromId;
                    var rGroupId = rows[i].groupId;
                    var rText = rows[i].text;
                    var rTimestamp = rows[i].timestamp;

                    var msg = {id: rId, fromId: rFromId, groupId: rGroupId, text: rText, timestamp: rTimestamp};

                    messages.push(msg);
                }
                ;
                callback(messages);
            }

        });
    },

    insertMessageToUser: function (fromId, toId, text,  fromName, toName, callback) {
        var query = "INSERT INTO Message (fromId,toId,text,fromName,toName) VALUES (" + fromId + "," + toId + ",'" + text + "','" + fromName +"','" + toName+ "')";
        console.log("query call = " + query);
        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                console.log("success");
                callback({success: true});
            }
        });
    },

    insertMessageToGroup: function (fromId, groupId, text, fromName, toName,callback) {
        //INSERT INTO Message (fromId,groupId,text,fromName,toName) VALUES (?,?,?,?,?)"
        var query = "INSERT INTO Message (fromId,groupId,text,fromName,toName) VALUES (" + fromId + "," + groupId + ",'" + text + "','" + fromName +"','" + toName+ "')";
        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                console.log("success");
                callback({success: true});
            }
        });
    },


    getMessagesBetweenUsers: function (fromId, toId, callback) {

        var messages = [];
        var query = "SELECT * FROM MESSAGE WHERE (fromId =" + fromId + " and toId =" + toId + ") or (fromId =" + toId + " and toId =" + fromId + ")";

        console.log("getMessagesBetweenUsers query = " + query);
        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                for (var i = rows.length - 1; i >= 0; i--) {

                    var rId = rows[i].id;
                    var rFromId = rows[i].fromId;
                    var rToId = rows[i].toId;
                    var rText = rows[i].text;
                    var rTimestamp = rows[i].timestamp;

                    var msg = {id: rId, fromId: rFromId, toId: rToId, text: rText, timestamp: rTimestamp};

                    messages.push(msg);
                }
                ;
            }

            messages.sort(function (a, b) {
                if (a.timestamp > b.timestamp) {
                    return -1;
                }
                if (a.timestamp < b.timestamp) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
            var msg = JSON.stringify(messages, null, 4);
//     console.log(`Super result: ${str}`);
            console.log("getMessagesBetweenUsers done = " );
            callback(messages);
            return messages

        });
    },

    joinGroup: function (groupId, userId, callback) {
        var query = "INSERT INTO CommunityDB.GroupUserId (groupId, userId) VALUES (" + groupId + "," + userId + ")";
        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                console.log("success");
                callback({success: true});
            }
        });
    },
    createGroup: function (groupName, userId, callback) {
        var query = "INSERT INTO CommunityDB.Group (name) VALUES (" + groupName+ ")";
        connection.query(query, function (error, result) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                console.log("success result.insertId = " + result.insertId);
                callback({success: true,groupId:result.insertId});
            }
        });
    },

    usersByGroup: function (groupId, callback) {
        var userIds = [];
        var query = "SELECT * FROM CommunityDB.GroupUserId WHERE groupId = " + groupId;
        connection.query(query, function (error, rows, fields) {
            if (!!error) {
                console.log("Error in query, %j", error.message);

            } else {
                for (var i = rows.length - 1; i >= 0; i--) {
                    var rId = rows[i].userId;
                    userIds.push(rId);

                };

                // filters all duplications, if pos equals last index then false
                // else true
                userIds.sort().filter(function(item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })


                console.log("success");
                callback({groupId: groupId, userIds: userIds});
            }
        });
    }
};
















