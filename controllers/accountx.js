// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var bcrypt = require('bcryptjs');

(function(){
	var that;
	
	var AccountHandler = function () {
		that = this;
	};
	
	AccountHandler.prototype.getMe = function(req, res){
		return dbContext.FacultyMember
			.forge({
				user_id : req.user.get('id')
			})
			.fetch({withRelated: ['allocations.group', 'allocations.subject', 'user.role', 'allocations.group.grade']})
			.then(function(facultyMemberModel){
				
				var allocationsModel = facultyMemberModel.related('allocations');
				var allocations = [];
				allocationsModel.forEach(function(alloc){
					var group = alloc.related('group');
					var grade = group.related('grade');
					
					allocations.push({
						id : alloc.get('id'),
						subject : alloc.related('subject').omit(['grade_id']),
						group : alloc.related('group').omit(['grade_id']),
						grade : grade
					});
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
	
	var handler = new AccountHandler();
	
	module.exports.getMe = handler.getMe;
})();