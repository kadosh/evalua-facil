// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

(function () {
    /**
     * 
     * @type AllocsHandler
     */
    var that;

    var AllocsHandler = function () {
        that = this;

        that.gradeRepository = new repos.GradeRepository();
        that.groupRepository = new repos.GroupRepository();
        that.subjectRepository = new repos.SubjectRepository();
        that.facultyMemberRepository = new repos.FacultyMemberRepository();
        that.allocationRepository = new repos.AllocationRepository();
        that.evaluationRepository = new repos.EvaluationRepository();
    };

    AllocsHandler.prototype.getAvailable = function (req, res) {
        return that.allocationRepository
            .getAll({}, {
                withRelated: ['group', 'subject']
            })
            .then(function (allocs) {

                if (!allocs) {
                    res.json([]);
                }

                return that.subjectRepository
                    .getAll()
                    .then(function (subjects) {

                        return that.groupRepository
                            .getAll({}, {withRelated: ['grade']})
                            .then(function (groups) {

                                var availableAllocs = [];
                                var foundAllocation = false;
                                var grade = false;

                                // TODO: Improve this logic in order to 
                                // do less iteration.
                                groups.forEach(function (group) {
                                    grade = group.related('grade');

                                    subjects.forEach(function (subject) {
                                        foundAllocation = false;

                                        allocs.forEach(function (alloc) {
                                            if (alloc.get('subject_id') == subject.get('id')
                                                && alloc.get('school_group_id') == group.get('id')) {
                                                foundAllocation = true;
                                            }
                                        });

                                        if (!foundAllocation && subject.get('grade_id') == group.get('grade_id')) {
                                            availableAllocs.push({
                                                grade: grade,
                                                group: group.omit('grade'),
                                                subject: subject,
                                                friendly_name: grade.get('grade_number') + group.get('group_name') + ' ' + subject.get('abbreviation')
                                            });
                                        }
                                    });
                                });

                                res.json(availableAllocs);
                            });
                    });
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({
                    error: true,
                    data: {
                        message: error.message
                    }
                });
            })
    };

    AllocsHandler.prototype.addAllocation = function (req, res) {

        var grade_number = parseInt(req.body.grade_number),
            group_id = parseInt(req.body.group_id),
            faculty_member_id = parseInt(req.params.faculty_member_id),
            subject_id = parseInt(req.body.subject_id);

        return that.gradeRepository
            .findByNumber(grade_number)
            .then(function (grade) {

                if (!grade) {
                    throw new Errors.NotFoundEntity("The provided grade number does not exist");
                }

                return that.groupRepository
                    .findById(group_id)
                    .then(function (group) {

                        if (!group) {
                            throw new Errors.NotFoundEntity("The provided group id does not exist");
                        }

                        return that.subjectRepository
                            .findById(subject_id)
                            .then(function (subject) {

                                if (!subject) {
                                    throw new Errors.NotFoundEntity("The provided subject id does not exist");
                                }

                                return that.facultyMemberRepository
                                    .getOne({id: faculty_member_id}, {})
                                    .then(function (facultyMember) {

                                        if (!facultyMember) {
                                            throw new Errors.NotFoundEntity("The provided faculty member id does not exist");
                                        }

                                        return that.allocationRepository
                                            .getOne({
                                                school_group_id: group.get('id'),
                                                subject_id: subject.get('id')
                                            })
                                            .then(function (alloc) {

                                                if (alloc) {
                                                    throw new Errors.NotFoundEntity("The provided allocation is already assigned");
                                                }

                                                return that.allocationRepository
                                                    .insert({
                                                        school_group_id: group_id,
                                                        subject_id: subject_id,
                                                        faculty_member_id: faculty_member_id
                                                    })
                                                    .then(function (alloc) {
                                                        res.json(alloc);
                                                    });
                                            });
                                    });
                            })
                    });
            })
            .catch(function (error) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: error.message
                    }
                });
            });
    };

    AllocsHandler.prototype.deleteForFacultyMember = function (req, res) {
        var faculty_member_id = req.params.faculty_member_id,
            allocation_id = req.body.allocation_id;

        return that.allocationRepository
            .getOne({
                id: allocation_id,
                faculty_member_id: faculty_member_id
            }, {
            })
            .then(function (alloc) {

                if (!alloc) {
                    throw new Errors.NotFoundEntity("The provided " +
                        "allocation id was not found or is assigned to the provided " +
                        "faculty member.");
                }

                return that.evaluationRepository
                    .getOne({
                        allocation_id: alloc.get('id')
                    })
                    .then(function (evaluation) {

                        if (!evaluation) {
                            // Procceed to delete the allocation

                            return that.allocationRepository
                                .delete({id: alloc.get('id')})
                                .then(function (result) {

                                    // TODO: Make sure the deletion was done correctly
                                    res.json({success: true});
                                });
                        }
                        else {
                            // Show error message for now
                            throw new Errors.InvalidOperationError("There are" +
                                " some evaluations related to this allocation.")
                        }
                    })
            })
            .catch(function (error) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: error.message
                    }
                });
            })
    };

    AllocsHandler.prototype.getForFacultyMember = function (req, res) {
        var faculty_member_id = req.params.faculty_member_id;

        console.log(faculty_member_id);
        return that.facultyMemberRepository
            .getOne({
                id: faculty_member_id
            }, {
                withRelated: ['allocations.group', 'allocations.subject', 'allocations.group.grade']
            })
            .then(function (facultyMember) {
                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The provided faculty member id was not found");
                }

                var allocations = [];
                facultyMember.related('allocations').forEach(function (alloc) {
                    var group = alloc.related('group'),
                        grade = group.related('grade'),
                        subject = alloc.related('subject');

                    allocations.push({
                        id: alloc.get('id'),
                        subject: subject.omit(['grade_id', 'grade']),
                        group: group.omit(['grade_id', 'grade']),
                        grade: grade,
                        friendly_name: grade.get('grade_number') + group.get('group_name') + ' ' + subject.get('abbreviation')
                    });
                });

                res.json(allocations);
            })
            .catch(function (error) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: error.message
                    }
                });
            });
    };

    var handler = new AllocsHandler();

    module.exports.put = handler.addAllocation;
    module.exports.getForFacultyMember = handler.getForFacultyMember;
    module.exports.deleteForFacultyMember = handler.deleteForFacultyMember;
    module.exports.getAvailable = handler.getAvailable;
})();