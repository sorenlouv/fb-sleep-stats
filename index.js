var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var app = express();
var PORT = 9090;

// Cookies
app.use(cookieParser());

// Router
var router = require('./src/server/routes');
app.use(router);

// Static assets
app.use('/public', express.static('public'));

app.get('/*', function(request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Avoid crashing the node process by handling uncaught exceptions
process.on('uncaughtException', function(err) {
    console.error('Uncaught exception:', err, err.stack);
});

// Start app
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
