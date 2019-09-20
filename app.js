

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes=require('./app/routes/index')

var app = express();


app.set('views', path.join(__dirname,'/app/views'));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded())


app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret: 'ssshhhh', cookie: {maxAge: 6000000}}));
app.use('/',routes);
app.listen(8000, function () {
	  console.log('Revision app listening on port 8000!')
	});
	
module.exports = app;