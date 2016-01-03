var userService = {};
var _ = require('lodash');
var fbSleep = require('fb-sleep');
var facebookService = require('./facebook');

userService.getUsers = _.memoize(fbSleep.getUsers);

userService.getUser = function(userId) {
    return userService.getUsers().then(function(users) {
        return _.zip(
            getTimestamps(users),
            getUserTimeline(users, userId)
        );
    });
};

function getTimestamps(users) {
    return _.map(users, 'time');
}

function getUserTimeline(users, userId) {
    return _.map(users, function(post) {
        var isActive = post.users.indexOf(userId) > -1;
        return isActive ? 1 : 0;
    });
}

userService.getList = function(accessToken) {
    return userService.getUsers()
        .then(function(users) {
            var userIdsFlatten = _.flatten(_.map(users, 'users')); // TODO: change users to userIds
            var userIds = _.unique(userIdsFlatten);
            var occurences = _.countBy(userIdsFlatten);

            return facebookService.getUsers(accessToken, userIds)
                .then(function(facebookUsers) {
                    return _(facebookUsers)
                       .map(function(user) {
                           user.occurences = occurences[user.id];
                           return user;
                       })
                       .sortByOrder('occurences', 'desc');
                });
        });
};

module.exports = userService;
