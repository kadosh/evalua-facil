// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');

(function () {
    var that;

    var GroupsHandler = function () {
        that = this;
        that.gradeRepository = new repos.GradeRepository();
        that.groupRepository = new repos.GroupRepository();
    };

    GroupsHandler.prototype.getAllByGradeNumber = function (req, res) {
        return that.gradeRepository
            .findByNumber(parseInt(req.params.grade_number))
            .then(function (grade) {

                if (!grade) {
                    throw new Errors.NotFoundEntity("The provided grade number does not exist");
                }

                return that.groupRepository
                    .findByGradeNumber(grade.get('grade_number'))
                    .then(function (items) {
                        httpUtils.success(req, res, items);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GroupsHandler.prototype.getAll = function (req, res) {
        return that.groupRepository
            .getAll()
            .then(function (items) {
                httpUtils.success(req, res, items);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GroupsHandler.prototype.put = function (req, res) {
        var grade_number = parseInt(req.body.grade_number),
            group_name = req.body.group_name;

        return that.groupRepository
            .getByGradeNumberAndName(grade_number, group_name)
            .then(function (schoolGroup) {

                if (schoolGroup) {
                    throw new Errors.EntityExistsError("The school group already exists");
                }

                return that.gradeRepository
                    .findByNumber(grade_number)
                    .then(function (grade) {

                        if (!grade) {
                            throw new Errors.NotFoundEntity("The provided grade_number does not exist");
                        }

                        return that.groupRepository
                            .insert({
                                grade_id: grade.get('id'),
                                group_name: req.body.group_name,
                                total_students: -1
                            })
                            .then(function (group) {
                                httpUtils.success(req, res, group);
                            });
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GroupsHandler.prototype.update = function (req, res) {
        var group_id = parseInt(req.params.group_id),
            group_name = req.body.group_name;

        return that.groupRepository
            .findById(group_id)
            .then(function (schoolGroup) {

                if (!schoolGroup) {
                    throw new Errors.EntityExistsError("The provided group_id does not exist");
                }

                return that.groupRepository
                    .getByGradeIdAndName(schoolGroup.get('grade_id'), group_name)
                    .then(function (schoolGroup) {

                        if (schoolGroup) {
                            throw new Errors.EntityExistsError("Can't save changes because there's a group with the exact same information.");
                        }

                        return that.groupRepository
                            .update({
                                group_id: group_id,
                                group_name: group_name
                            })
                            .then(function (group) {
                                httpUtils.success(req, res, group);
                            });
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GroupsHandler.prototype.getOne = function (req, res) {
        var group_id = parseInt(req.params.group_id);

        return that.groupRepository
            .findById(group_id)
            .then(function (schoolGroup) {

                if (!schoolGroup) {
                    throw new Errors.EntityExistsError("The provided group_id does not exist");
                }

                httpUtils.success(req, res, schoolGroup);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GroupsHandler.prototype.delete = function (req, res) {
        var group_id = parseInt(req.params.group_id);

        return that.groupRepository
            .findById(group_id)
            .then(function (schoolGroup) {

                if (!schoolGroup) {
                    throw new Errors.EntityExistsError("The provided group_id does not exist");
                }

                return that.groupRepository
                    .delete(group_id)
                    .then(function () {
                        httpUtils.success(req, res, {});
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new GroupsHandler();

    module.exports.getAllByGradeNumber = handler.getAllByGradeNumber;
    module.exports.put = handler.put;
    module.exports.update = handler.update;
    module.exports.delete = handler.delete;
    module.exports.getOne = handler.getOne;
    module.exports.getAll = handler.getAll;
})();