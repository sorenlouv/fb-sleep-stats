var fs = require('fs');
var path = require('path');
var lowdb = require('lowdb');
var storage = require('lowdb/file-async');
var dao = {};
var REFRESH_RATE = 1000 * 60 * 10;
var dbPath = path.resolve(__dirname, 'db.json');
var db = getDb();

if (!isDbValid(db)) {
    createDb();
}

function getDb() {
    return lowdb(dbPath, {
        storage: storage,
    });
}

function isDbValid(db) {
    return db.object.hasOwnProperty('users') && db.object.hasOwnProperty('updates');
}

function createDb() {
    var content = JSON.stringify({
        updates: [],
        users: {}
    });

    try {
        fs.writeFileSync(dbPath, content, {
            flags: 'w'
        });
        db = getDb();
    } catch(e) {
        console.error(e);
    }
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
