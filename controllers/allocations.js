// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var bcrypt = require('bcryptjs');
var bookshelf = require('../db/bookshelf');
var Checkit = require('checkit');
var Errors = require('../utils/custom-errors');

var ERROR_TYPES = {
	DUPLICATED_USERNAME: 'DUPLICATED_USERNAME',
	ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
	INVALID_DATA: 'INVALID_DATA',
	DATABASE_ERROR: 'DATABASE_ERROR'
};

(function(){
	exports.putAllocation = function(req, res){
		
		return dbContext.Grade
			.forge({ grade_number : req.body.grade_number })
			.fetch()
			.then(function(grade){
				
				if(!grade){
					throw new Errors.NotFoundEntity("The grade number was not found");
				}
				
				return dbContext.SchoolGroup
					.forge({ id : req.body.group_id, grade_id : grade.get('id') })
					.fetch()
					.then(function(group){
						if(!group){
							throw new Errors.NotFoundEntity("The related group was not found");
						}
						
						return dbContext.Subject
							.forge({ id : req.body.subject_id, grade_id : grade.get('id') })
							.fetch()
							.then(function(subject){
								
								if(!subject){
									throw new Errors.NotFoundEntity("The related subject was not found");
								}
								
								return dbContext.FacultyMember
									.forge({ id : req.body.faculty_member_id})
									.fetch()
									.then(function(facultyMember){
										
										if(!facultyMember){
											throw new Errors.NotFoundEntity("The faculty member id was not found");
										}
										
										return dbContext.Allocation
											.forge({
												faculty_member_id : facultyMember.get('id'),
												school_group_id : group.get('id'),
												subject_id : subject.get('id')
											})
											.fetch()
											.then(function(alloc){
												
												if(alloc){
													throw new Errors.EntityExistsError("The allocation already exists");
												}
												
												return dbContext.Allocation
													.forge()
													.save({
														school_group_id : req.body.group_id,
														subject_id : req.body.subject_id,
														faculty_member_id : req.body.faculty_member_id
													})
													.then(function(allocation){
														res.json(allocation);
													});
											})
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
					})
			});
	};
})();