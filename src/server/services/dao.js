var fs = require('fs');
var path = require('path');
var lowdb = require('lowdb');
var storage = require('lowdb/file-async');
var dao = {};
var REFRESH_RATE = 1000 * 60 * 10;
var dbPath = path.resolve(__dirname, 'db.json');

if (!isDbCreated()) {
    createDb();
}
var db = getDb();

function getDb() {
    return lowdb(dbPath, {
        storage: storage,
    });
}

function isDbCreated() {
    try {
        fs.statSync(dbPath);
        return true;
    } catch (e) {
        return false;
    }
}

function createDb() {
    var content = JSON.stringify({
        updates: [],
        users: {}
    });
    fs.writeFile(dbPath, content, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

setInterval(function() {
    db = getDb();
}, REFRESH_RATE);

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
