var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

(function(){
	var that;
	
	var TestHandler = function () { 
		that = this;
		that.gradeRepository = new repos.GradeRepository();
	};
	
	TestHandler.prototype.get = function (req, res){
		return that.gradeRepository
			.findByNumber(1)
			.then(function(grade){
				console.log(grade);
			});
	};
	
	var handler = new TestHandler();
	
	module.exports.getTest = handler.get;
})();