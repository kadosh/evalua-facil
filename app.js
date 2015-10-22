// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var facultyMembersController = require('./controllers/faculty-membersx');
var accountController = require('./controllers/accountx');
var gradesController = require('./controllers/gradesx');
var allocationsController = require('./controllers/allocationsx');
var bimestersController = require('./controllers/bimesters');
var revisionsController = require('./controllers/revisionsx');
var testController = require('./controllers/test');

var schoolGroupsController = require('./controllers/school-groupsx');
var subjectsController = require('./controllers/subjectsx');
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
	.put(oauthStrategies.isBearerAuthenticated, facultyMembersController.put);
	
router.route('/api/faculty-members/:faculty_member_id')
	.get(oauthStrategies.isBearerAuthenticated, facultyMembersController.getOne)
	.put(oauthStrategies.isBearerAuthenticated, facultyMembersController.update);
	
router.route('/api/account/me')
	.get(oauthStrategies.isBearerAuthenticated, accountController.getMe);

	// Api endpoints for School Groups
router.route('/api/school-groups/in-grade-number/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, schoolGroupsController.getAllByGradeNumber);
router.route('/api/school-groups/')
	.put(oauthStrategies.isBearerAuthenticated, schoolGroupsController.put);
router.route('/api/school-groups/:group_id')
	.put(oauthStrategies.isBearerAuthenticated, schoolGroupsController.update);
	
	// Api endpoints for Subjects
router.route('/api/subjects/in-grade-number/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, subjectsController.getAllByGradeNumber);
	
router.route('/api/subjects')
	.put(oauthStrategies.isBearerAuthenticated, subjectsController.put);
	
router.route('/api/subjects/:subject_id')
	.put(oauthStrategies.isBearerAuthenticated, subjectsController.update);

	// Api endpoints for Grades
router.route('/api/grades')
	.get(oauthStrategies.isBearerAuthenticated, gradesController.getAll)
	.put(oauthStrategies.isBearerAuthenticated, gradesController.put);
	
router.route('/api/grades/:grade_number')
	.get(oauthStrategies.isBearerAuthenticated, gradesController.getOne)
	.put(oauthStrategies.isBearerAuthenticated, gradesController.update);

	// Api endpoints for Allocations
router.route('/api/allocations')
	.put(oauthStrategies.isBearerAuthenticated, allocationsController.put);

	// Api endpoints for Bimesters
router.route('/api/bimesters')
	.put(oauthStrategies.isBearerAuthenticated, bimestersController.putBimester);
	
	// Api endpoints for Revisions
router.route('/api/revisions/me/pending')
	//.get(oauthStrategies.isBearerAuthenticated, revisionsController.getMePendingRevisions)
	.put(oauthStrategies.isBearerAuthenticated, revisionsController.put);
	
// router.route('/api/revisions/:revision_id')
	// .get(oauthStrategies.isBearerAuthenticated, revisionsController.getOne)
	// .put(oauthStrategies.isBearerAuthenticated, revisionsController.put);

router.route('/api/testing')
	.get(testController.getTest);
	
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