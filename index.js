// ================================================================
// Server-side set up
// ================================================================

//ROUTES
//var compression = require('compression');
var cron = require('node-cron');
var routes = require('./routes/index.js');
var mysql = require("mysql");
//EXPRESS
var express = require('express');
var app = express();

//SESSION
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


//COOKIE
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var ExpressValidator = require('express-validator');
var body_parser = require('body-parser');

//CONNECT TO DB FOR SESSION STORE
var options = {
  host: 'us-cdbr-iron-east-05.cleardb.net',
  port: 3306,
  user: 'b6cdf69c319f2c',
  password: '9b8be2b6',
  database: 'heroku_b2e8446a26c661e',
  expiration: 86400000,
  connectionLimit: 5
};

var connection = mysql.createPool(options);
var sessionStore = new MySQLStore(options, connection);

app.use(session({
  secret: "secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

//connection.release();

// ================================================================
// MANAGE/STORE SESSIONS
// ================================================================

app.use(body_parser.json());

app.use(body_parser.urlencoded({ extended : false }));
app.use(ExpressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split(".")
    , root = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    } return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));


// ================================================================
// Configure server to call script that adds papers to the
// database every day at 12:30
// ================================================================
var load_papers = require('./routes/run_daily/upload_papers_to_db');
cron.schedule('38 15 * * *', function(){
  load_papers();
});

// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

// ================================================================
// setup routes
// ================================================================
routes(app);

// ================================================================
// start our server
// ================================================================

app.listen(process.env.PORT || 5000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.listen(process.env.PORT || 5000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });