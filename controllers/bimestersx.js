// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');
var httpUtils = require('../utils/http-utils');
var HttpStatus = require('http-status-codes');

(function () {
    var that;

    var BimestersHandler = function () {
        that = this;
        that.bimesterRepository = new repos.BimesterRepository();
    };

    BimestersHandler.prototype.getAll = function (req, res) {
        return that.bimesterRepository
            .getAll({})
            .then(function (items) {
                httpUtils.success(req, res, items);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    BimestersHandler.prototype.getOne = function (req, res) {

        return that.bimesterRepository
            .getOne({bimester_number: req.params.bimester_number})
            .then(function (bimester) {

                if (!bimester) {
                    res.status(HttpStatus.NOT_FOUND);
                    throw new Errors.NotFoundEntity("The provided bimester number does not exist");
                }

                httpUtils.success(req, res, bimester);
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    BimestersHandler.prototype.update = function (req, res) {
        return that.bimesterRepository
            .getOne({bimester_number: req.params.bimester_number})
            .then(function (bimester) {

                if (!bimester) {
                    res.status(HttpStatus.NOT_FOUND);
                    throw new Errors.NotFoundEntity("The provided bimester number does not exist");
                }

                return that.bimesterRepository
                    .update({
                        id: bimester.get('id'),
                        start_timestamp: parseInt(req.body.start_timestamp),
                        end_timestamp: parseInt(req.body.end_timestamp)
                    })
                    .then(function (updatedBimester) {
                        httpUtils.success(req, res, updatedBimester);
                    });
            })
            .catch(function (error) {
                httpUtils.handleGeneralError(req, res, error);
            });
    };

    var handler = new BimestersHandler();

    module.exports.getOne = handler.getOne;
    module.exports.getAll = handler.getAll;
    module.exports.update = handler.update;

})();