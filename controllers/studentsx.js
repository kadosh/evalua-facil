// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');

(function () {
    var that;

    var StudentsHandler = function () {
        that = this;
        that.allocationRepository = new repos.AllocationRepository();
        that.studentRepository = new repos.StudentRepository();
        that.groupRepository = new repos.GroupRepository();
    };

    StudentsHandler.prototype._execPut = function (req, res) {
        var first_name = req.body.first_name,
            last_name = req.body.last_name,
            mothers_name = req.body.mothers_name,
            school_group_id = parseInt(req.body.school_group_id),
            gender = req.body.gender;

        return that.groupRepository
            .findById(school_group_id)
            .then(function (group) {

                if (!group) {
                    throw new Errors.NotFoundEntity("The provided group id was not found");
                }

                return that.studentRepository
                    .insert({
                        first_name: first_name,
                        last_name: last_name,
                        mothers_name: mothers_name,
                        school_group_id: school_group_id,
                        gender: gender
                    })
                    .then(function (student) {
                        httpUtils.success(req, res, student);
                    });
            });
    };

    StudentsHandler.prototype._execUpdate = function (req, res) {
        var first_name = req.body.first_name,
            last_name = req.body.last_name,
            mothers_name = req.body.mothers_name,
            student_id = parseInt(req.params.student_id),
            gender = req.body.gender;

        return that.studentRepository
            .findById(student_id)
            .then(function (existingStudent) {

                if (!existingStudent) {
                    throw new Errors.NotFoundEntity("The provided student id was not found");
                }

                return that.studentRepository
                    .update({
                        first_name: first_name,
                        last_name: last_name,
                        mothers_name: mothers_name,
                        gender: gender,
                        student_id: student_id
                    })
                    .then(function (student) {
                        httpUtils.success(req, res, student);
                    });
            });
    };

    StudentsHandler.prototype._execDelete = function (req, res) {
        var student_id = parseInt(req.params.student_id);

        return that.studentRepository
            .findById(student_id)
            .then(function (student) {

                if (!student) {
                    res.status(404);
                    throw new Errors.NotFoundEntity("The provided student id was not found");
                }

                return that.studentRepository
                    .delete(student_id)
                    .then(function (student) {
                        httpUtils.success(req, res, {message: "The student was successfully deleted."});
                    });
            });
    };

    StudentsHandler.prototype._execGetOne = function (req, res) {
        var student_id = parseInt(req.params.student_id);

        return that.studentRepository
            .findById(student_id)
            .then(function (student) {

                if (!student) {
                    res.status(404);
                    throw new Errors.NotFoundEntity("The provided student id was not found");
                }

                httpUtils.success(req, res, student.omit(['school_group_id']));
            });
    };

    StudentsHandler.prototype._execGetByGroup = function (req, res) {
        var group_id = parseInt(req.params.school_group_id);

        return that.groupRepository
            .findById(group_id)
            .then(function (group) {

                if (!group) {
                    res.status(404);
                    throw new Errors.NotFoundEntity("The provided group was not found");
                }

                return that.studentRepository
                    .getAll({
                        where: {school_group_id: group_id}
                    })
                    .then(function (items) {
                        httpUtils.success(req, res, items);
                    });
            })
    };

    StudentsHandler.prototype.put = function (req, res) {
        var principalUser = req.user;

        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execPut(req, res)
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
        else {
            return that.allocationRepository
                .getOne({
                    faculty_member_id: principalUser.related('facultyMember').get('id'),
                    school_group_id: school_group_id
                })
                .then(function (alloc) {
                    if (!alloc) {
                        throw new Errors.ForbiddenGroupAccessError();
                    }

                    return that._execPut(req, res);
                })
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
    };

    StudentsHandler.prototype.update = function (req, res) {
        var principalUser = req.user,
            student_id = req.params.student_id;

        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execUpdate(req, res)
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
        else {

            return that.studentRepository
                .findById(student_id)
                .then(function (student) {
                    return that.allocationRepository
                        .getOne({
                            faculty_member_id: principalUser.related('facultyMember').get('id'),
                            school_group_id: student.get('school_group_id')
                        })
                        .then(function (alloc) {
                            if (!alloc) {
                                res.status(403);
                                throw new Errors.ForbiddenGroupAccessError();
                            }

                            return that._execUpdate(req, res);
                        });
                })
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
    };

    StudentsHandler.prototype.getOne = function (req, res) {
        var principalUser = req.user,
            student_id = req.params.student_id;

        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execGetOne(req, res)
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
        else {
            return that.studentRepository
                .findById(student_id)
                .then(function (student) {
                    return that.allocationRepository
                        .getOne({
                            faculty_member_id: principalUser.related('facultyMember').get('id'),
                            school_group_id: student.get('school_group_id')
                        })
                        .then(function (alloc) {
                            if (!alloc) {
                                throw new Errors.ForbiddenGroupAccessError();
                            }

                            return that._execGetOne(req, res);
                        });
                })
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
    };

    StudentsHandler.prototype.delete = function (req, res) {
        var principalUser = req.user,
            student_id = req.params.student_id;

        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execDelete(req, res)
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
        else {
            return that.studentRepository
                .findById(student_id)
                .then(function (student) {
                    return that.allocationRepository
                        .getOne({
                            faculty_member_id: principalUser.related('facultyMember').get('id'),
                            school_group_id: student.get('school_group_id')
                        })
                        .then(function (alloc) {
                            if (!alloc) {
                                throw new Errors.ForbiddenGroupAccessError();
                            }

                            return that._execDelete(req, res);
                        });
                })
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
    };

    StudentsHandler.prototype.getByGroup = function (req, res) {
        var principalUser = req.user,
            group_id = parseInt(req.params.school_group_id);

        if (principalUser.related('role').get('title') == 'director') {
            return that._execGetByGroup(req, res)
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        } else {
            return that.allocationRepository
                .getOne({
                    faculty_member_id: principalUser.related('facultyMember').get('id'),
                    school_group_id: group_id
                })
                .then(function (alloc) {
                    if (!alloc) {
                        throw new Errors.ForbiddenGroupAccessError();
                    }

                    return that._execGetByGroup(req, res);
                })
                .catch(function (error) {
                    httpUtils.handleGeneralError(req, res, error);
                });
        }
    };

    var handler = new StudentsHandler();

    module.exports.put = handler.put;
    module.exports.update = handler.update;
    module.exports.getByGroup = handler.getByGroup;
    module.exports.delete = handler.delete;
})();