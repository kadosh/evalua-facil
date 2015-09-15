// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');

(function(){
	exports.getGroups = function(req, res){
		console.log(req.params);
		
		dbContext.SchoolGroup()
			.forge()
			.query('grade_id', '=', 1)
			.fetchAll()
			.then(function(groups) {
				console.log(groups);
				res.send(groups.toJSON());
			}).catch(function(error) {
				console.log(error);
				res.send('An error occured');
			});
	};
})();