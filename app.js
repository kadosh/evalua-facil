// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var facultyMembersController = require('./controllers/faculty-members');
var accountController = require('./controllers/account');
var gradesController = require('./controllers/grades');
var allocationsController = require('./controllers/allocations');
var bimestersController = require('./controllers/bimesters');
var revisionsController = require('./controllers/revisions');
var testController = require('./controllers/test');

var schoolGroupsController = require('./controllers/school-groups');
var subjectsController = require('./controllers/subjects');
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

	// Api endpoints for School Groups
router.route('/api/school-groups/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, schoolGroupsController.getGroups);
router.route('/api/school-groups/')
	.put(oauthStrategies.isBearerAuthenticated, schoolGroupsController.putGroup);
	
	// Api endpoints for Subjects
router.route('/api/subjects/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, subjectsController.getSubjects);
	
router.route('/api/subjects')
	.put(oauthStrategies.isBearerAuthenticated, subjectsController.putSubject);

	// Api endpoints for Grades
router.route('/api/grades')
	.get(oauthStrategies.isBearerAuthenticated, gradesController.getGrades)
	.put(oauthStrategies.isBearerAuthenticated, gradesController.putGrade);

	// Api endpoints for Allocations
router.route('/api/allocations')
	.put(oauthStrategies.isBearerAuthenticated, allocationsController.putAllocation);

	// Api endpoints for Bimesters
router.route('/api/bimesters')
	.put(oauthStrategies.isBearerAuthenticated, bimestersController.putBimester);
	
	// Api endpoints for Revisions
router.route('/api/revisions/me/pending')
	.get(oauthStrategies.isBearerAuthenticated, revisionsController.getMePendingRevisions);

router.route('/api/testing')
	.get(testController.get);
	
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