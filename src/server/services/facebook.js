var Q = require('q');
var _ = require('lodash');
var request = require('request-promise');

var facebookService = {};

facebookService.getUsers = _.memoize(function(accessToken, userIds) {
    var promises = _.chunk(userIds, 50).map(function(userIdChunk) {
        return request({
            url: 'https://graph.facebook.com/?ids=' + userIdChunk.join(',') + '&access_token=' + accessToken,
            json: true,
            gzip: true
        })
        .catch(function(res) {
            if (_.has(res, 'response.body.error')) {
                throw res.response.body.error;
            }
            throw res;
        });
    });

    return Q.all(promises).then(function(response) {
        return _.assign.apply(_, response);
    });
});

module.exports = facebookService;

