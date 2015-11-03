// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

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
                res.send(items.toJSON());
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

    GradesHandler.prototype.getOne = function (req, res) {
        return that.gradeRepository
            .findByNumber(req.params.grade_number)
            .then(function (item) {
                res.json(item);
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
                        res.json(insertedGrade);
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
                        res.json(updatedGrade);
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

    var handler = new GradesHandler();

    module.exports.getOne = handler.getOne;
    module.exports.getAll = handler.getAll;
    module.exports.put = handler.put;
    module.exports.update = handler.update;
})();