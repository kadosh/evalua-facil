// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');

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
});