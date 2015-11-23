var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');

(function () {

    /**
     * Bimester Repository
     *
     */
    var that;
    var BimesterRepository = function () {
        that = this;
    };

    BimesterRepository.prototype.getAll = function (query, options) {
        options = options || {};

        return dbContext.Bimester
            .query(query)
            .fetchAll(options);
    };

    BimesterRepository.prototype.getOne = function (query, options) {
        options = options || {};

        return dbContext.Bimester
            .forge(query)
            .fetch(options);
    };

    BimesterRepository.prototype.getCurrent = function (date) {
        return dbContext.Bimester
            .query(function (qb) {
                qb.where('start_timestamp', '<=', date).andWhere('end_timestamp', '>=', date);
            })
            .fetch();
    };

    BimesterRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Bimester
            .forge({
                id: data.id
            })
            .save({
                start_timestamp: data.start_timestamp,
                end_timestamp: data.end_timestamp
            }, saveOptions);
    };

    module.exports.BimesterRepository = BimesterRepository;
})();

(function () {
    /**
     * Student Repository
     *
     */
    var that;
    var StudentRepository = function () {
        that = this;
    };

    StudentRepository.prototype.getAll = function (query, options) {
        options = options || {};

        return dbContext.Student
            .query(query)
            .fetchAll(options);
    };

    StudentRepository.prototype.queryAll = function (query, options) {
        options = options || {};

        return dbContext.Student
            .query(query)
            .fetchAll(options);
    };

    StudentRepository.prototype.getAllByGroupId = function (school_group_id) {

        return dbContext.Student
            .query({where: {school_group_id: school_group_id}})
            .fetchAll({withRelated: ['group']});
    };

    StudentRepository.prototype.findById = function (student_id) {
        return dbContext.Student
            .forge({id: student_id})
            .fetch();
    };

    StudentRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Student
            .forge({
                first_name: data.first_name,
                last_name: data.last_name,
                mothers_name: data.mothers_name,
                school_group_id: data.school_group_id,
                gender: data.gender
            })
            .save(null, saveOptions);
    };

    StudentRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Student
            .forge({
                id: data.student_id
            })
            .save({
                first_name: data.first_name,
                last_name: data.last_name,
                mothers_name: data.mothers_name,
                gender: data.gender
            }, saveOptions);
    };

    StudentRepository.prototype.delete = function (student_id, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.Student
            .forge({id: student_id})
            .destroy(deleteOptions);
    };

    module.exports.StudentRepository = StudentRepository;
})();

(function () {

    /**
     * Student Evaluation Repository
     *
     */
    var that;
    var StudentEvaluationRepository = function () {
        that = this;
    };

    StudentEvaluationRepository.prototype.getOne = function (query, options) {
        options = options || {};

        return dbContext.StudentEvaluation
            .forge(query)
            .fetch(options);
    };

    StudentEvaluationRepository.prototype.getFinishedByStudent = function (student_id, bimester_number, options) {
        options = options || {};

        return dbContext.StudentEvaluation
            .query(function (q) {
                q.distinct()
                    .where('student_id', '=', student_id)
                    .andWhere('bimester_number', '=', bimester_number)
                    .andWhere('is_finished', '=', 1);

                return q;
            })
            .fetchAll(options);
    };

    StudentEvaluationRepository.prototype.getAllByStudent = function (student_id, bimester_number, options) {
        options = options || {};

        return dbContext.StudentEvaluation
            .query(function (q) {
                q.distinct()
                    .where('student_id', '=', student_id)
                    .andWhere('bimester_number', '=', bimester_number);

                return q;
            })
            .fetchAll(options);
    };

    StudentEvaluationRepository.prototype.insert = function (data) {
        return dbContext.StudentEvaluation
            .forge()
            .save({
                bimester_number: data.bimester_number,
                subject_id: data.subject_id,
                created_timestamp: data.created_timestamp,
                last_change_timestamp: data.last_change_timestamp,
                is_in_conflict: data.is_in_conflict,
                student_id: data.student_id,
                is_finished: data.is_finished,
                finished_timestamp: data.finished_timestamp
            });
    };

    StudentEvaluationRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.StudentEvaluation
            .forge({
                id: data.id
            })
            .save({
                last_change_timestamp: data.last_change_timestamp,
                is_in_conflict: data.is_in_conflict,
                is_finished: data.is_finished,
                finished_timestamp: data.finished_timestamp
            }, saveOptions);
    };

    module.exports.StudentEvaluationRepository = StudentEvaluationRepository;
})();

