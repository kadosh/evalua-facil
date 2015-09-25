(function(){
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
})();