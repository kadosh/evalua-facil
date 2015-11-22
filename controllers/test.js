var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

var mysql = require('mysql2');
var connection = mysql.createConnection({
    user: 'root',
    password: 'pass.word1',
    host: 'localhost',
    database : 'evalua'
});

(function () {
    var that;

    var TestHandler = function () {
        that = this;
        that.gradeRepository = new repos.GradeRepository();
    };

    TestHandler.prototype.get = function (req, res) {
        connection.execute('call new_procedure(25)', function (err, rows) {
            res.json(rows);
        });
    };

    var handler = new TestHandler();

    module.exports.getTest = handler.get;
})();