(function () {

    /**
     * Evaluation Repository
     *
     */
    var that;
    var EvaluationRepository = function () {
        that = this;
    };

    EvaluationRepository.prototype.getOne = function (query, options) {
        options = options || {};

        return dbContext.Evaluation
            .forge(query)
            .fetch(options);
    };

    EvaluationRepository.prototype.getMissingByGroupAndSubjects = function (query, options) {
        options = options || {};

        return dbContext.Evaluation
            .query(function (q) {
                q.distinct()
                    .innerJoin('grades', function () {
                        this.on('school_groups.grade_id', '=', 'grades.id')
                            .andOn('grades.grade_number', '=', grade_number)
                    })
                    .where('school_groups.group_name', name);

                return q;
            })
            .fetch(options);
    };

    EvaluationRepository.prototype.getMissingByGroupAndSubject = function (query, options) {
        options = options || {};

        return dbContext.Evaluation
            .query(function (q) {
                q.whereNotIn()
                q.distinct()
                    .innerJoin('grades', function () {
                        this.on('school_groups.grade_id', '=', 'grades.id')
                            .andOn('grades.grade_number', '=', grade_number)
                    })
                    .where('school_groups.group_name', name);

                return q;
            })
            .fetch(options);
    };

    module.exports.EvaluationRepository = EvaluationRepository;
})();

(function () {

    /**
     * Grade Repository
     *
     */
    var that;
    var GradeRepository = function () {
        that = this;
    };

    GradeRepository.prototype.findByNumber = function (grade_number) {
        return dbContext.Grade
            .forge({grade_number: grade_number})
            .fetch();
    };

    GradeRepository.prototype.findById = function (grade_id) {
        return dbContext.Grade
            .forge({id: grade_id})
            .fetch();
    };

    GradeRepository.prototype.getAll = function () {
        return dbContext.Grade
            .forge()
            .fetchAll();
    };

    GradeRepository.prototype.insert = function (data) {
        return dbContext.Grade
            .forge()
            .save({
                title: data.title,
                grade_number: data.grade_number
            });
    };

    GradeRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Grade
            .forge({
                id: data.grade_id
            })
            .save({
                title: data.title
            }, saveOptions);
    };

    module.exports.GradeRepository = GradeRepository;
})();

(function () {
    /**
     * School Group Repository
     *
     */
    var that;
    var GroupRepository = function () {
        that = this;
    };

    GroupRepository.prototype.findById = function (group_id) {
        return dbContext.SchoolGroup
            .forge({id: group_id})
            .fetch();
    };

    GroupRepository.prototype.getOne = function (query, options) {
        options = options || {};

        return dbContext.SchoolGroup
            .forge(query)
            .fetch(options);
    };

    GroupRepository.prototype.getAll = function (query, options) {
        options = options || {};
        return dbContext.SchoolGroup
            .forge(query)
            .fetchAll(options);
    };

    GroupRepository.prototype.getByGradeNumberAndName = function (grade_number, name) {
        return dbContext.SchoolGroup
            .query(function (q) {
                q.distinct()
                    .innerJoin('grades', function () {
                        this.on('school_groups.grade_id', '=', 'grades.id')
                            .andOn('grades.grade_number', '=', grade_number)
                    })
                    .where('school_groups.group_name', name);

                return q;
            })
            .fetch();
    };

    GroupRepository.prototype.getByGradeIdAndName = function (grade_id, name) {
        return dbContext.SchoolGroup
            .forge({grade_id: grade_id, group_name: name})
            .fetch();
    };

    GroupRepository.prototype.findByGradeNumber = function (grade_number, options) {
        options = options || {};
        return dbContext.SchoolGroup
            .query(function (q) {
                q.distinct()
                    .innerJoin('grades', function () {
                        this.on('school_groups.grade_id', '=', 'grades.id')
                            .andOn('grades.grade_number', '=', grade_number)
                    });

                return q;
            })
            .fetchAll(options);
    };

    GroupRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.SchoolGroup
            .forge({
                grade_id: data.grade_id,
                group_name: data.group_name,
                total_students: data.total_students
            })
            .save(null, saveOptions);
    };

    GroupRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.SchoolGroup
            .forge({
                id: data.group_id
            })
            .save({
                group_name: data.group_name
            }, saveOptions);
    };

    GroupRepository.prototype.delete = function (id, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.SchoolGroup
            .forge({
                id: id
            })
            .destroy();
    };

    module.exports.GroupRepository = GroupRepository;
})();

