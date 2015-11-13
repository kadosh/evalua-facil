(function () {
    var ERRORS = {
        REQUIRED_FIELD: "REQUIRED_FIELD",
        INVALID_EMAIL_ADDRESS: "INVALID_EMAIL_ADDRESS",
        INVALID_NUMBER: "INVALID_NUMBER",
        INVALID_ID: "INVALID_ID"
    };

    module.exports = {
        REQUIRED_FIELD_RULE: {
            rule: 'required',
            message: ERRORS.REQUIRED_FIELD
        },
        INVALID_EMAIL_ADDRESS: {
            rule: 'email',
            message: ERRORS.INVALID_EMAIL_ADDRESS
        },
        INVALID_NUMBER: {
            rule: 'numeric',
            message: ERRORS.INVALID_NUMBER
        },
        INVALID_ID: {
            rule: 'naturalNonZero',
            message: ERRORS.INVALID_ID
        }
    };
})();