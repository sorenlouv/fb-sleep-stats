var _ = require('lodash');
var dao = require('./dao');
var facebookService = require('./facebook');
var userService = {};
var usersPromise = _.memoize(dao.getUsers);

userService.saveUsers = function(users) {
    dao.saveUsers(users);
};

userService.getUser = function(userId) {
    return usersPromise().then(function(users) {
        return _.sortBy(users[userId]);
    });
};

userService.getList = function(accessToken) {
    return usersPromise()
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
