// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var facultyMembersController = require('./controllers/faculty-members');
var accountController = require('./controllers/account');
var schoolGroupsController = require('./controllers/school-groups');
var oauthStrategies = require('./controllers/oauth-strategies');
var oauthServer = require('./controllers/oauth2-server');

// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'jade');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({   extended: true }));

// Use express session support since OAuth2orize requires it
app.use(session({ 
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

router.route('/oauth/token')
	.post(oauthStrategies.isClientAuthenticated, oauthServer.token);
	
router.route('/api/faculty-members')
	.get(oauthStrategies.isBearerAuthenticated, facultyMembersController.getAll)
	.put(oauthStrategies.isBearerAuthenticated, facultyMembersController.putFacultyMember);
	
router.route('/api/account/me')
	.get(oauthStrategies.isBearerAuthenticated, accountController.getMe);

router.route('/api/school-groups/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, schoolGroupsController.getGroups);
	
	

// Register all our routes
app.use(router);

// Start the server
app.listen(3000);


// Create endpoint handlers for /grades
/*
router.route('/api/grades')
  .get(gradesController.getGrades);

router.route('/api/grades/:grade_number')
  .get(gradesController.getGrade)
  


router.route('/api/faculty-members/:faculty_member_id')
	.get(facultyMembersController.getFacultyMember);
*/