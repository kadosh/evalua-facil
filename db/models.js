(function () {
    var db = require('./bookshelf');
    var Checkit = require('checkit');
    
    var bookshelf = db.bookshelf;

    module.exports.Bookshelf = bookshelf;
    module.exports.knex = db.knex;

    module.exports.Student = bookshelf.Model.extend({
        tableName: 'students',
        group: function () {
            return this.belongsTo(module.exports.SchoolGroup);
        },
        evaluations: function () {
            return this.hasMany(module.exports.StudentEvaluation);
        }
    });

    module.exports.Evaluation = bookshelf.Model.extend({
        tableName: 'evaluations',
        allocation: function () {
            return this.belongsTo(module.exports.Allocation);
        }
    });

    module.exports.StudentEvaluation = bookshelf.Model.extend({
        tableName: 'student_evaluations',
        subject: function () {
            return this.belongsTo(module.exports.Subject);
        },
        student: function () {
            return this.belongsTo(module.exports.Student);
        },
        details: function () {
            return this.hasMany(module.exports.StudentEvaluationDetail);
        }
    });

    module.exports.StudentEvaluationDetail = bookshelf.Model.extend({
        tableName: 'student_evaluation_details',
        indicator: function () {
            return this.belongsTo(module.exports.Indicator);
        }
    });

    module.exports.Allocation = bookshelf.Model.extend({
        tableName: 'allocations',
        subject: function () {
            return this.belongsTo(module.exports.Subject);
        },
        group: function () {
            return this.belongsTo(module.exports.SchoolGroup);
        }
    });

    module.exports.Bimester = bookshelf.Model.extend({
        tableName: 'bimesters'
    });

    module.exports.User = bookshelf.Model.extend({
        tableName: 'users',
        roles: function () {
            return this.hasMany(UserRole)
        },
        validate: new Checkit({
            username: 'required',
            password_hash: 'required',
            role_id: 'required'
        }),
        facultyMember: function () {
            return this.hasOne(module.exports.FacultyMember);
        },
        initialize: function () {
            // this.on('saving', this.validateSave);
        },
        validateSave: function (a) {
            return this.validate.run(this.attributes)
        },
        role: function () {
            return this.belongsTo(module.exports.Role);
        }
    });

    module.exports.Role = bookshelf.Model.extend({
        tableName: 'roles'
    });

    module.exports.FacultyMember = bookshelf.Model.extend({
        tableName: 'faculty_members',
        allocations: function () {
            return this.hasMany(module.exports.Allocation);
        },
        user: function () {
            return this.belongsTo(module.exports.User);
        },
        createValidation: new Checkit({
            first_name: 'required',
            last_name: 'required',
            title: 'required',
            email: 'email',
            user_id: 'required'
        }),
        updateValidation: new Checkit({
            first_name: 'required',
            last_name: 'required',
            title: 'required',
            email: 'email'
        }),
        initialize: function () {
            this.on('creating', this.validateCreate);
            this.on('updating', this.validateUpdate);
        },
        validateCreate: function () {
            console.log("Runned CREATE");
            return this.createValidation.run(this.attributes);
        },
        validateUpdate: function () {
            console.log("Runned UPDATE");
            return this.updateValidation.run(this.attributes);
        }
    });

    module.exports.Subject = bookshelf.Model.extend({
        tableName: 'subjects',
        allocations: function () {
            return this.hasMany(module.exports.Allocation);
        },
        grade: function () {
            return this.belongsTo(module.exports.Grade);
        }
    });

    module.exports.SchoolGroup = bookshelf.Model.extend({
        tableName: 'school_groups',
        allocations: function () {
            return this.hasMany(module.exports.Allocation);
        },
        students: function () {
            return this.hasMany(module.exports.Student);
        },
        grade: function () {
            return this.belongsTo(module.exports.Grade);
        }
    });

    module.exports.Grade = bookshelf.Model.extend({
        tableName: 'grades',
        schoolGroups: function () {
            return this.hasMany(module.exports.SchoolGroup);
        },
        subjects: function () {
            return this.hasMany(module.exports.Subject);
        }
    });

    module.exports.Revision = bookshelf.Model.extend({
        tableName: 'revisions',
        allocation: function () {
            return this.belongsTo(module.exports.Allocation);
        },
        bimester: function () {
            return this.belongsTo(module.exports.Bimester);
        },
        details: function () {
            return this.hasMany(module.exports.RevisionDetail);
        }
    });

    module.exports.RevisionDetail = bookshelf.Model.extend({
        tableName: 'revision_details'
    });

    module.exports.Indicator = bookshelf.Model.extend({
        tableName: 'indicators'
    });

    module.exports.AltRevision = bookshelf.Model.extend({
        tableName: 'alt_revisions',
        allocation: function () {
            return this.belongsTo(module.exports.Allocation);
        },
        bimester: function () {
            return this.belongsTo(module.exports.Bimester);
        },
        details: function () {
            return this.hasMany(module.exports.AltRevisionDetail);
        }
    });

    module.exports.AltRevisionDetail = bookshelf.Model.extend({
        tableName: 'alt_revision_details'
    });

    module.exports.Client = bookshelf.Model.extend({
        tableName: 'clients'
    });

    module.exports.AccessToken = bookshelf.Model.extend({
        tableName: 'access_tokens',
        user: function () {
            return this.belongsTo(module.exports.User);
        },
        client: function () {
            return this.belongsTo(module.exports.Client);
        }
    });

    module.exports.RefreshToken = bookshelf.Model.extend({
        tableName: 'refresh_tokens',
        user: function () {
            return this.belongsTo(module.exports.User);
        },
        client: function () {
            return this.belongsTo(module.exports.Client);
        }
    });
})();