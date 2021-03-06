(function () {
    // Create a new object, that prototypally inherits from the Error constructor.
    function InvalidGrade(message) {
        this.name = 'InvalidGrade';
        this.message = message || 'The provided grade is invalid';
        this.stack = (new Error()).stack;
    }

    InvalidGrade.prototype = Object.create(Error.prototype);
    InvalidGrade.prototype.constructor = InvalidGrade;

    module.exports.InvalidGrade = InvalidGrade;

    function EntityExistsError(message) {
        this.name = 'EntityExistsError';
        this.message = message || 'The entity already exists';
        this.stack = (new Error()).stack;
    }

    EntityExistsError.prototype = Object.create(Error.prototype);
    EntityExistsError.prototype.constructor = EntityExistsError;

    module.exports.EntityExistsError = EntityExistsError;

    function NotFoundEntity(message) {
        this.name = 'NotFoundEntity';
        this.message = message || 'The entity was not found';
        this.stack = (new Error()).stack;
    }

    NotFoundEntity.prototype = Object.create(Error.prototype);
    NotFoundEntity.prototype.constructor = NotFoundEntity;

    module.exports.NotFoundEntity = NotFoundEntity;

    function InvalidBimester(message) {
        this.name = 'InvalidBimester';
        this.message = message || 'The provided bimester is invalid';
        this.stack = (new Error()).stack;
    }

    InvalidBimester.prototype = Object.create(Error.prototype);
    InvalidBimester.prototype.constructor = InvalidBimester;

    module.exports.InvalidBimester = InvalidBimester;

    function RevisionIsDone(message) {
        this.name = 'RevisionIsDone';
        this.message = message || "The revision is already done and the platform can't receive any other requests";
        this.stack = (new Error()).stack;
    }

    RevisionIsDone.prototype = Object.create(Error.prototype);
    RevisionIsDone.prototype.constructor = RevisionIsDone;

    module.exports.RevisionIsDone = RevisionIsDone;

    function UsernameAlreadyInUseError(message) {
        this.name = 'UsernameAlreadyInUseError';
        this.message = message || "The provided username already exists.";
        this.stack = (new Error()).stack;
    }

    UsernameAlreadyInUseError.prototype = Object.create(Error.prototype);
    UsernameAlreadyInUseError.prototype.constructor = UsernameAlreadyInUseError;

    module.exports.UsernameAlreadyInUseError = UsernameAlreadyInUseError;

    function InvalidOperationError(message) {
        this.name = 'InvalidOperationError';
        this.message = message || "Invalid Operation Error.";
        this.stack = (new Error()).stack;
    }

    InvalidOperationError.prototype = Object.create(Error.prototype);
    InvalidOperationError.prototype.constructor = InvalidOperationError;

    module.exports.InvalidOperationError = InvalidOperationError;

    function ForbiddenGroupAccessError(message) {
        this.name = 'ForbiddenGroupAccessError';
        this.message = message || "Faculty doesn't have access to the requested Group.";
        this.stack = (new Error()).stack;
    }

    ForbiddenGroupAccessError.prototype = Object.create(Error.prototype);
    ForbiddenGroupAccessError.prototype.constructor = ForbiddenGroupAccessError;

    module.exports.ForbiddenGroupAccessError = ForbiddenGroupAccessError;

    function AllocationNotBelongingToProvidedFacultyError(message) {
        this.name = 'AllocationNotBelongingToProvidedFacultyError';
        this.message = message || "Faculty doesn't have the provided allocation assigned.";
        this.stack = (new Error()).stack;
    }

    AllocationNotBelongingToProvidedFacultyError.prototype = Object.create(Error.prototype);
    AllocationNotBelongingToProvidedFacultyError.prototype.constructor = AllocationNotBelongingToProvidedFacultyError;

    module.exports.AllocationNotBelongingToProvidedFacultyError = AllocationNotBelongingToProvidedFacultyError;

    function LockedUserError(message) {
        this.name = 'LockedUserError';
        this.message = message || "Faculty user is locked.";
        this.stack = (new Error()).stack;
    }

    LockedUserError.prototype = Object.create(Error.prototype);
    LockedUserError.prototype.constructor = LockedUserError;

    module.exports.LockedUserError = LockedUserError;

    function InvalidCredentialsError(message) {
        this.name = 'InvalidCredentialsError';
        this.code = this.name;
        this.message = message || "Invalid username or password.";
        this.stack = (new Error()).stack;
    }

    InvalidCredentialsError.prototype = Object.create(Error.prototype);
    InvalidCredentialsError.prototype.constructor = InvalidCredentialsError;

    module.exports.InvalidCredentialsError = InvalidCredentialsError;

    function InvalidCurrentPasswordError(message) {
        this.name = 'InvalidCurrentPasswordError';
        this.code = this.name;
        this.message = message || "Invalid current password.";
        this.stack = (new Error()).stack;
    }

    InvalidCurrentPasswordError.prototype = Object.create(Error.prototype);
    InvalidCurrentPasswordError.prototype.constructor = InvalidCurrentPasswordError;

    module.exports.InvalidCurrentPasswordError = InvalidCurrentPasswordError;

    function StoredProcedureCallError(message) {
        this.name = 'StoredProcedureCallError';
        this.code = this.name;
        this.message = message || "There was an error while executing Stored Procedure.";
        this.stack = (new Error()).stack;
    }

    StoredProcedureCallError.prototype = Object.create(Error.prototype);
    StoredProcedureCallError.prototype.constructor = StoredProcedureCallError;

    module.exports.StoredProcedureCallError = StoredProcedureCallError;

    function PasswordAndPasswordConfirmationDoesntMatchError(message) {
        this.name = 'PasswordAndPasswordConfirmationDoesntMatchError';
        this.code = this.name;
        this.message = message || "The new password and the password confirmation doesn't match.";
        this.stack = (new Error()).stack;
    }

    PasswordAndPasswordConfirmationDoesntMatchError.prototype = Object.create(Error.prototype);
    PasswordAndPasswordConfirmationDoesntMatchError.prototype.constructor = PasswordAndPasswordConfirmationDoesntMatchError;

    module.exports.PasswordAndPasswordConfirmationDoesntMatchError = PasswordAndPasswordConfirmationDoesntMatchError;
})();