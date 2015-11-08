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
        that.stEvaluationDetailRepository = new repos.StudentEvaluationDetailRepository();
        that._cachedSubjects = [];
        that._cachedStudentResults = [];
    };

    EvaluationsHandler.prototype._asyncLoadStudentsEvaluations = function (students, subjects, bimester) {

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

                promises.push(that._asyncLoadStudentEvaluation(
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

    EvaluationsHandler.prototype._asyncLoadStudentEvaluation = function (studentRow, studentId, bimester_number) {

        return that.stEvaluationRepository
            .getAllByStudent(studentId, bimester_number, {
                withRelated: ['details.indicator', 'subject']
            })
            .then(function (evaluations) {

                var currentEvaluations = [];

                evaluations.models.forEach(function (model) {
                    currentEvaluations.push(that._makeEvaluationFriendly(model));
                });

                studentRow.evaluations = currentEvaluations;

                that._cachedStudentResults.push(studentRow);
            });
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

    EvaluationsHandler.prototype.getStudentsListByGroup = function (req, res) {
        var school_group_id = parseInt(req.params.school_group_id),
            bimester_number = parseInt(req.params.bimester_number);

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
                                    .getOne({
                                        bimester_number: bimester_number
                                    })
                                    .then(function (bimester) {

                                        return that._asyncLoadStudentsEvaluations(students, subjects, bimester)
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

    EvaluationsHandler.prototype.getStudentsListByGroupFilterSubject = function (req, res) {
        var school_group_id = parseInt(req.params.school_group_id),
            bimester_number = parseInt(req.params.bimester_number),
            subject_id = parseInt(req.params.bimester_number);

        return that.groupRepository
            .getOne({
                id: school_group_id
            }, {
                withRelated: ['grade']
            })
            .then(function (group) {

                if (!group) {
                    res.status(HttpStatus.NOT_FOUND);
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
                                    .where('allocations.school_group_id', '=', group.get('id'))
                                    .andWhere('allocations.subject_id', '=', subject_id);

                                return q;
                            };
                        } else {
                            query = function (q) {
                                q.distinct()
                                    .where('allocations.school_group_id', '=', group.get('id'))
                                    .andWhere('allocations.faculty_member_id', '=', req.user.related('facultyMember').get('id'))
                                    .andWhere('allocations.subject_id', '=', subject_id);

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
                                    .getOne({
                                        bimester_number: bimester_number
                                    })
                                    .then(function (bimester) {

                                        return that._asyncLoadStudentsEvaluations(students, subjects, bimester)
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

    EvaluationsHandler.prototype._processInsertIndicator = function (evaluation_id, indicator_id, value, status) {
        var row = that.getPojoDetail(evaluation_id, indicator_id);

        if (!isNaN(value)) {
            row.input_value = value;
        } else {
            status.is_finished = false;
        }

        return that.stEvaluationDetailRepository.insert(row);
    };

    EvaluationsHandler.prototype._processUpdateIndicator = function (id, value, status) {
        var row = that._getPojoUpdateDetail(id);

        if (!isNaN(value)) {
            row.input_value = value;
        } else {
            status.is_finished = false;
        }

        return that.stEvaluationDetailRepository.update(row);
    };

    EvaluationsHandler.prototype._getPojoUpdateDetail = function (id) {
        return {
            id: id,
            input_value: null
        };
    };

    EvaluationsHandler.prototype.getPojoDetail = function (evaluation_id, indicator_id) {
        return {
            student_evaluation_id: evaluation_id,
            indicator_id: indicator_id,
            input_value: null
        };
    };

    EvaluationsHandler.prototype._makeEvaluationFriendly = function (evaluation) {
        var result = {
            evaluation: evaluation.omit(['details', 'subject'])
        };

        result.evaluation.details = {};
        result.evaluation.subject = evaluation.related('subject');

        var details = evaluation.related('details');

        details.forEach(function (detail) {
            if (detail.get('indicator_id') == 1) {
                result.evaluation.details.absences_count = detail.get('input_value');
            } else if (detail.get('indicator_id') == 2) {
                result.evaluation.details.participation_score = detail.get('input_value');
            } else if (detail.get('indicator_id') == 3) {
                result.evaluation.details.performance_score = detail.get('input_value');
            } else if (detail.get('indicator_id') == 4) {
                result.evaluation.details.reading_score = detail.get('input_value');
            } else if (detail.get('indicator_id') == 5) {
                result.evaluation.details.math_score = detail.get('input_value');
            } else if (detail.get('indicator_id') == 6) {
                result.evaluation.details.friendship_score = detail.get('input_value');
            }
        });

        return result;
    };

    EvaluationsHandler.prototype.put = function (req, res) {
        var student_id = parseInt(req.params.student_id),
            subject_id = parseInt(req.body.subject_id),
            absences_count = parseInt(req.body.absences_count),
            participation_score = parseFloat(req.body.participation_score),
            performance_score = parseFloat(req.body.performance_score),
            reading_score = parseFloat(req.body.reading_score),
            math_score = parseFloat(req.body.math_score),
            bimester_number = parseInt(req.params.bimester_number),
            friendship_score = parseFloat(req.body.friendship_score);

        return that.subjectRepository
            .findById(subject_id)
            .then(function (subject) {
                if (!subject) {
                    res.status(HttpStatus.NOT_FOUND);
                    throw new Errors.NotFoundEntity("The provided subject id was not found");
                }

                return that.studentRepository
                    .findById(student_id)
                    .then(function (student) {
                        if (!student) {
                            res.status(HttpStatus.NOT_FOUND);
                            throw new Errors.NotFoundEntity("The provided student id was not found");
                        }

                        return that.stEvaluationRepository
                            .getOne({
                                student_id: student_id,
                                bimester_number: bimester_number,
                                subject_id: subject_id
                            }, {
                                withRelated: ['details.indicator']
                            })
                            .then(function (evaluation) {
                                var status = {
                                    is_finished: true
                                };
                                var detailPromises = [];

                                if (!evaluation) {

                                    return that.stEvaluationRepository
                                        .insert({
                                            bimester_number: bimester_number,
                                            subject_id: subject_id,
                                            created_timestamp: dateTimeUtils.timestamp(),
                                            last_change_timestamp: dateTimeUtils.timestamp(),
                                            is_in_conflict: 0,
                                            student_id: student_id,
                                            is_finished: 0
                                        })
                                        .then(function (evaluation) {

                                            var evaluationId = evaluation.get('id');

                                            that._processInsertIndicator(evaluationId, 1, absences_count, status);
                                            that._processInsertIndicator(evaluationId, 2, participation_score, status);
                                            that._processInsertIndicator(evaluationId, 3, performance_score, status);

                                            if (subject.get('abbreviation') == 'ESP') {
                                                that._processInsertIndicator(evaluationId, 4, reading_score, status);
                                            }

                                            if (subject.get('abbreviation') == 'MAT') {
                                                that._processInsertIndicator(evaluationId, 5, math_score, status);
                                            }

                                            that._processInsertIndicator(evaluationId, 6, friendship_score, status);

                                            var lambdaExecuteSaveDetails = function () {
                                                return Promise.all(detailPromises)
                                                    .then(function () {
                                                        var result = {
                                                            evaluation: {
                                                                id: evaluation.get('id'),
                                                                bimester_number: evaluation.get('bimester_number'),
                                                                is_finished: status.is_finished,
                                                                details: {
                                                                    absences_count: absences_count,
                                                                    participation_score: participation_score,
                                                                    performance_score: performance_score,
                                                                    friendship_score: friendship_score
                                                                }
                                                            }
                                                        };

                                                        if (subject.get('abbreviation') == 'MAT') {
                                                            result.evaluation.details.math_score = math_score;
                                                        }

                                                        if (subject.get('abbreviation') == 'ESP') {
                                                            result.evaluation.details.reading_score = reading_score;
                                                        }


                                                        httpUtils.success(req, res, result);
                                                    });
                                            };

                                            if (status.is_finished) {
                                                return that.stEvaluationRepository
                                                    .update({
                                                        id: evaluation.get('id'),
                                                        last_change_timestamp: evaluation.get('last_change_timestamp'),
                                                        is_in_conflict: 0,
                                                        is_finished: 1,
                                                        finished_timestamp: evaluation.get('last_change_timestamp')
                                                    })
                                                    .then(function () {
                                                        return lambdaExecuteSaveDetails();
                                                    });
                                            } else {
                                                return lambdaExecuteSaveDetails();
                                            }

                                        });
                                } else {

                                    if (evaluation.get('is_finished') == 1) {
                                        httpUtils.success(req, res, that._makeEvaluationFriendly(evaluation));
                                        return;
                                    }

                                    evaluation.related('details').forEach(function (detail) {
                                        if (detail.get('indicator_id') == 1) {
                                            that._processUpdateIndicator(detail.get('id'), absences_count, status);
                                        } else if (detail.get('indicator_id') == 2) {
                                            that._processUpdateIndicator(detail.get('id'), participation_score, status);
                                        } else if (detail.get('indicator_id') == 3) {
                                            that._processUpdateIndicator(detail.get('id'), performance_score, status);
                                        } else if (detail.get('indicator_id') == 4 && subject.get('abbreviation') == 'ESP') {
                                            that._processUpdateIndicator(detail.get('id'), reading_score, status);
                                        } else if (detail.get('indicator_id') == 5 && subject.get('abbreviation') == 'MAT') {
                                            that._processUpdateIndicator(detail.get('id'), math_score, status);
                                        } else if (detail.get('indicator_id') == 6) {
                                            that._processUpdateIndicator(detail.get('id'), friendship_score, status);
                                        }
                                    });

                                    var lambdaExecuteSaveDetails = function () {
                                        return Promise.all(detailPromises)
                                            .then(function () {
                                                var result = {
                                                    evaluation: {
                                                        id: evaluation.get('id'),
                                                        bimester_number: evaluation.get('bimester_number'),
                                                        is_finished: status.is_finished ? true : false,
                                                        details: {
                                                            absences_count: absences_count,
                                                            participation_score: participation_score,
                                                            performance_score: performance_score,
                                                            friendship_score: friendship_score
                                                        }
                                                    }
                                                };

                                                if (subject.get('abbreviation') == 'MAT') {
                                                    result.evaluation.details.math_score = math_score;
                                                }

                                                if (subject.get('abbreviation') == 'ESP') {
                                                    result.evaluation.details.reading_score = reading_score;
                                                }


                                                httpUtils.success(req, res, result);
                                            });
                                    };

                                    var now = dateTimeUtils.timestamp();

                                    return that.stEvaluationRepository
                                        .update({
                                            id: evaluation.get('id'),
                                            last_change_timestamp: now,
                                            is_in_conflict: 0,
                                            is_finished: status.is_finished ? 1 : 0,
                                            finished_timestamp: status.is_finished ? now : null
                                        })
                                        .then(function () {
                                            return lambdaExecuteSaveDetails();
                                        });
                                }
                            });
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new EvaluationsHandler();

    module.exports.getPendingByGroup = handler.getPendingByGroup;
    module.exports.put = handler.put;
    module.exports.getStudentsListByGroup = handler.getStudentsListByGroup;
    module.exports.getStudentsListByGroupFilterSubject = handler.getStudentsListByGroupFilterSubject;
})();