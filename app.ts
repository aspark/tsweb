///<reference path="typings/express/express.d.ts" />
///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/body-parser/body-parser.d.ts"/>
///<reference path="typings/errorhandler/errorhandler.d.ts"/>

import http = require('http');
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import errorhandler = require('errorhandler');
// import util = require('util')

var app = express();


app.set('port', process.env.port||3000);
app.set('views', path.join(__dirname+'/../views'));
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(express.static(__dirname+'public'));

app.use(errorhandler());

require('./controllers/MvcStartup').MVC.MvcStartup.registerAllControllers(path.join(__dirname, 'controllers'), app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('server starting');
});

// expresss./
