// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');

(function () {
    var that;

    var GradesHandler = function () {
        that = this;
        that.gradeRepository = new repos.GradeRepository();
    };

    GradesHandler.prototype.getAll = function (req, res) {
        return that.gradeRepository
            .getAll()
            .then(function (items) {
                httpUtils.success(req, res, items);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GradesHandler.prototype.getOne = function (req, res) {
        return that.gradeRepository
            .findByNumber(req.params.grade_number)
            .then(function (item) {
                httpUtils.success(req, res, item);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GradesHandler.prototype.put = function (req, res) {
        return that.gradeRepository
            .findByNumber(req.body.grade_number)
            .then(function (item) {

                if (item) {
                    throw new Errors.EntityExistsError("The grade already exists");
                }

                return that.gradeRepository
                    .insert({
                        grade_number: req.body.grade_number,
                        title: req.body.title
                    })
                    .then(function (insertedGrade) {
                        httpUtils.success(req, res, insertedGrade);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    GradesHandler.prototype.update = function (req, res) {
        return that.gradeRepository
            .findByNumber(parseInt(req.params.grade_number))
            .then(function (item) {

                if (!item) {
                    throw new Errors.NotFoundEntity("The provided grade id does not exist");
                }

                return that.gradeRepository
                    .update({
                        grade_id: item.get('id'),
                        title: req.body.title
                    })
                    .then(function (updatedGrade) {
                        httpUtils.success(req, res, updatedGrade);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new GradesHandler();

    module.exports.getOne = handler.getOne;
    module.exports.getAll = handler.getAll;
    module.exports.put = handler.put;
    module.exports.update = handler.update;
})();