// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');
var facultyMembersController = require('./controllers/faculty-membersx');
var accountController = require('./controllers/accountx');
var gradesController = require('./controllers/gradesx');
var studentsController = require('./controllers/studentsx');
var allocationsController = require('./controllers/allocationsx');
var bimestersController = require('./controllers/bimesters');
var revisionsController = require('./controllers/revisionsx');
var testController = require('./controllers/test');
var evaluationsController = require('./controllers/evaluationsx');

var schoolGroupsController = require('./controllers/school-groupsx');
var subjectsController = require('./controllers/subjectsx');
var oauthStrategies = require('./controllers/oauth-strategies');
var oauthServer = require('./controllers/oauth2-server');

// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'jade');

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

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
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.getAll)
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.put);

router.route('/api/faculty-members/:faculty_member_id')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.getOne)
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.update);

router.route('/api/faculty-members/:faculty_member_id/deactivate')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.deactivate);

router.route('/api/faculty-members/:faculty_member_id/activate')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), facultyMembersController.activate);

router.route('/api/account/me')
    .get(oauthStrategies.isBearerAuthenticated, accountController.getMe);

// Api endpoints for School Groups
router.route('/api/school-groups/in-grade-number/:grade_number')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), schoolGroupsController.getAllByGradeNumber);
router.route('/api/school-groups/')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), schoolGroupsController.getAll)
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), schoolGroupsController.put);
router.route('/api/school-groups/:group_id')
    .put(oauthStrategies.isBearerAuthenticated, schoolGroupsController.update);

// Api endpoints for Subjects
router.route('/api/subjects/in-grade-number/:grade_number')
    .get(oauthStrategies.isBearerAuthenticated, subjectsController.getAllByGradeNumber);

router.route('/api/subjects')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), subjectsController.put);

router.route('/api/subjects/:subject_id')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), subjectsController.update);

// Api endpoints for Grades
router.route('/api/grades')
    .get(oauthStrategies.isBearerAuthenticated, gradesController.getAll)
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), gradesController.put);

router.route('/api/grades/:grade_number')
    .get(oauthStrategies.isBearerAuthenticated, gradesController.getOne)
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), gradesController.update);

// Api endpoints for Allocations
router.route('/api/allocations/faculty-member/:faculty_member_id')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), allocationsController.put)
    .delete(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), allocationsController.deleteForFacultyMember)
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), allocationsController.getForFacultyMember);

router.route('/api/allocations/available')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["director"]), allocationsController.getAvailable);

router.route('/api/students')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), studentsController.put);

router.route('/api/students/in-group/:school_group_id')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), studentsController.getByGroup);

router.route('/api/students/:student_id')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), studentsController.update)
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), studentsController.getOne)
    .delete(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), studentsController.delete)

router.route('/api/evaluations/current/group/pending/:school_group_id')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), evaluationsController.getPendingByGroup);

router.route('/api/evaluations/bimester/:bimester_number/group/all/:school_group_id')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), evaluationsController.getStudentsListByGroup);

router.route('/api/evaluations/bimester/:bimester_number/group/all/:school_group_id/subject/:subject_id')
    .get(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher", "director"]), evaluationsController.getStudentsListByGroupFilterSubject);


router.route('/api/evaluations/bimester/:bimester_number/student/:student_id')
    .put(oauthStrategies.isBearerAuthenticated, oauthStrategies.checkRole(["teacher"]), evaluationsController.put);

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