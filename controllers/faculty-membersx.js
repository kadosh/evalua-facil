// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var bcrypt = require('bcryptjs');

(function () {
    var that;

    var FacultyMembersHandler = function () {
        that = this;
        that.facultyMemberRepository = new repos.FacultyMemberRepository();
        that.userRepository = new repos.UserRepository();
        that.roleRepository = new repos.RoleRepository();
    };

    FacultyMembersHandler.prototype.delete = function (req, res) {
        var faculty_member_id = parseInt(req.params.faculty_member_id);

        return that.facultyMemberRepository
            .getOne({id: faculty_member_id}, {
                withRelated: ['user']
            })
            .then(function (facultyMember) {

                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                var user = facultyMember.related('user');

                return that.userRepository
                    .delete(user.get('id'))
                    .then(function () {
                        httpUtils.success(req, res, {});
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.changePassword = function (req, res) {

        var new_password = req.body.new_password,
            confirm_password = req.body.confirm_password,
            faculty_member_id = parseInt(req.params.faculty_member_id);

        return that.facultyMemberRepository
            .getOne({id: faculty_member_id}, {withRelated: ['user']})
            .then(function (facultyMember) {

                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                var user = facultyMember.related('user');

                var hashed_new_password = bcrypt.hashSync(new_password);

                if (new_password != confirm_password) {
                    httpUtils.handleGeneralError(req, res, new Errors.PasswordAndPasswordConfirmationDoesntMatchError());
                    return;
                }

                return that.userRepository
                    .update(user.get('id'), hashed_new_password, {})
                    .then(function () {
                        httpUtils.success(req, res, {});
                    })
                    .catch(function (error) {
                        httpUtils.handleGeneralError(req, res, error);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.getOne = function (req, res) {
        return that.facultyMemberRepository
            .getOne({id: req.params.faculty_member_id}, {withRelated: ['user.role']})
            .then(function (facultyMember) {
                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                httpUtils.success(req, res, facultyMember);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.getAll = function (req, res) {
        return that.facultyMemberRepository
            .getMany(null, {withRelated: ['user.role', 'allocations.group', 'allocations.subject', 'allocations.group.grade']})
            .then(function (items) {

                var final = [];

                items.forEach(function (facultyMember) {
                    var allocationsModel = facultyMember.related('allocations'),
                        allocations = [],
                        user = facultyMember.related('user'),
                        role = user.related('role');

                    allocationsModel.forEach(function (alloc) {
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

                    final.push({
                        id: facultyMember.get('id'),
                        user_data: facultyMember.related('user').omit(['password_hash', 'is_locked']),
                        first_name: facultyMember.get('first_name'),
                        is_locked: facultyMember.related('user').get('is_locked'),
                        last_name: facultyMember.get('last_name'),
                        role_title: role.get('title'),
                        title: facultyMember.get('title'),
                        email: facultyMember.get('email'),
                        contact_number: facultyMember.get('contact_number'),
                        allocations: allocations
                    });

                });

                httpUtils.success(req, res, final);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.put = function (req, res) {
        return that.userRepository
            .findByUserName(req.body.username)
            .then(function (user) {
                if (user) {
                    throw new Errors.UsernameAlreadyInUseError();
                }

                return that.roleRepository
                    .findByName(req.body.role_title)
                    .then(function (role) {

                        if (!role) {
                            throw new Errors.NotFoundEntity("The provided role title doesn't exist");
                        }

                        dbContext.Bookshelf.transaction(function (t) {
                            // Has the password using Bluefish algorithm
                            var hashedPassword = bcrypt.hashSync(req.body.password);

                            // Create the user
                            return that.userRepository
                                .insert({
                                    username: req.body.username,
                                    password_hash: hashedPassword,
                                    role_id: role.get('id')
                                }, {transacting: t})
                                .then(function (user) {

                                    // Create the faculty member
                                    return that.facultyMemberRepository
                                        .insert({
                                            first_name: req.body.first_name,
                                            last_name: req.body.last_name,
                                            title: req.body.title,
                                            email: req.body.email,
                                            contact_number: req.body.contact_number,
                                            user_id: user.get('id')
                                        }, {transacting: t})
                                        .then(function (facultyMember) {

                                            var result = {
                                                faculty_member: facultyMember,
                                                user_data: {
                                                    username: user.get('username'),
                                                    role: role.get('title')
                                                }
                                            };

                                            httpUtils.success(req, res, result);
                                        });

                                })
                                .catch(t.rollback);
                        });
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

    FacultyMembersHandler.prototype.update = function (req, res) {
        return that.facultyMemberRepository
            .getOne({id: req.params.faculty_member_id})
            .then(function (facultyMember) {

                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                return that.facultyMemberRepository
                    .update({
                        faculty_member_id: req.params.faculty_member_id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        title: req.body.title,
                        contact_number: req.body.contact_number,
                        email: req.body.email
                    })
                    .then(function (result) {
                        httpUtils.success(req, res, result);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.deactivate = function (req, res) {
        return that.facultyMemberRepository
            .getOne({
                id: req.params.faculty_member_id
            })
            .then(function (facultyMember) {
                console.log(facultyMember);
                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                return that.userRepository
                    .lockUser(facultyMember.get('user_id'))
                    .then(function () {
                        httpUtils.success(req, res, {message: 'The user has been blocked and will not be able to access the system.'});
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    FacultyMembersHandler.prototype.activate = function (req, res) {
        return that.facultyMemberRepository
            .getOne({
                id: req.params.faculty_member_id
            })
            .then(function (facultyMember) {

                if (!facultyMember) {
                    throw new Errors.NotFoundEntity("The requested faculty member id was not found");
                }

                return that.userRepository
                    .unlockUser(facultyMember.get('user_id'))
                    .then(function (result) {
                        httpUtils.success(req, res, {message: 'The user is now able to access the system.'});
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new FacultyMembersHandler();

    module.exports.getOne = handler.getOne;
    module.exports.getAll = handler.getAll;
    module.exports.put = handler.put;
    module.exports.update = handler.update;
    module.exports.activate = handler.activate;
    module.exports.deactivate = handler.deactivate;
    module.exports.delete = handler.delete;
    module.exports.changePassword = handler.changePassword;
})();

