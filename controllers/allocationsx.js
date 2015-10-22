// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

(function(){
    /**
     * 
     * @type AllocsHandler
     */
	var that;
	
	var AllocsHandler = function () {
		that = this;
        /**
         * @type GradeRepository
         */
		that.gradeRepository = new repos.GradeRepository();
		that.groupRepository = new repos.GroupRepository();
		that.subjectRepository = new repos.SubjectRepository();
		that.facultyMemberRepository = new repos.FacultyMemberRepository();
		that.allocationRepository = new repos.AllocationRepository();
	};

	AllocsHandler.prototype.put = function(req, res){

		var grade_number = parseInt(req.body.grade_number),
			group_id = parseInt(req.body.group_id),
			faculty_member_id = parseInt(req.body.faculty_member_id),
			subject_id = parseInt(req.body.subject_id);
		
		return that.gradeRepository
			.findByNumber(grade_number)
			.then(function(grade){
				
				if (!grade){
					throw new Errors.NotFoundEntity("The provided grade number does not exist");
				}
				
				return that.groupRepository
					.findById(group_id)
					.then(function(group){
						
						if (!group){
							throw new Errors.NotFoundEntity("The provided group id does not exist");
						}
						
						return that.subjectRepository
							.findById(subject_id)
							.then(function (subject){
								
								if (!subject) {
									throw new Errors.NotFoundEntity("The provided subject id does not exist");
								}
								
								return that.facultyMemberRepository
									.getOne({ id : faculty_member_id }, {})
									.then(function (facultyMember){
										
										if (!facultyMember) {
											throw new Errors.NotFoundEntity("The provided faculty member id does not exist");
										}
										
										return that.allocationRepository
											.getOne({
												school_group_id : group.get('id'),
												subject_id : subject.get('id')
                                                                                            })
											.then(function(alloc){
												
												if (alloc) {
													throw new Errors.NotFoundEntity("The provided allocation is already assigned");
												}
												
												return that.allocationRepository
													.insert({
														school_group_id : group_id,
														subject_id : subject_id,
														faculty_member_id : faculty_member_id
													})
													.then(function(alloc){
														res.json(alloc);
													});
											});
									});
							})
					});
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
	
	AllocsHandler.prototype.getForFacultyMember = function(req, res){
        
	};
	
	var handler = new AllocsHandler();
	
	module.exports.put = handler.addAllocation;
	module.exports.getForFacultyMember = handler.getForFacultyMember;
	
})();