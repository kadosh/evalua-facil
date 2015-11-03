// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

(function () {
    var that;

    var SubjectsHandler = function () {
        that = this;
        that.gradeRepository = new repos.GradeRepository();
        that.subjectRepository = new repos.SubjectRepository();
    };

    SubjectsHandler.prototype.getAllByGradeNumber = function (req, res) {
        return that.gradeRepository
            .findByNumber(parseInt(req.params.grade_number))
            .then(function (grade) {

                if (!grade) {
                    throw new Errors.NotFoundEntity("The provided grade_number was not found");
                }
                console.log("grade id: ", grade.get('id'));

                return that.subjectRepository
                    .getAllByGradeId(grade.get('id'))
                    .then(function (items) {
                        res.send(items.toJSON());
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

    SubjectsHandler.prototype.put = function (req, res) {
        return that.subjectRepository
            .getByGradeNumberAndAbbreviation(parseInt(req.body.grade_number), req.body.abbreviation)
            .then(function (subject) {

                if (subject) {
                    throw new Errors.EntityExistsError("The subject already exists");
                }

                return that.gradeRepository
                    .findByNumber(parseInt(req.body.grade_number))
                    .then(function (grade) {

                        if (!grade) {
                            throw new Errors.NotFoundEntity("The provided grade_number does not exist");
                        }

                        return that.subjectRepository
                            .insert({
                                grade_id: grade.get('id'),
                                title: req.body.title,
                                abbreviation: req.body.abbreviation
                            })
                            .then(function (subject) {
                                res.json(subject);
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

    SubjectsHandler.prototype.update = function (req, res) {
        var grade_number = parseInt(req.body.grade_number),
            subject_id = parseInt(req.params.subject_id),
            title = req.body.title;

        // First try to find the subject
        return that.subjectRepository
            .findById(subject_id)
            .then(function (subject) {

                if (!subject) {
                    throw new Errors.NotFoundEntity("The provided subject_id does not exist");
                }

                // Now, validate that the request is not trying to move a subject from one grade to another
                return that.gradeRepository
                    .findById(subject.get('grade_id'))
                    .then(function (grade) {

                        // Check if another subject already has the provided information
                        return that.subjectRepository
                            .getByGradeNumberAndTitle(grade.get('grade_number'), title)
                            .then(function (matchingSubject) {

                                if (matchingSubject) {
                                    throw new Errors.EntityExistsError("Can't make the requested changes because there's a subject with the same title");
                                }

                                // Finally, do the operation
                                return that.subjectRepository
                                    .update({
                                        subject_id: subject_id,
                                        title: req.body.title
                                    })
                                    .then(function (subject) {
                                        res.json(subject);
                                    });
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

    var handler = new SubjectsHandler();

    module.exports.getAllByGradeNumber = handler.getAllByGradeNumber;
    module.exports.put = handler.put;
    module.exports.update = handler.update;
})();