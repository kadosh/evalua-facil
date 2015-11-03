// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

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
                        res.json(student);
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
            .then(function (student) {

                if (!student) {
                    throw new Errors.NotFoundEntity("The provided student id was not found");
                }

                return that.studentRepository
                    .update({
                        first_name: first_name,
                        last_name: last_name,
                        mothers_name: mothers_name,
                        gender: gender
                    })
                    .then(function (student) {
                        res.json(student);
                    });
            });
    };

    StudentsHandler.prototype._execGetByGroup = function (req, res) {
        var group_id = parseInt(req.params.group_id);

        return that.studentRepository
            .getAll({
                school_group_id: group_id
            })
            .then(function (items) {
                res.send(items.toJSON())
            });
    };

    StudentsHandler.prototype.put = function (req, res) {
        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execPut(req, res)
                .catch(function (error) {
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
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
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
                });
        }
    };

    StudentsHandler.prototype.update = function (req, res) {
        if (principalUser.related('role').get('title') == 'director') {
            // No alloc validation
            return that._execUpdate(req, res)
                .catch(function (error) {
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
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

                    return that._execUpdate(req, res);
                })
                .catch(function (error) {
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
                });
        }
    };

    StudentsHandler.prototype.getByGroup = function (req, res) {
        var principalUser = req.user,
            group_id = parseInt(req.params.group_id);

        if (principalUser.related('role').get('title') == 'director') {
            return that._execGetByGroup(req, res)
                .catch(function (error) {
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
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
                    res.status(500).json({
                        error: true,
                        data: {
                            message: error.message
                        }
                    });
                });
        }
    };

    var handler = new StudentsHandler();

    module.exports.put = handler.put;
    module.exports.update = handler.update;
    module.exports.getByGroup = handler.getByGroup;
})();