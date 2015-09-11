// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');

exports.getGrades = function(req, res){
	new dbContext.Grade().fetchAll()
    .then(function(grades) {
      res.send(grades.toJSON());
    }).catch(function(error) {
      console.log(error);
      res.send('An error occured');
    });
};

exports.getGrade = function(req, res) {
	var model = new dbContext.Grade();
	
	model
	  .query({where: { grade_number: req.params.grade_number }})
	  .fetch()
	  .then(function(grade) {
		    res.json(grade);
	  });
};