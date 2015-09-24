// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var Checkit = require('checkit');

(function(){
	exports.getGroups = function(req, res){

		dbContext.SchoolGroup
			.query(function (q) {
				q.distinct()
					.innerJoin('grades', function () {
						this.on('school_groups.grade_id', '=', 'grades.id')
							.andOn('grades.grade_number', '=', parseInt(req.params.grade_number))
					});
					
				return q;
			})
			.fetchAll()
			.then(function(groups) {
				res.send(groups.toJSON());
			}).catch(function(error) {
				res.send('An error occured');
			});
	};
	
	exports.putGroup = function(req, res, next){

		dbContext.SchoolGroup
			.query(function (q) {
				q.distinct()
					.innerJoin('grades', function () {
						this.on('school_groups.grade_id', '=', 'grades.id')
							.andOn('grades.grade_number', '=', parseInt(req.body.grade_number))
					})
					.where('school_groups.group_name', req.body.group_name);
					
				return q;
			})
			.fetch()
			.then(function(schoolGroup) {
				
				if (schoolGroup){
					throw new Errors.EntityExistsError("The school group already exists");
				}
				
				// Find grade reference
				return dbContext.Grade
					.forge({
						grade_number : req.body.grade_number
					})
					.fetch()
					.then(function(grade){
						
						if(!grade){
							throw new Errors.InvalidGrade();
						}
						
						// TODO: Validate the grade_number is not null
						
						// Proceed to create the Group
						return dbContext.SchoolGroup
							.forge()
							.save({
								grade_id : grade.get('id'),
								group_name : req.body.group_name,
								total_students : req.body.total_students
							})
							.then(function(group){
								res.json(group);
							});
					});
			})
			.catch(Checkit.Error, function(err) { 							
				// Do something with error
				res.status(500).json({
					error : true,
					message : err.message,
					detail: err
				});
			})
			.catch(function(error) {
				// Do something with error
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
})();