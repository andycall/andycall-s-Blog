
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var JS_partern = require('./routes/JS_partern');
var Background = require('./routes/Background');
var TimeLine = require('./routes/TimeLine');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings.js');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 1500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser({ 
	keepExtensions : true,
	uploadDir : './public/images'
}));

app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret : settings.cookieSecret,
	key : settings.DB,
	cookie : {maxAge : 1000 * 60 * 60 * 24},// 1 day
	store : new MongoStore({
		db : settings.DB,
		username : "andycall",
		password : "dong1234"
	})
}));

app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}	


app.use(app.router);


// app.get('/', routes.index);
// app.get('/users', user.list);
routes(app);
JS_partern(app);
Background(app);
TimeLine(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
