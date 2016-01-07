var path = require('path');
var lowdb = require('lowdb');
var storage = require('lowdb/file-async');
var dao = {};
var db = getDb();
var REFRESH_RATE = 1000 * 60 * 10;

refreshDb();

function getDb() {
    return lowdb(path.resolve(__dirname, 'db.json'), {
        storage: storage,
    });
}

function refreshDb() {
    setInterval(function() {
        db = getDb();
    }, REFRESH_RATE);
}

dao.getUsers = function() {
    return db('users').cloneDeep();
};

dao.saveUsers = function(users) {
    db('updates').push(Date.now());

    if (!db.object.users) {
        db.object.users = {};
    }

    users.forEach(function(user) {
        if (!db.object.users[user.userId]) {
            db.object.users[user.userId] = [];
        }
        db.object.users[user.userId].push(user.timestamp);
    });
    db.write();
};

module.exports = dao;
