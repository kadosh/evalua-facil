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
    var removedAllocations = [];
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

                                httpUtils.success(req, res, availableAllocs);
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

    AllocsHandler.prototype._removeAllocAsync = function (req, res, alloc) {

        var allocation_id = parseInt(alloc.allocation_id),
            faculty_member_id = parseInt(alloc.faculty_member_id);

        var possibleError = {
            allocation_id: allocation_id,
            error: ""
        };

        return that.allocationRepository
            .findById(allocation_id)
            .then(function (allocation) {

                if (!allocation) {
                    possibleError.error = errorDef.def.ALLOCATION_NOT_FOUND;
                    allocsWithErrors.push(possibleError);
                    throw new Errors.NotFoundEntity("The provided allocation id does not exist");
                }

                if (allocation.get('faculty_member_id') != faculty_member_id) {
                    possibleError.error = errorDef.def.ALLOCATION_DOESNT_BELONG_TO_FACULTY;
                    allocsWithErrors.push(possibleError);
                    throw new Errors.AllocationNotBelongingToProvidedFacultyError();
                }

                return that.allocationRepository
                    .deleteById(allocation_id)
                    .then(function () {
                        removedAllocations.push(allocation_id);
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

                allocsWithErrors = [];
                postedAllocations = [];

                for (var i = 0; i < allocations.length; i++) {
                    var alloc = allocations[i];
                    alloc.faculty_member_id = faculty_member_id;

                    promises.push(that._addAllocAsync(req, res, alloc));
                }

                Promise.all(promises.map(function (promise) {
                    return promise.reflect();
                })).each(function (inspection) {
                }).then(function () {
                    httpUtils.handlePostedAllocations(req, res, postedAllocations, allocsWithErrors);
                });
            }
        });
    };

    AllocsHandler.prototype.removeAllocation = function (req, res) {
        var faculty_member_id = req.params.faculty_member_id;
        var promises = [];
        var allocations = req.body;

        var modelRules = new Checkit({
            allocation_id: errorDef.rules.REQUIRED_FIELD_RULE
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

                allocsWithErrors = [];
                removedAllocations = [];

                console.log(allocations);

                for (var i = 0; i < allocations.length; i++) {
                    var alloc = allocations[i];
                    alloc.faculty_member_id = faculty_member_id;

                    promises.push(that._removeAllocAsync(req, res, alloc));
                }

                Promise.all(promises.map(function (promise) {
                    return promise.reflect();
                })).each(function (inspection) {
                }).then(function () {
                    httpUtils.handlePostedAllocations(req, res, removedAllocations, allocsWithErrors);
                });
            }
        });
    };

    AllocsHandler.prototype.getForFacultyMember = function (req, res) {
        var faculty_member_id = parseInt(req.params.faculty_member_id);

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

                httpUtils.success(req, res, allocations);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new AllocsHandler();

    module.exports.put = handler.addAllocation;
    module.exports.getForFacultyMember = handler.getForFacultyMember;
    module.exports.delete = handler.removeAllocation;
    module.exports.getAvailable = handler.getAvailable;
})();