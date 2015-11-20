(function () {
    var ERRORS = {
        REQUIRED_FIELD: "REQUIRED_FIELD",
        INVALID_EMAIL_ADDRESS: "INVALID_EMAIL_ADDRESS",
        INVALID_NUMBER: "INVALID_NUMBER",
        INVALID_ID: "INVALID_ID",
        ALLOCATION_IN_USE: "ALLOCATION_IN_USE",
        SUBJECT_NOT_FOUND: "SUBJECT_NOT_FOUND",
        SCHOOL_GROUP_NOT_FOUND: "SCHOOL_GROUP_NOT_FOUND",
        GRADE_NUMBER_NOT_FOUND: "GRADE_NUMBER_NOT_FOUND",
        FACULTY_NOT_FOUND: "FACULTY_NOT_FOUND",
        ERRORS_ON_ALLOCATIONS_FORM: "ERRORS_ON_ALLOCATIONS_FORM",
        ALLOCATION_NOT_FOUND: "ALLOCATION_NOT_FOUND",
        ALLOCATION_DOESNT_BELONG_TO_FACULTY: "ALLOCATION_DOESNT_BELONG_TO_FACULTY"
    };

    module.exports.def = ERRORS;

    module.exports.rules = {
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