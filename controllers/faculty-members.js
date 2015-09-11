// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var bcrypt = require('bcryptjs');
var bookshelf = require('../db/bookshelf');
var Checkit = require('checkit');
var ERROR_TYPES = {
	DUPLICATED_USERNAME: 'DUPLICATED_USERNAME',
	ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
	INVALID_DATA: 'INVALID_DATA',
	DATABASE_ERROR: 'DATABASE_ERROR'
};

var async = require('async');

(function(){

	exports.putFacultyMember = function(req, res){
		async.waterfall([
		     			function(callback){
		     				console.log("first: ");
		     				
		     				// 1. Validate username
		     				dbContext.User
		     				.forge({
		     					username : req.body.username
		     				})
		     				.fetch()
		     				.then(function(user) {
		     					if(!user){
		     						// 2. Ensure role title exists
		     						callback(null);
		     					}
		     					else{
		     						res.status(500).json({
		     							error : {
		     								type : ERROR_TYPES.DUPLICATED_USERNAME,
		     								message : "The provided username is already in use." 
		     							}
		     						});
		     					}
		     				}).catch(function(err) {
		     					console.log("error on User.find()", err.message);
		     					
		     					res.status(500).json({
		     						error : true,
		     						data : {
		     							message : err.message
		     						}
		     					});
		     				});
		     			},
		     			function(callback){
		     				console.log("second: ");
		     				dbContext.Role
		     				.forge({
		     					title: req.body.role_name
		     				})
		     				.fetch()
		     				.then(function(role){
		     					if(role){
		     						// 3. Create the User entity
		     						callback(null, role);
		     					}else{
		     						res.status(500).json({
		     							error : {
		     								type : ERROR_TYPES.ROLE_NOT_FOUND,
		     								message : "The provided role title doesn't exists.",
		     								detail: {}
		     							}
		     						});
		     					}
		     				});
		     			},
		     			function(role, callback){
		     				bookshelf.transaction(function(t) {
		     					
		     					// Has the password using Bluefish algorithm
		     					var hashedPassword = bcrypt.hashSync(req.body.password);
		     					
		     					console.log("Role: ", role);

		     					dbContext.User
		     					.forge({
		     						username : req.body.username,
		     						password_hash : hashedPassword,
		     						role_id : role.get('id')
		     					})
		     					.save(null, {transacting: t})
		     					.then(function(user) {
		     						dbContext.FacultyMember
		     						.forge({
		     							first_name : req.body.first_name,
		     							last_name : req.body.last_name,
		     							title : req.body.title,
		     							email : req.body.email,
		     							contact_number : req.body.contact_number,
		     							user_id : user.get('id')
		     						})
		     						.save(null, {transacting: t})
		     						.then(function(facultyMember) {
		     							res.json({
		     								faculty_member : facultyMember,
		     								user_data : { 
		     									username: user.get('username'),
		     									role: role.get('title')
	     									}
		     							});
		     						}).catch(Checkit.Error, function(err) {
		     							
		     							console.log("error on FacultyMember.save()", err.message);	
		     							// Do something with error
		     							res.status(500).json({
		     								error : true,
		     								message : err.message,
		     								detail: err
		     							});
		     						}).catch(Error, function(err) {

		     							console.log("error on FacultyMember.save()", err.message);	
		     							console.log(err);
		     							// Do something with error
		     							res.status(500).json({
		     								error : {
		     									type : ERROR_TYPES.DATABASE_ERROR,
		     									message: err.message
		     								}
		     							});
		     						});
		     					})
		     					.catch(function(err, o) {

		     						console.log("error on User.save()", err.message);
		     						
		     						// Do something with error
		     						res.status(500).json({
		     							error : true,
		     							data : {
		     								message : err.message
		     							}
		     						});
		     					});
		     				});
		     			},	
		             ], 
		     				function(err, result){
		     		});
	};
	
	exports.getFacultyMember = function(req, res){
		console.log(req.params.faculty_member_id);
		dbContext.FacultyMember
			.forge({
				id : req.params.faculty_member_id
			})
			.fetch()
			.then(function(facultyMember){
				res.json({ facultyMember : facultyMember } );
			})
			.catch(function(err){
				res.status(500).json({
						error : {
							type : ERROR_TYPES.DATABASE_ERROR,
							message: err.message,
							detail: {} 
						}
					});
			});
	}
})();

