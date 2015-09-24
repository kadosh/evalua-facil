var bookshelf = require('./bookshelf');
var Checkit = require('checkit');

(function() {
	
	module.exports.Allocation = bookshelf.Model.extend({
		tableName : 'allocations',
		subject : function(){
			return this.belongsTo(module.exports.Subject);
		},
		group : function(){
			return this.belongsTo(module.exports.SchoolGroup);
		}
	});
	
	module.exports.Bimester = bookshelf.Model.extend({
		tableName : 'bimesters'
	});
	
	module.exports.User = bookshelf.Model.extend({
		tableName : 'users',
		roles : function() {
			return this.hasMany(UserRole)
		},
		validate : new Checkit({
			username : 'required',
			password_hash : 'required',
			role_id : 'required'
		}),
		initialize : function() {
			this.on('saving', this.validateSave);
		},
		validateSave : function(a) {
			return this.validate.run(this.attributes)
		},
		role : function() {
			return this.belongsTo(module.exports.Role);
		}
	// messages : function() {
	// return this.hasMany(Posts);
	// }
	});

	module.exports.Role = bookshelf.Model.extend({
		tableName : 'roles'
	});

	module.exports.FacultyMember = bookshelf.Model.extend({
		tableName : 'faculty_members',
		allocations : function() {
			return this.hasMany(module.exports.Allocation);
		},
		user : function() {
			return this.belongsTo(module.exports.User);
		},
		validate : new Checkit({
			first_name : 'required',
			last_name : 'required',
			title : 'required',
			email : 'email',
			user_id : 'required'
		}),
		initialize : function() {
			this.on('saving', this.validateSave);
		},
		validateSave : function() {
			return this.validate.run(this.attributes);
		}
	});

	module.exports.Subject = bookshelf.Model.extend({
		tableName : 'subjects',
		allocations : function() {
			return this.hasMany(module.exports.Allocation);
		},
		grade : function(){
			return this.belongsTo(module.exports.Grade);
		}
	});

	module.exports.SchoolGroup = bookshelf.Model.extend({
		tableName : 'school_groups',
		allocations : function() {
			return this.hasMany(module.exports.Allocation);
		},
		grade : function(){
			return this.belongsTo(module.exports.Grade);
		},
		validate : new Checkit({
			group_name : 'required',
			grade_id : 'required',
			total_students : 'required'
		}),
		initialize : function() {
			this.on('saving', this.validateSave);
		},
		validateSave : function() {
			return this.validate.run(this.attributes);
		}
	});

	module.exports.Grade = bookshelf.Model.extend({
		tableName : 'grades',
		schoolGroups : function() {
			return this.hasMany(module.exports.SchoolGroup);
		},
		subjects : function() {
			return this.hasMany(module.exports.Subject);
		}
	});

	module.exports.Revision = bookshelf.Model.extend({
		tableName : 'revisions',
		details : function() {
			return this.hasMany(module.exports.RevisionDetail);
		}
	});

	module.exports.RevisionDetail = bookshelf.Model.extend({
		tableName : 'revision_details'
	});

	module.exports.Indicator = bookshelf.Model.extend({
		tableName : 'indicators'
	});

	module.exports.IndicatorCategory = bookshelf.Model.extend({
		tableName : 'indicator_categories',
		indicators : function() {
			return this.hasMany(module.exports.Indicator);
		}
	});

	module.exports.AltRevision = bookshelf.Model.extend({
		tableName : 'alt_revisions',
		details : function() {
			return this.hasMany(AltRevisionDetail);
		}
	});

	module.exports.AltRevisionDetail = bookshelf.Model.extend({
		tableName : 'alt_revision_details'
	});
	
	module.exports.Client = bookshelf.Model.extend({
		tableName : 'clients'
	});
	
	module.exports.AccessToken = bookshelf.Model.extend({
		tableName : 'access_tokens',
		user : function(){
			return this.belongsTo(module.exports.User);
		},
		client : function(){
			return this.belongsTo(module.exports.Client);
		}
	});
	
	module.exports.RefreshToken = bookshelf.Model.extend({
		tableName : 'refresh_tokens',
		user : function(){
			return this.belongsTo(module.exports.User);
		},
		client : function(){
			return this.belongsTo(module.exports.Client);
		}
	});
})();