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

before(function () {
    mod.getMasterToken({api: api, expect: expect, it: it}, out);
});

var groups = [];

describe('GET ALL GROUPS', function () {

    it("should GET all registered groups", function (done) {
        api.get('/api/school-groups')
            .set('Authorization', "Bearer " + out.token)
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                groups = res.body.data;
                expect(res.body.data.length).to.not.be.empty;

                groups.forEach(function (group) {
                    var studentsToBeInserted = [];

                    for (var i = 0; i < 15; i++) {
                        var nameGenderPart = data.firstNames[utils.random(0, data.firstNames.length - 1)],
                            firstName = nameGenderPart.name,
                            mothersName = data.mothersNames[utils.random(0, data.mothersNames.length - 1)],
                            lastName = data.lastNames[utils.random(0, data.lastNames.length - 1)];

                        studentsToBeInserted.push({
                            first_name: firstName,
                            last_name: lastName,
                            mothers_name: mothersName,
                            school_group_id: group.id,
                            gender: nameGenderPart.gender
                        });
                    }

                    group.students = studentsToBeInserted;
                });

                done();
                goInsert();
            });
    });
});

function goInsert() {

    groups.forEach(function (group) {
        describe('CREATE STUDENTS FOR GROUP: ' + group.grade_id + group.group_name, function () {
            group.students.forEach(function (student) {
                it("should CREATE student " + student.first_name + " " + student.last_name, function (done) {
                    api.put('/api/students')
                        .set('Content-Type', 'application/json')
                        .set('Authorization', "Bearer " + out.token)
                        .send(student)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            
                            expect(res.body.success).to.equal(true);
                            expect(res.body.error).to.equal(false);

                            done();
                        });
                });
            });
        });
    });

    describe('PUT STUDENTS', function () {
        allocsToBeInserted.forEach(function (row) {

            it("should PUT " + row.allocs.length + " alloc(s) for " + row.faculty.user.username, function (done) {
                var parsedAllocs = [];

                for (var x = 0; x < row.allocs.length; x++) {
                    var tempAlloc = row.allocs[x];
                    parsedAllocs.push({
                        grade_number: tempAlloc.grade.grade_number,
                        subject_id: tempAlloc.subject.id,
                        school_group_id: tempAlloc.school_group.id
                    });
                }

                api.put('/api/allocations/faculty-member/' + row.faculty.id)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', "Bearer " + out.token)
                    .send(parsedAllocs)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

                        expect(res.body.data).to.not.be.empty;
                        expect(res.body.fail).to.be.empty;

                        done();
                    });
            });
        });
    });
};