// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var HttpStatus = require('http-status-codes');
var dateTimeUtils = require('../utils/datetime-utils');
var Promise = require('bluebird');

(function () {
    var that;

    var EvaluationsHandler = function () {
        that = this;
        that.allocationRepository = new repos.AllocationRepository();
        that.studentRepository = new repos.StudentRepository();
        that.groupRepository = new repos.GroupRepository();
        that.bimesterRepository = new repos.BimesterRepository();
        that.subjectRepository = new repos.SubjectRepository();
        that.stEvaluationRepository = new repos.StudentEvaluationRepository();
        that._cachedSubjects = [];
        that._cachedStudentResults = [];
    };

    EvaluationsHandler.prototype._asyncAll = function (students, subjects, bimester) {

        that._cachedSubjects = subjects;
        that._cachedStudentResults = [];

        var countPromise = students.count();

        var processAllPromise = countPromise.then(function (count) {

            var promises = [];

            students.models.forEach(function (student) {
                var studentRow = {
                    first_name: student.get('first_name'),
                    last_name: student.get('last_name'),
                    mothers_name: student.get('mothers_name'),
                    gender: student.get('gender'),
                    id: student.get('id')
                };

                promises.push(that._asyncStudent(
                    studentRow,
                    student.get('id'),
                    bimester.get('bimester_number')
                    ));
            });

            return Promise.all(promises);
        });

        var final = processAllPromise.then(function (count) {
            return new Promise(function (resolve) {
                return resolve(that._cachedStudentResults);
            });
        });

        return final;
    };

    EvaluationsHandler.prototype._asyncStudent = function (studentRow, studentId, bimester_number) {

        return that.stEvaluationRepository
            .getFinishedByStudent(studentId, bimester_number, {
                withRelated: ['subject']
            })
            .then(function (evaluations) {

                var missingOnes = [];
                var existingOnes = [];

                evaluations.models.forEach(function (model) {
                    existingOnes.push(model.get('subject_id'));
                });

                that._cachedSubjects.forEach(function (model) {
                    var subject = model;
                    var subjectId = subject.get('id');

                    if (existingOnes.indexOf(subjectId) < 0) {
                        missingOnes.push({
                            subject_id: subjectId,
                            title: subject.get('title'),
                            abbreviation: subject.get('abbreviation')
                        });
                    }
                });

                studentRow.missing = missingOnes;

                that._cachedStudentResults.push(studentRow);
            });
    };

    EvaluationsHandler.prototype.getPendingByGroup = function (req, res) {
        var school_group_id = parseInt(req.params.school_group_id);

        return that.groupRepository
            .getOne({
                id: school_group_id
            }, {
                withRelated: ['grade']
            })
            .then(function (group) {

                if (!group) {
                    res.status(HttpStatus.FORBIDDEN);
                    throw new Errors.NotFoundEntity("The provided group id was not found");
                }

                return that.studentRepository
                    .getAll({
                        where: {school_group_id: group.get('id')}
                    })
                    .then(function (students) {

                        var userRole = req.user.related('role').get('title');

                        var query = false;

                        if (userRole == 'director') {
                            query = function (q) {
                                q.distinct()
                                    .where('allocations.school_group_id', '=', group.get('id'));

                                return q;
                            };
                        } else {
                            query = function (q) {
                                q.distinct()
                                    .innerJoin('school_groups', function () {
                                        this.on('allocations.school_group_id', '=', 'school_groups.id')
                                            .andOn('school_groups.grade_id', '=', group.get('grade_id'))
                                    })
                                    .where('allocations.school_group_id', '=', group.get('id'))
                                    .andWhere('allocations.faculty_member_id', '=', req.user.related('facultyMember').get('id'));

                                return q;
                            };
                        }

                        return that.allocationRepository
                            .getAll(query, {
                                withRelated: ['subject']
                            })
                            .then(function (allocs) {

                                var subjectIds = [];
                                var subjects = [];

                                allocs.forEach(function (model) {
                                    var subject = model.related('subject');
                                    subjectIds.push(subject.get('id'));
                                    subjects.push(subject);
                                });

                                var timestamp = dateTimeUtils.timestamp();

                                return that.bimesterRepository
                                    .getCurrent(timestamp)
                                    .then(function (bimester) {

                                        return that._asyncAll(students, subjects, bimester)
                                            .then(function (data) {
                                                httpUtils.success(req, res, data);
                                            });
                                    });
                            });

                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new EvaluationsHandler();

    module.exports.getPendingByGroup = handler.getPendingByGroup;
})();