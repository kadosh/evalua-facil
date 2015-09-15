// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var bookshelf = require('../db/bookshelf');

var ERROR_TYPES = {};

(function(){
	exports.getMe = function(req, res){
		dbContext.FacultyMember
			.forge({
				user_id : req.user.get('id')
			})
			.fetch({withRelated: ['allocations']})
			.then(function(facultyMemberModel){
				console.log(facultyMemberModel);
			});
	};
})();