(function () {
    /**
     * Revision Repository
     *
     */
    var that;
    var RevisionRepository = function () {
        that = this;
    };

    RevisionRepository.prototype.findById = function (revision_id) {
        return dbContext.Revision
            .forge({id: revision_id})
            .fetch({withRelated: ['bimester', 'allocation', 'details']});
    };

    RevisionRepository.prototype.findByAllocationId = function (allocation_id) {
        return dbContext.Revision
            .forge({allocation_id: allocation_id})
            .fetch({withRelated: ['bimester', 'allocation', 'details']});
    };

    RevisionRepository.prototype.insert = function (revision) {
        return dbContext.Bookshelf.transaction(function (t) {
            return dbContext.Revision
                .forge()
                .save({
                    created_date: revision.created_date,
                    origin_platform: revision.origin_platform,
                    is_finished: revision.is_finished,
                    finished_date: revision.finished_date,
                    last_changed_date: revision.last_changed_date,
                    allocation_id: revision.allocation_id,
                    is_in_conflict: revision.is_in_conflict,
                    bimester_number: revision.bimester_number
                }, {transacting: t})
                .then(function (insertedRevision) {
                    var indicators = revision.indicators;

                    return Promise.map(indicators, function (indicator) {
                        return dbContext.RevisionDetail
                            .forge()
                            .save({
                                revision_id: insertedRevision.get('id'),
                                indicator_id: indicator.indicator_id,
                                input_value: indicator.input_value
                            }, {transacting: t});
                    });

                });
        });
    };

    module.exports.RevisionRepository = RevisionRepository;
})();

(function () {
    /**
     * Allocation Repository
     *
     */
    var that;
    var AllocationRepository = function () {
        that = this;
    };

    AllocationRepository.prototype.findById = function (allocation_id) {
        return dbContext.Allocation
            .forge({id: allocation_id})
            .fetch({withRelated: ['group', 'subject']});
    };

    AllocationRepository.prototype.getOne = function (query, options) {
        options = options || {};
        return dbContext.Allocation
            .forge(query)
            .fetch(options);
    };

    AllocationRepository.prototype.getAll = function (query, options) {
        options = options || {};
        return dbContext.Allocation
            .query(query)
            .fetchAll(options);
    };

    AllocationRepository.prototype.forFaculty = function (query, options) {
        options = options || {};
        return dbContext.Allocation
            .query(query)
            .fetchAll(options);
    };

    AllocationRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Allocation
            .forge({
                school_group_id: data.school_group_id,
                subject_id: data.subject_id,
                faculty_member_id: data.faculty_member_id
            })
            .save(null, saveOptions);
    };

    AllocationRepository.prototype.delete = function (query, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.Allocation
            .forge(query)
            .destroy();
    };

    AllocationRepository.prototype.deleteById = function (id, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.Allocation
            .forge({id: id})
            .destroy();
    };

    module.exports.AllocationRepository = AllocationRepository;
})();

(function () {
    /**
     * Subject Repository
     *
     */
    var that;
    var SubjectRepository = function () {
        that = this;
    };

    SubjectRepository.prototype.getAll = function (query, options) {
        options = options || {};

        return dbContext.Subject
            .query(query)
            .fetchAll(options);
    };

    SubjectRepository.prototype.getAllByGradeId = function (grade_id) {

        return dbContext.Subject
            .query(function (q) {
                q.where('grade_id', '=', grade_id);
                return q;
            })
            .fetchAll();
    };

    SubjectRepository.prototype.findById = function (subject_id) {
        return dbContext.Subject
            .forge({id: subject_id})
            .fetch();
    };

    SubjectRepository.prototype.getByGradeNumberAndTitle = function (grade_number, title) {
        return dbContext.Subject
            .query(function (q) {
                q.distinct()
                    .innerJoin('grades', function () {
                        this.on('subjects.grade_id', '=', 'grades.id')
                            .andOn('grades.grade_number', '=', grade_number)
                    })
                    .where('subjects.title', title);

                return q;
            })
            .fetch();
    };

    SubjectRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.Subject
            .forge({
                grade_id: data.grade_id,
                title: data.title,
                abbreviation: data.abbreviation
            })
            .save(null, saveOptions);
    };

    SubjectRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};

        return dbContext.Subject
            .forge({
                id: data.subject_id
            })
            .save({
                title: data.title
            }, saveOptions);
    };

    module.exports.SubjectRepository = SubjectRepository;
})();

(function () {
    /**
     * Revision Repository
     *
     */
    var that;
    var AltRevisionRepository = function () {
        that = this;
    };

    AltRevisionRepository.prototype.findById = function (alt_revision_id) {
        return dbContext.AltRevision
            .forge({id: alt_revision_id})
            .fetch({withRelated: ['bimester', 'allocation']});
    };

    AltRevisionRepository.prototype.findByAllocationId = function (allocation_id) {
        return dbContext.AltRevision
            .forge({allocation_id: allocation_id})
            .fetch({withRelated: ['bimester', 'allocation']});
    };

    AltRevisionRepository.prototype.insert = function (revision) {
        return dbContext.bookshelf.Bookshelf.transaction(function (t) {
            return dbContext.AltRevision
                .forge()
                .save({
                    created_date: revision.created_date,
                    origin_platform: revision.origin_platform,
                    is_finished: revision.is_finished,
                    finished_date: revision.finished_date,
                    last_changed_date: revision.last_changed_date,
                    allocation_id: revision.allocation_id,
                    bimester_number: revision.bimester_number
                }, {transacting: t})
                .then(function (insertedRevision) {
                    var indicators = revision.indicators;

                    return Promise.map(indicators, function (indicator) {
                        return dbContext.AltRevisionDetail
                            .forge()
                            .save({
                                revision_id: insertedRevision.get('id'),
                                indicator_id: indicator.indicator_id,
                                input_value: indicator.input_value
                            }, {transacting: t});
                    });

                });
        });
    };

    module.exports.AltRevisionRepository = AltRevisionRepository;
})();

