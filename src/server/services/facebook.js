var Bluebird = require('bluebird');
var _ = require('lodash');
var request = require('request-promise');

var facebookService = {};

facebookService.getUsers = _.memoize(function(accessToken, userIds) {
    var promises = _.chunk(userIds, 50).map(function(userIdChunk) {
        return request({
            url: 'https://graph.facebook.com',
            qs: {
                ids: userIdChunk.join(','),
                access_token: accessToken
            },
            json: true,
            gzip: true
        })
        .catch(function(res) {
            facebookService.getUsers.cache.delete(accessToken);
            if (_.has(res, 'response.body.error')) {
                throw res.response.body.error;
            }
            throw res;
        });
    });

    return Bluebird.all(promises).then(function(response) {
        return _.assign.apply(_, response);
    });
});

module.exports = facebookService;

