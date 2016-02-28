var EventEmitter = require('events');
var Bluebird = require('bluebird');
var facebookService = {};
var events = new EventEmitter();

function setFBCookie(expiresIn, accessToken) {
    var expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
    var cookie = [];
    cookie.push('fbAccessToken=' + accessToken);
    cookie.push('expires=' + expires);
    cookie.push('path=/');
    document.cookie = cookie.join(';');
    events.emit('cookie:updated');
}

var fbPromise = new Bluebird(function(resolve) {
    window.fbAsyncInit = function() {
        console.log('Facebook App Id:', __FBAPPID__);
        window.FB.init({
            appId: __FBAPPID__,
            xfbml: true,
            cookie: true,
            version: 'v2.5'
        });

        window.FB.getLoginStatus();

        window.FB.Event.subscribe('auth.statusChange', function(response) {
            var isAuthenticated = response.status === 'connected';
            if (isAuthenticated) {
                setFBCookie(response.authResponse.expiresIn, response.authResponse.accessToken);
            }
        });

        resolve(window.FB);
    };
});

facebookService.onAuthCookie = function(cb) {
    events.addListener('cookie:updated', cb);
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
