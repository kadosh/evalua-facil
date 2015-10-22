// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');

(function(){
	exports.getGrades = function(req, res){
		dbContext.Grade
			.forge()
			.fetchAll()
			.then(function(grades) {
			  res.send(grades.toJSON());
			}).catch(function(error) {
			  res.send('An error occured');
			});
	};

	exports.getGrade = function(req, res) {
		dbContext.Grade
			.forge( { grade_number : req.params.grade_number } )
			.fetch()
			.then(function(grade){
				res.json(grade);
			});
	};
	
	exports.putGrade = function(req, res, next){

		dbContext.Grade
			.forge({
				grade_number : req.body.grade_number
			})
			.fetch()
			.then(function(grade) {
				
				if (grade){
					throw new Errors.EntityExistsError("The grade already exists");
				}
				
				return dbContext.Grade
					.forge()
					.save({
						grade_number : req.body.grade_number,
						title : req.body.title
					})
					.then(function(grade){
						res.json(grade);
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