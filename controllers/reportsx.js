// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var mysql = require('mysql2');

var config = require('../env')[process.env.NODE_ENV || 'development'];

(function () {
    var that;

    var ReportsHandler = function () {
        that = this;
        that.gradeRepository = new repos.GradeRepository();
    };

    ReportsHandler.prototype.getByBimester = function (req, res) {
        
        var connection = mysql.createConnection({
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            host: config.DB_HOST,
            database: config.DB_NAME
        });
        
        var bimester_number = parseInt(req.params.bimester_number),
            school_group_id = parseInt(req.params.school_group_id);

        var result = {
            absences: [],
            participation: [],
            performance: [],
            reading: [],
            math: [],
            friendship: []
        };

        var params = {
            group: school_group_id,
            bimester: bimester_number
        };

        connection.config.namedPlaceholders = true;

        connection.execute(
            'call get_absences_count_bim(:group, :bimester)',
            params,
            function (err, rows) {
                result.absences = rows;

                connection.execute(
                    'call get_participation_score_bim(:group, :bimester)',
                    params,
                    function (err, rows) {
                        result.participation = rows;

                        connection.execute(
                            'call get_performance_score_bim(:group, :bimester)',
                            params,
                            function (err, rows) {
                                result.performance = rows;

                                connection.execute(
                                    'call get_reading_score_bim(:group, :bimester)',
                                    params,
                                    function (err, rows) {
                                        result.reading = rows;

                                        connection.execute(
                                            'call get_math_score_bim(:group, :bimester)',
                                            params,
                                            function (err, rows) {
                                                result.math = rows;

                                                connection.execute(
                                                    'call get_friendship_score_bim(:group, :bimester)',
                                                    params,
                                                    function (err, rows) {
                                                        result.friendship = rows;
                                                        httpUtils.success(req, res, result);
                                                        connection.close();
                                                        return;
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

        connection.close();
        httpUtils.handleGeneralError(req, res, new Errors.StoredProcedureCallError());
    };

    var handler = new ReportsHandler();

    module.exports.getByBimester = handler.getByBimester;
})();