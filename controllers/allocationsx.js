// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var Promise = require('bluebird');
var errorDef = require('../utils/form-errors');
var Checkit = require('checkit');

(function () {
    /**
     * 
     * @type AllocsHandler
     */
    var that;
    var formErrors = [];
    var postedAllocations = [];
    var allocsWithErrors = [];

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
                    .getAll({})
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
                                                school_group: group.omit('grade'),
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
        /*.catch(function (error) {
         console.log(error);
         res.status(500).json({
         error: true,
         data: {
         message: error.message
         }
         });
         });*/
    };

    AllocsHandler.prototype._addAllocAsync = function (req, res, alloc) {

        var grade_number = parseInt(alloc.grade_number),
            group_id = parseInt(alloc.school_group_id),
            faculty_member_id = parseInt(alloc.faculty_member_id),
            subject_id = parseInt(alloc.subject_id);

        var possibleError = {
            grade_number: grade_number,
            school_group_id: group_id,
            subject_id: subject_id,
            error: ""
        };

        return that.gradeRepository
            .findByNumber(grade_number)
            .then(function (grade) {

                if (!grade) {
                    possibleError.error = errorDef.def.GRADE_NUMBER_NOT_FOUND;
                    allocsWithErrors.push(possibleError);
                    throw new Errors.NotFoundEntity("The provided grade number does not exist");
                }

                return that.groupRepository
                    .findById(group_id)
                    .then(function (group) {

                        if (!group) {
                            possibleError.error = errorDef.def.SCHOOL_GROUP_NOT_FOUND;
                            allocsWithErrors.push(possibleError);
                            throw new Errors.NotFoundEntity("The provided group id does not exist");
                        }

                        return that.subjectRepository
                            .findById(subject_id)
                            .then(function (subject) {

                                if (!subject) {
                                    possibleError.error = errorDef.def.SUBJECT_NOT_FOUND;
                                    allocsWithErrors.push(possibleError);
                                    throw new Errors.NotFoundEntity("The provided subject id does not exist");
                                }

                                return that.facultyMemberRepository
                                    .getOne({id: faculty_member_id}, {})
                                    .then(function (facultyMember) {

                                        if (!facultyMember) {
                                            possibleError.error = errorDef.def.FACULTY_NOT_FOUND;
                                            allocsWithErrors.push(possibleError);
                                            throw new Errors.NotFoundEntity("The provided faculty member id does not exist");
                                        }

                                        return that.allocationRepository
                                            .getOne({
                                                school_group_id: group.get('id'),
                                                subject_id: subject.get('id')
                                            })
                                            .then(function (alloc) {

                                                if (alloc) {
                                                    possibleError.error = errorDef.def.ALLOCATION_IN_USE;
                                                    allocsWithErrors.push(possibleError);
                                                    throw new Errors.NotFoundEntity("The provided allocation is already assigned");
                                                }

                                                return that.allocationRepository
                                                    .insert({
                                                        school_group_id: group_id,
                                                        subject_id: subject_id,
                                                        faculty_member_id: faculty_member_id
                                                    })
                                                    .then(function (alloc) {
                                                        postedAllocations.push(alloc);
                                                    });
                                            });
                                    });
                            });
                    });
            });
    };

    AllocsHandler.prototype.addAllocation = function (req, res) {
        var faculty_member_id = req.params.faculty_member_id;
        var promises = [];
        var allocations = req.body;

        var modelRules = new Checkit({
            grade_number: errorDef.rules.REQUIRED_FIELD_RULE,
            school_group_id: errorDef.rules.REQUIRED_FIELD_RULE,
            subject_id: errorDef.rules.REQUIRED_FIELD_RULE
        });

        var validationPromises = [];

        for (var i = 0; i < allocations.length; i++) {
            var alloc = allocations[i];
            alloc.faculty_member_id = faculty_member_id;

            var validationPromise = modelRules.run(alloc);
            validationPromises.push(validationPromise);
        }

        var validationErrors = [];

        Promise.all(validationPromises.map(function (promise) {
            return promise.reflect();
        })).each(function (inspection) {
            if (!inspection.isFulfilled()) {
                validationErrors.push(inspection.reason());
            }
        }).then(function () {
            if (validationErrors.length > 0) {
                httpUtils.handleFormErrorOnAllocations(req, res, errorDef.def.ERRORS_ON_ALLOCATIONS_FORM, validationErrors);
                return;
            } else {
                for (var i = 0; i < allocations.length; i++) {
                    var alloc = allocations[i];
                    alloc.faculty_member_id = faculty_member_id;

                    promises.push(that._addAllocAsync(req, res, alloc));
                }

                allocsWithErrors = [];
                postedAllocations = [];

                Promise.all(promises.map(function (promise) {
                    return promise.reflect();
                })).each(function (inspection) {
                }).then(function () {
                    console.log(postedAllocations, allocsWithErrors);
                    httpUtils.handlePostedAllocations(req, res, postedAllocations, allocsWithErrors);
                });
            }
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