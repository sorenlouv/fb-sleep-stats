var superagent = require('superagent');
var Bluebird = require('bluebird');

superagent.Request.prototype.asPromise = function() {
    var _this = this;
    return new Bluebird(function(resolve, reject) {
        _this.end(function(err, res) {
            if (err) {
                reject(err);
            }

            resolve(res.body);
        });
    });
};

module.exports = superagent;
