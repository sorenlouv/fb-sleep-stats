var Q = require('q');
var facebookService = {};

var fbPromise = Q.Promise(function(resolve) {
    window.fbAsyncInit = function() {
        window.FB.init({
            appId: '435522656639081',
            xfbml: true,
            cookie: true,
            version: 'v2.2'
        });

        window.FB.getLoginStatus();

        window.FB.Event.subscribe('auth.statusChange', function(response) {
            var isAuthenticated = response.status === 'connected';
            if (isAuthenticated) {
                var expires = new Date(Date.now() + response.authResponse.expiresIn * 1000).toUTCString();
                var cookie = [];
                cookie.push('fbAccessToken=' + response.authResponse.accessToken);
                cookie.push('expires=' + expires);
                cookie.push('path=/');
                document.cookie = cookie.join(';');
            }
        });

        resolve(window.FB);
    };
});

facebookService.onAuthChange = function(cb) {
    return fbPromise.then(function(FB) {
        FB.Event.subscribe('auth.statusChange', function(response) {
            var isAuthenticated = response.status === 'connected';
            cb(isAuthenticated);
        });
    });
};

facebookService.login = function() {
    fbPromise.then(function(FB) {
        FB.login();
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

module.exports = facebookService;
