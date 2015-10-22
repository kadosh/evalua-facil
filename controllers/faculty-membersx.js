// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var bcrypt = require('bcryptjs');

(function(){
	var that;
	
	var FacultyMembersHandler = function () {
		that = this;
		that.facultyMemberRepository = new repos.FacultyMemberRepository();
		that.userRepository = new repos.UserRepository();
		that.roleRepository = new repos.RoleRepository();
	};
	
	FacultyMembersHandler.prototype.getOne = function(req, res){
		return that.facultyMemberRepository
			.getOne({ id : req.params.faculty_member_id } , { withRelated : ['user.role'] })
			.then(function(facultyMember){
				if (!facultyMember){
					throw new Errors.NotFoundEntity("The requested faculty member id was not found");
				}
				
				res.json(facultyMember);
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	FacultyMembersHandler.prototype.getAll = function(req, res){
		return that.facultyMemberRepository
			.getMany(null, { withRelated : ['user.role'] })
			.then(function(items){
				res.send(items.toJSON());
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	FacultyMembersHandler.prototype.put = function(req, res){
		return that.userRepository
			.findByUserName(req.body.username)
			.then(function(user){
				if (user){
					throw new Errors.UsernameAlreadyInUseError();
				}
				
				return that.roleRepository
					.findByName(req.body.role_title)
					.then(function(role){
						
						if (!role) {
							throw new Errors.NotFoundEntity("The provided role title doesn't exist");
						}
						
						dbContext.Bookshelf.transaction( function(t) {
							// Has the password using Bluefish algorithm
							var hashedPassword = bcrypt.hashSync(req.body.password);
							
							// Create the user
							return that.userRepository
								.insert({
									username : req.body.username,
									password_hash : hashedPassword,
									role_id : role.get('id')
								}, { transacting : t } )
								.then(function(user){
									
									// Create the faculty member
									return that.facultyMemberRepository
										.insert({
											first_name : req.body.first_name,
											last_name : req.body.last_name,
											title : req.body.title,
											email : req.body.email,
											contact_number : req.body.contact_number,
											user_id : user.get('id')
										}, { transacting : t })
										.then(function(facultyMember) {
											
											// Return the result
											res.json({
												faculty_member : facultyMember,
												user_data : { 
													username: user.get('username'),
													role: role.get('title')
												}
											});
										});
									
								})
								.catch(t.rollback);
						});
					});
					
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	FacultyMembersHandler.prototype.update = function(req, res){
		return that.facultyMemberRepository
			.getOne({ id : req.params.faculty_member_id })
			.then(function(facultyMember){
				
				if (!facultyMember){
					throw new Errors.NotFoundEntity("The requested faculty member id was not found");
				}
				
				return that.facultyMemberRepository
					.update({
						faculty_member_id : req.params.faculty_member_id,
						first_name : req.body.first_name,
						last_name : req.body.last_name,
						title : req.body.title,
						contact_number : req.body.contact_number,
						email : req.body.email
					})
					.then(function(result){
						res.json(result);
					});
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	var handler = new FacultyMembersHandler();
	
	module.exports.getOne = handler.getOne;
	module.exports.getAll = handler.getAll;
	module.exports.put = handler.put;
	module.exports.update = handler.update;
	
})();

