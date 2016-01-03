var superagent = require('./superagent');
var userService = {};

userService.getList = function() {
    return superagent
        .get('/rest/users')
        .set('Accept', 'application/json')
        .asPromise();
};

userService.getActivity = function(userId) {
    return superagent
        .get('/rest/users/' + userId)
        .set('Accept', 'application/json')
        .asPromise();
};

module.exports = userService;
