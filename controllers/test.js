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

		var gradePromise = that.gradeRepository.findByNumber(1);
			
		gradePromise.then(function(grade){
				if(!grade){
					throw new Errors.NotFoundEntity();
				}
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
	
	var handler = new TestHandler();
	
	module.exports.getTest = handler.get;
})();