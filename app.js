/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , site = require('./site')
  , oauth2 = require('./oauth2-server')
  , user = require('./user')
  , util = require('util')
  
  
// Express configuration
  
var app = express.createServer();
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
// app.use(express.session({ secret: 'keyboard cat' }));

/*
app.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Load Passport configuration
require('./auth');

// Api help endpoint
app.post('/api/help');

// Home
app.get('/', site.index);

// OAuth endpoint
app.post('/oauth/access_token', oauth2.token);

// Teacher endpoints
app.get('/api/teacher/profile');

// Reviews endpoints
app.get('/api/reviews/pending');
app.get('/api/reviews/done');
app.get('/api/reviews/all');
app.post('/api/reviews');

// Sync endpoint
app.post('/api/sync');

// Report endpoints (Available for admin only)
app.get('/api/reports/:report_name');
app.get('/api/reports/main-report');

app.listen(3000);
