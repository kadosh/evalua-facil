var should = require('chai').should,
    expect = require('chai').expect,
    supertest = require('supertest'),
    conf = require('../_config'),
    data = require('../data-for-mockups'),
    mod = require('../modular-parts'),
    utils = require('../utils'),
    api = supertest(conf.host);

var token = "";
var out = {
    token: ''
};

var bimesterNumber = 3;

var groups = [
    {id: 25, grade: 7, name: 'A'},
    {id: 26, grade: 7, name: 'B'},
    {id: 27, grade: 7, name: 'C'},
    {id: 28, grade: 7, name: 'D'},
    {id: 29, grade: 8, name: 'A'},
    {id: 30, grade: 8, name: 'B'},
    {id: 31, grade: 8, name: 'C'},
    {id: 32, grade: 8, name: 'D'},
    {id: 33, grade: 9, name: 'A'},
    {id: 34, grade: 9, name: 'B'},
    {id: 35, grade: 9, name: 'C'},
    {id: 36, grade: 9, name: 'D'}
];

var grades = [7, 8, 9];

var repoSubjects = [
    {abbr: 'ESP', title: 'Español'},
    {abbr: 'MAT', title: 'Matemáticas'},
    {abbr: 'HIS', title: 'Historia'},
    {abbr: 'ING', title: 'Inglés'},
    {abbr: 'FCE', title: 'Formación Socio Cultural'},
    {abbr: 'ART', title: 'Artes'},
    {abbr: 'TEC', title: 'Tecnologías'}
];

var subjectsByGrade = [
];

var subjectCounterId = 43;

for (var i = 0; i < grades.length; i++) {

    var gradeSubjects = [];

    for (var s = 0; s < repoSubjects.length; s++) {
        var row = repoSubjects[s];

        gradeSubjects.push({
            id: subjectCounterId++,
            abbr: row.abbr,
            title: row.title
        });
    }

    subjectsByGrade.push({
        grade: grades[i],
        subjects: gradeSubjects
    });
}

var teachers = data.teachers;
var suffix = data.suffix;

teachers.forEach(function (teacher) {
    teacher.username += suffix;
});


before(function () {

    console.log("aaaaaaaaaaaaa token");
    mod.getMasterToken({api: api, expect: expect, it: it}, out);
});

describe("aaaaaaaaaa", function () {


    it("Should get all students", function (done) {

        api.get('/api/students')
            .set('Authorization', "Bearer " + out.token)
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                expect(res.body.data.length).to.not.be.empty;

                var resultStudents = res.body.data;

                done();

                resultStudents.forEach(function (student) {
                    goProcessStudent(student, student.group.grade_id);
                });
            });
    });
    //it("executed after first two");
});

function randomAbsences() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0);
}

function randomParticipation() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0) / 10;
}

function randomPerformance() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0) / 10;
}

function randomReading() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0) / 10;
}

function randomMath() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0) / 10;
}

function randomFriendship() {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0) / 10;
}

function getSubjects(gradeNumber) {
    for (var i = 0; i < subjectsByGrade.length; i++) {
        if (subjectsByGrade[i].grade == gradeNumber) {
            return subjectsByGrade[i].subjects;
        }
    }
}

function goProcessStudent(student, grade) {

    var gradeSubjects = getSubjects(grade);
    describe('CREATE EVALUATIONS FOR STUDENT :' + student.first_name + " " + student.last_name, function () {

        gradeSubjects.forEach(function (subject) {
            it("should PUT evaluation for student: " + student.first_name + " " + student.last_name + " for " + subject.abbr, function (done) {

                api.put('/api/evaluations/bimester/' + bimesterNumber + '/student/' + student.id)
                    .set('Authorization', "Bearer " + out.token)
                    .send({
                        absences_count: randomAbsences(),
                        participation_score: randomParticipation(),
                        performance_score: randomPerformance(),
                        reading_score: randomReading(),
                        math_score: randomMath(),
                        friendship_score: randomFriendship(),
                        subject_id: subject.id
                    })
                    .expect(200)
                    .end(function (err, res) {

                        if (err) {
                            throw err;
                        }

                        expect(res.body.data).to.not.be.empty;
                        expect(res.body.success).to.be.equals(true)

                        done();
                    });
            });
        });
    });
}
;