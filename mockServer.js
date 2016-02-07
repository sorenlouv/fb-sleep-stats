var express = require('express');
var PORT = 8989;
var app = express();
var router = express.Router();

router.get('/', function(req, res) {
    res.sendStatus(500);
});

app.use(router);

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
