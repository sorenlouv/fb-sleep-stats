var _ = require('lodash');
var config = require('config');
var fbCookie = config.get('fbCookie');
var fbSleep = require('fb-sleep');
var userService = require('./src/server/services/user');
var TEN_MINUTES = 1000 * 60 * 10;

function getRandomDelay() {
    var delay = _.random(TEN_MINUTES * 0.9, TEN_MINUTES);
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

getAndSaveUsers(fbCookie, Date.now() - TEN_MINUTES);
