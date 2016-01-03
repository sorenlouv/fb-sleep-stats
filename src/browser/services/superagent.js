var superagent = require('superagent');
var Q = require('q');

superagent.Request.prototype.asPromise = function() {
    var _this = this;
    return Q.Promise(function(resolve, reject) {
        _this.end(function(err, res) {
            if (err) {
                reject(err);
            }

            resolve(res.body);
        });
    });
};

module.exports = superagent;
