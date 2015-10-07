///<reference path="typings/express/express.d.ts" />
///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/body-parser/body-parser.d.ts"/>
///<reference path="typings/errorhandler/errorhandler.d.ts"/>
var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var app = express();
app.set('port', process.env.port || 3000);
app.set('views', __dirname + '../views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(express.static(__dirname + 'public'));
app.use(errorhandler());
var ctrl = require('./controllers/IController');
ctrl.Controllers.Controller.getAllRoutes(path.join(__dirname, 'controllers')).forEach(function (rt) {
    app.use(rt.Name, rt.Router);
});
http.createServer(app).listen(app.get('port'), function () {
    console.log('server starting');
});
//# sourceMappingURL=app.js.map