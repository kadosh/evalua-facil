var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');

(function(){
	var that;
	
	var GradeRepository = function () { 
		that = this;
	};
	
	GradeRepository.prototype.findByNumber = function(grade_number){
		return dbContext.Grade
			.forge({ grade_number : 1 })
			.fetch();
	};
	
	module.exports.GradeRepository = GradeRepository;
})();