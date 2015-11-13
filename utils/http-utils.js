(function () {
    var debug = false;

    module.exports.handleGeneralError = function (req, res, error, formErrors) {

        if (debug) {
            console.log(error);
        }

        if (res.statusCode < 400) {
            res.status(500);
        }

        var result = {
            error: true,
            success: false,
            message: error.message,
            debug_error: debug ? error : {},
            form_errors: formErrors ? formErrors : []
        };

        res.json(result);
    };

    module.exports.success = function (req, res, data) {
        if (debug) {
            console.log(data);
        }

        res.json({
            data: data,
            sucess: true,
            error: false
        });
    };
})();