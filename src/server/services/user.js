var userService = {};
var _ = require('lodash');
var fbSleep = require('fb-sleep');
var facebookService = require('./facebook');

userService.getUsers = _.memoize(fbSleep.getUsers);

userService.getUser = function(userId) {
    return userService.getUsers().then(function(users) {
        if (!users[userId]) {
            return [];
        }
        return users[userId].sort(function(a, b) {
            return a - b;
        });
    });
};

userService.getList = function(accessToken) {
    return userService.getUsers()
        .then(function(users) {
            var userIds = Object.keys(users);
            return facebookService.getUsers(accessToken, userIds)
                .then(function(facebookUsers) {
                    return _(facebookUsers)
                        .map(function(user) {
                            user.count = users[user.id].length;
                            return user;
                        })
                        .sortByOrder('count', 'desc');
                });
        });
};

module.exports = userService;
