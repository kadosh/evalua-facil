// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');

(function(){
	exports.getSubjects = function(req, res){

		return dbContext.Subject
			.query(function (q) {
				q.distinct()
					.innerJoin('grades', function () {
						this.on('subjects.grade_id', '=', 'grades.id')
							.andOn('grades.grade_number', '=', parseInt(req.params.grade_number))
					});
					
				return q;
			})
			.fetchAll()
			.then(function(subjects) {
				res.send(subjects.toJSON());
			}).catch(function(error) {
				console.log(error);
				res.send('An error occured');
			});
	};
	
	exports.putSubject = function(req, res, next){

		dbContext.Subject
			.query(function (q) {
				q.distinct()
					.innerJoin('grades', function () {
						this.on('subjects.grade_id', '=', 'grades.id')
							.andOn('grades.grade_number', '=', parseInt(req.body.grade_number))
					})
					.where('subjects.abbreviation', req.body.abbreviation);
					
				return q;
			})
			.fetch()
			.then(function(subject) {
				
				// If the subject exists then throw an error
				if (subject){
					throw new Errors.EntityExistsError("The subject already exists");
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
						
						// Proceed to create the subject
						return dbContext.Subject
							.forge()
							.save({
								grade_id : grade.get('id'),
								abbreviation : req.body.abbreviation,
								title : req.body.title
							})
							.then(function(subject){
								res.json(subject);
							});
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