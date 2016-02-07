var _ = require('lodash');
var config = require('config');
var fbCookie = config.get('fbCookie');
var fbSleep = require('fb-sleep');
var userService = require('./src/server/services/user');

function getRandomDelay() {
    var POLLING_INTERVAL = 1000 * 60;
    var delay = _.random(POLLING_INTERVAL * 0.9, POLLING_INTERVAL);
    return delay;
}

function getAndSaveUsers(config, since) {
    fbSleep.getRecentlyActiveUsers(config, since)
        .then(function(users) {
            console.log(new Date().toLocaleString(), ' - ', users.length, 'active users');
            return userService.saveUsers(users);
        })
        .catch(function(err) {
            console.error(new Date().toLocaleString(),
                ' - Could not get users:', err.message, err.statusCode);
        })
        .then(function() {
            var since = Date.now();
            setTimeout(getAndSaveUsers, getRandomDelay(), config, since);
        })
        .done();
}

getAndSaveUsers(fbCookie, Date.now() - 1000 * 60);
