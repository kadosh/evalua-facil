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
 				console.log("req.body.username: ", req.body.username);
 				
 				dbContext.User
 				.forge({
 					username : req.body.username
 				})
 				.fetch()
 				.then(function(user) {
 					if(!user){
 						console.log("User was not found. Go => ");
 						// 2. Ensure role title exists
 						callback(null);
 					}
 					else{
 						console.log("User was found");
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
 				console.log("Checking role information.");
 				dbContext.Role
 				.forge({
 					title: req.body.role_name
 				})
 				.fetch()
 				.then(function(role){
 					if(role){
 						// 3. Create the User entity
 						console.log("Role was found. Go =>")
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

 					return dbContext.User
 					.forge({
 						username : req.body.username,
 						password_hash : hashedPassword,
 						role_id : role.get('id')
 					})
 					.save(null, {transacting: t})
 					.then(function(user) {

						console.log("User was created. Go =>");
 						return dbContext.FacultyMember
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
 							console.log("FacultyMember was created. Success!Finished.")

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
 					
 					console.log("transaction was finished.");
 				});
 			},	
         ], 
		function(err, result){
				
 		});
	};
	
	exports.getFacultyMember = function(req, res){
		
		dbContext.FacultyMember
			.forge({
				id : req.params.faculty_member_id
			})
			.fetch({
				withRelated: ['user.role']
			})	
			.then(function(facultyMember){

				res.json({ 
					facultyMember : {
						first_name : facultyMember.get('first_name'),
						last_name : facultyMember.get('last_name'),
						title : facultyMember.get('title'),
						email : facultyMember.get('email'),
						contact_number : facultyMember.get('contact_number'),
						user : facultyMember.related('user').omit('password_hash', 'role_id'),
						role : facultyMember.related('user').related('role')
					} 
				});
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
	};
	
	exports.getAll = function(req, res){
		console.log("Authenticated user: ", req.user);
		
		dbContext.FacultyMember
			.forge()
			.fetchAll({
				withRelated: ['user.role']
			})	
			.then(function(collection){
				var result = [];
				
				collection.forEach(function(facultyMember){
					result.push({
						facultyMember : {
							first_name : facultyMember.get('first_name'),
							last_name : facultyMember.get('last_name'),
							title : facultyMember.get('title'),
							email : facultyMember.get('email'),
							contact_number : facultyMember.get('contact_number'),
							user : facultyMember.related('user').omit('password_hash', 'role_id'),
							role : facultyMember.related('user').related('role')
						}
					});
				});
				
				res.json(result);
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
	};
})();

