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

var allocsToBeInserted = [];

describe('GET ALLOCATIONS', function () {

    it("should GET all the available allocations", function (done) {
        api.get('/api/allocations/available')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', "Bearer " + out.token)
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }

                var allocs = res.body;
                expect(res.body.length).to.not.be.empty;

                api.get('/api/faculty-members')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Authorization', "Bearer " + out.token)
                    .expect(200)
                    .end(function (err, res) {

                        expect(res.body.length).to.not.be.empty;

                        var faculties = res.body;
                        var allocRatio = Math.floor(parseInt(allocs.length / faculties.length));

                        expect(allocRatio).to.be.above(0);

                        var current = 0;
                        var facultyCounter = 1;

                        faculties.forEach(function (faculty) {
                            var allocsForFaculty = [];
                            if (facultyCounter == faculties.length) {
                                allocsForFaculty = allocs.slice(current, allocs.length);
                            } else {
                                allocsForFaculty = allocs.slice(current, current + allocRatio);
                            }

                            current += allocRatio;
                            facultyCounter++;

                            allocsToBeInserted.push({
                                faculty: faculty,
                                allocs: allocsForFaculty
                            });
                        });

                        done();
                        goInsert();
                    });
            });
    });
});

function goInsert() {

    describe('PUT ALLOCATIONS', function () {
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
}