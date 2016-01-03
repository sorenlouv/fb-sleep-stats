var config = require('config');
var fbSleep = require('fb-sleep');
var fbCookie = config.get('fbCookie');
fbSleep.scrape(fbCookie);
