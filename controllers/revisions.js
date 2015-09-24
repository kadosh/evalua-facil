var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var DateTimeUtils = require('../utils/datetime-utils');
console.log(DateTimeUtils);

(function(){
	exports.getMePendingRevisions = function(req, res){

		return dbContext.FacultyMember
			.forge({
				user_id : req.user.get('id')
			})
			.fetch()
			.then(function(facultyMember){
				
				if(!facultyMember){
					throw Errors.NotFoundEntity('The provided faculty member does not exist');
				}
				
				var today = DateTimeUtils.timestamp();
				
				return dbContext.Bimester
					.query(function (q) {
						// Query to get the current bimester
						q
							.where('start_timestamp', '<=',  today)
							.andWhere('end_timestamp', '>=', today)
						return q;
					})
					.fetch()
					.then(function(bimester) {
						
						console.log(bimester);
						
						if(!bimester){
							// Nothing is pending
							res.json([]);
						}
						else{

							return dbContext.FacultyMember
								.forge({
									user_id : req.user.get('id')
								})
								.fetch({withRelated: ['allocations.group', 'allocations.subject', 'user.role']})
								.then(function(facultyMemberModel){

									var allocationsModel = facultyMemberModel.related('allocations');
									var allocations = [];
									allocationsModel.forEach(function(alloc){
										allocations.push( alloc.get('id') )
									});
									
									return dbContext.Allocation
										.query(function(q){
											q.distinct()
												.whereNotExists(function(q){
													q.select('*').from('revisions').whereRaw('allocations.id = revisions.allocation_id')
												})
												.andWhere('faculty_member_id', '=', facultyMemberModel.get('id'));
												
											return q;
										})
										.fetchAll()
										.then(function(allocations){
											res.json(allocations);
										});
								});
						}
					});
			})
			.catch(function(err){
				console.log(err);
				res.status(500).json(err);
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
	
	exports.putMeRevision = function(req, res, next){
		
		// Validations
		// 1. Faculty Member, Group Id, Subject Id, Grade Id
		// 2. Check (
		//    1. teacher does it through web, (Revision is empty... Go on. There's a revision and no alt, create alt, there are both... refused)
		//    2. teacher does it through App, 
		//    3. Teacher is a dummy and combines them, 
		//    	3.1 App then web, but App has'n synced (Notify when the conflict start)
		//    	3.2 App then web, app is synced)
		//      3.3 Web then App, (Notify when synced)

		return dbContext.FacultyMember
			.forge({
				user_id : req.user.get('id')
			})
			.fetch()
			.then(function(facultyMember){
				
				if(!facultyMember){
					throw Errors.NotFoundEntity('The provided faculty member does not exist');
				}
				
				var today = DateTimeUtils.timestamp();
				
				return dbContext.Bimester
					.query(function (q) {
						// Query to get the current bimester
						q
							.where('start_timestamp', '<=',  today)
							.andWhere('end_timestamp', '>=', today)
						return q;
					})
					.fetch()
					.then(function(bimester) {
						
						if(!bimester){
							// Nothing is pending
							res.json([]);
						}
						else{
							
							if(bimester.get('bimester_number') != req.body.bimester_number){
								throw Errors.InvalidBimester();
							}
							
							return dbContext.FacultyMember
								.forge({
									user_id : req.user.get('id')
								})
								.fetch({withRelated: ['allocations.group', 'allocations.subject', 'user.role']})
								.then(function(facultyMemberModel){

									var allocationsModel = facultyMemberModel.related('allocations');
									var allocations = [];
									allocationsModel.forEach(function(alloc){
										allocations.push( alloc.get('id') )
									});
									
									return dbContext.Allocation
										.query(function(q){
											q.distinct()
												.whereNotExists(function(q){
													q.select('*').from('revisions').whereRaw('allocations.id = revisions.allocation_id')
												})
												.andWhere('faculty_member_id', '=', facultyMemberModel.get('id'));
												
											return q;
										})
										.fetchAll()
										.then(function(allocations){
											res.json(allocations);
										});
								});
						}
					});
			})
			.catch(function(err){
				console.log(err);
				res.status(500).json(err);
			});
	};
})();