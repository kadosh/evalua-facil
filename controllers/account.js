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
			.fetch({withRelated: ['allocations.group', 'allocations.subject', 'user.role']})
			.then(function(facultyMemberModel){
				
				var allocationsModel = facultyMemberModel.related('allocations');
				var allocations = [];
				allocationsModel.forEach(function(alloc){
					allocations.push({
						id : alloc.get('id'),
						subject : alloc.related('subject').omit(['grade_id']),
						group : alloc.related('group').omit(['grade_id'])
					})
				});
				
				res.json({
					id : facultyMemberModel.get('id'),
					first_name : facultyMemberModel.get('first_name'),
					last_name : facultyMemberModel.get('last_name'),
					title : facultyMemberModel.get('title'),
					email : facultyMemberModel.get('email'),
					contact_number : facultyMemberModel.get('contact_number'),
					allocations : allocations,
					conflicted_revisions : [],
					pending_revisions : [],
					user : {
						username : facultyMemberModel.related('user').get('username'),
						id : facultyMemberModel.related('user').get('id'),
						role : facultyMemberModel.related('user').related('role').get('title')
					}
				});
			});
	};
})();