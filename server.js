var express = require('express');
var app = express();
var path = require('path');
var hbs = require('express-handlebars');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var process = require('process');

var mongOpts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
}

mongoose.connect(process.env.MONGO, mongOpts);

app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));

app.use(flash());
require('./app/passport.js')(app, passport);

app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'cool cats climbing crags', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app,passport);

app.set('port', process.env.PORT || 8080);

app.listen(process.env.port || 8080, function(){
    console.log("Server running at http://localhost:"+app.get('port')+" - Press Ctrl + C to terminate.");
});