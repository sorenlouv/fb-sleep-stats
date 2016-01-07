var _ = require('lodash');
var config = require('config');
var fbCookie = config.get('fbCookie');
var fbSleep = require('fb-sleep');
var userService = require('./src/server/services/user');
var POLLING_INTERVAL = 1000 * 60 * 10;

function getAndSaveUsers(config, timeSinceLastCheck) {
    fbSleep.getRecentlyActiveUsers(config, timeSinceLastCheck)
        .then(function(users) {
            console.log(users);
            console.log(new Date().toLocaleString(), ' - ', users.length, 'active users');
            return userService.saveUsers(users);
        })
        .then(function() {
            var delay = _.random(POLLING_INTERVAL * 0.9, POLLING_INTERVAL);
            setTimeout(getAndSaveUsers.bind(null, config, delay), delay);
        })
        .done();
}

getAndSaveUsers(fbCookie, POLLING_INTERVAL);
