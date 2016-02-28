var _ = require('lodash');
var config = require('config');
var fbCookie = config.get('fbCookie');
var fbSleep = require('fb-sleep');
var userService = require('./src/server/services/user');
var TEN_MINUTES = 1000 * 60 * 10;
var pollingInterval = (config.pollingInterval * 1000) || TEN_MINUTES;

function getRandomDelay() {
    return _.random(pollingInterval * 0.9, pollingInterval);
}

function getFormattedUsers(users) {
    return _(users)
        .map(function(timestamp, userId) {
            return {
                userId: userId,
                timestamp: timestamp * 1000
            };
        })
        .value();
}

function getRecentlyActiveUsers(users, since) {
    users = getFormattedUsers(users);
    var timestampDiff = getTimestampDiff(users);

    return users.filter(function(user) {
        return user.timestamp >= (since - timestampDiff);
    });
}

function getTimestampDiff(users) {
    var mostRecentTimestamp = _(users)
        .orderBy('timestamp')
        .map('timestamp')
        .last();

    return Date.now() - mostRecentTimestamp;
}

function getAndSaveActiveUsers(config, since) {
    fbSleep.getUsers(config)
        .then(function(users) {
            var activeUsers = getRecentlyActiveUsers(users, since);

            console.log(new Date().toLocaleString(), ' - Active users: ', activeUsers.length, '/', _.size(users));
            return userService.saveUsers(activeUsers);
        })
        .catch(function(err) {
            console.error(new Date().toLocaleString(), 'An error occured while scraping. Please check to make sure your development.json config is correct', err);
        })
        .then(function() {
            var since = Date.now();
            setTimeout(getAndSaveActiveUsers, getRandomDelay(), config, since);
        })
        .done();
}

console.log('Polling every', pollingInterval/1000, 'seconds');
getAndSaveActiveUsers(fbCookie, Date.now() - pollingInterval);
