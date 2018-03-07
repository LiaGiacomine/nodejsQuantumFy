// ================================================================
// Server-side set up
// ================================================================
var cron = require('node-cron');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var ExpressValidator = require('express-validator');
var body_parser = require('body-parser');
var routes = require('./routes/index.js');
var app = express();

// ================================================================
// Configure server to call script that adds papers to the
// database every day at 12:30
// ================================================================
var load_papers = require('./routes/run_daily/upload_papers_to_db');
cron.schedule('42 18 * * *', function(){
  load_papers();
  console.log('addData is running');
});

// Set up port 
var port = process.env.PORT || 3000;

// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

// ================================================================
// SETUP SESSION and
// BODYPASER middleware for LOGIN/REGISTRATION FORM
// ================================================================
app.use(cookieParser());
app.use(session({secret:"secret", saveUninitialized: false, resave: false}));

// app.use(function(req, res, next) {
//   res.locals.user = req.session.username;
//   next();
// });

app.use(body_parser.urlencoded({ extended : true }));
app.use(body_parser.json());
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
// setup routes
// ================================================================
routes(app);

// ================================================================
// start our server
// ================================================================
app.listen(port, function() {
    console.log('Server listening on port ' + port + '...');
});