(function () {
    /**
     * Faculty Member Repository
     *
     */
    var that;
    var FacultyMemberRepository = function () {
        that = this;
    };

    FacultyMemberRepository.prototype.getOne = function (query, options) {
        options = options || {};
        return dbContext.FacultyMember
            .forge(query)
            .fetch(options);
    };

    FacultyMemberRepository.prototype.getMany = function (query, options) {
        options = options || {};
        return dbContext.FacultyMember
            .forge(query)
            .fetchAll(options);
    };

    FacultyMemberRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.FacultyMember
            .forge({
                first_name: data.first_name,
                last_name: data.last_name,
                title: data.title,
                email: data.email,
                contact_number: data.contact_number,
                user_id: data.user_id
            })
            .save(null, saveOptions);
    };

    FacultyMemberRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.FacultyMember
            .forge({
                id: data.faculty_member_id
            })
            .save({
                first_name: data.first_name,
                last_name: data.last_name,
                title: data.title,
                contact_number: data.contact_number,
                email: data.email
            }, saveOptions);
    };

    FacultyMemberRepository.prototype.delete = function (id, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.FacultyMember
            .forge({
                id: id
            })
            .destroy();
    };

    module.exports.FacultyMemberRepository = FacultyMemberRepository;
})();

(function () {
    /**
     * User Repository
     *
     */
    var that;
    var UserRepository = function () {
        that = this;
    };

    UserRepository.prototype.findByUserName = function (username) {
        return dbContext.User
            .forge({username: username})
            .fetch({withRelated: ['role']});
    };

    UserRepository.prototype.lockUser = function (user_id) {

        return dbContext.User
            .forge({
                id: user_id
            })
            .save({
                is_locked: 1
            });
    };

    UserRepository.prototype.unlockUser = function (user_id) {

        return dbContext.User
            .forge({
                id: user_id
            })
            .save({
                is_locked: 0
            });
    };

    UserRepository.prototype.insert = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.User
            .forge()
            .save({
                username: data.username,
                password_hash: data.password_hash,
                role_id: data.role_id
            }, saveOptions);
    };

    UserRepository.prototype.update = function (id, password_hash, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.User
            .forge({id: id})
            .save({
                password_hash: password_hash
            }, saveOptions);
    };

    UserRepository.prototype.delete = function (id, deleteOptions) {
        deleteOptions = deleteOptions || {};
        return dbContext.User
            .forge({id: id})
            .destroy();
    };

    module.exports.UserRepository = UserRepository;
})();

(function () {
    /**
     * Role Repository
     *
     */
    var that;
    var RoleRepository = function () {
        that = this;
    };

    RoleRepository.prototype.findByName = function (roleName) {
        return dbContext.Role
            .forge({
                title: roleName
            })
            .fetch();
    };

    RoleRepository.prototype.insert = function (data, options) {
        return dbContext.User
            .forge({
                username: data.username,
                password_hash: data.password_hash,
                role_id: data.role_id
            })
            .save(null, {transacting: options.transacting})
    }

    module.exports.RoleRepository = RoleRepository;
})();

(function () {

    /**
     * Student Evaluation Detail Repository
     *
     */
    var that;
    var StudentEvaluationDetailRepository = function () {
        that = this;
    };

    StudentEvaluationDetailRepository.prototype.getOne = function (query, options) {
        options = options || {};

        return dbContext.StudentEvaluationDetail
            .forge(query)
            .fetch(options);
    };

    StudentEvaluationDetailRepository.prototype.insert = function (data) {
        return dbContext.StudentEvaluationDetail
            .forge()
            .save({
                student_evaluation_id: data.student_evaluation_id,
                indicator_id: data.indicator_id,
                input_value: data.input_value
            });
    };

    StudentEvaluationDetailRepository.prototype.update = function (data, saveOptions) {
        saveOptions = saveOptions || {};
        return dbContext.StudentEvaluationDetail
            .forge({
                id: data.id
            })
            .save({
                input_value: data.input_value
            }, saveOptions);
    };

    module.exports.StudentEvaluationDetailRepository = StudentEvaluationDetailRepository;
})();