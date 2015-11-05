// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var HttpStatus = require('http-status-codes');

(function () {
    var that;

    var EvaluationsHandler = function () {
        that = this;
        that.allocationRepository = new repos.AllocationRepository();
        that.studentRepository = new repos.StudentRepository();
        that.groupRepository = new repos.GroupRepository();
    };

    EvaluationsHandler.prototype.getPendingByGroup = function (req, res) {
        var school_group_id = parseInt(req.params.school_group_id);

        return that.groupRepository
            .findById(school_group_id)
            .then(function (group) {

                if (!group) {
                    res.status(HttpStatus.FORBIDDEN);
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
})();