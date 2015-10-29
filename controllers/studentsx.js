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
    };

    StudentsHandler.prototype.put = function (req, res) {

    };

    StudentsHandler.prototype.getByGroup = function (req, res) {
        var principalUser = req.user,
            group_id = parseInt(req.params.group_id);

        return that.allocationRepository
            .getOne({
                faculty_member_id: principalUser.related('facultyMember').get('id'),
                school_group_id: group_id
            })
            .then(function (alloc) {
                if (!alloc) {
                    throw new Errors.ForbiddenGroupAccessError();
                }

                return that.studentRepository
                    .getAll({
                        school_group_id: group_id
                    })
                    .then(function (items) {
                        res.send(items.toJSON())
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
})();