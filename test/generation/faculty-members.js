var should = require('chai').should,
    expect = require('chai').expect,
    supertest = require('supertest'),
    conf = require('../_config'),
    mod = require('../modular-parts'),
    data = require('../data-for-mockups'),
    utils = require('../utils'),
    api = supertest(conf.host);

var token = "";
var authClient = "Basic d2ViY2xpZW50OnBhc3N3b3Jk";
var suffix = data.suffix;


var director = {
    first_name: "Mario",
    last_name: "Cárdenas",
    gender: "M",
    role_title: "director",
    username: "mario.cardenas" + suffix,
    password: "pass.word1",
    title: "Ing.",
    contact_number: "1010101010"
};

var teachers = data.teachers;

teachers.forEach(function (teacher) {
    teacher.username += suffix;
});

before(function () {
    mod.getMasterToken({api: api, expect: expect, it: it}, out);
});

describe('FACULTY MEMBERS - Director', function () {
    it('should CREATE the director ' + director.username + ":" + director.password, function (done) {
        api.put('/api/faculty-members')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', "Bearer " + token)
            .send(director)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.faculty_member.first_name).to.be.equal(director.first_name);
                expect(res.body.faculty_member.last_name).to.be.equal(director.last_name);
                expect(res.body.user_data.username).to.be.equal(director.username);
                expect(res.body.user_data.role).to.be.equal(director.role_title);
                done();
            });
    });
});

describe('FACULTY MEMBERS - Teachers', function () {

    teachers.forEach(function (teacher) {
        it('should CREATE the teacher ' + teacher.username + ":" + teacher.password, function (done) {
            api.put('/api/faculty-members')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', "Bearer " + token)
                .send(teacher)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body.data.faculty_member.first_name).to.be.equal(teacher.first_name);
                    expect(res.body.data.faculty_member.last_name).to.be.equal(teacher.last_name);
                    expect(res.body.data.user_data.username).to.be.equal(teacher.username);
                    expect(res.body.data.user_data.role).to.be.equal(teacher.role_title);
                    done();
                });
        });
    });
});

/*describe('FACULTY MEMBERS - Teachers', function () {
 
 var realCounter = 0;
 for (var i = 0; i < numberToGenerate; i++) {
 
 it('should CREATE a new teacher', function (done) {
 var nameGenderPart = data.firstNames[utils.random(0, data.firstNames.length - 1)],
 firstName = nameGenderPart.name,
 mothersName = data.mothersNames[utils.random(0, data.mothersNames.length - 1)],
 lastName = data.lastNames[utils.random(0, data.lastNames.length - 1)];
 
 var username = userPrefix + firstName.toLowerCase().replace(/ /g, '') + realCounter,
 password = passwordPrefix + realCounter++;
 
 console.log(username, ":", password);
 
 api.put('/api/faculty-members')
 .set('Content-Type', 'application/x-www-form-urlencoded')
 .set('Authorization', "Bearer " + token)
 .send({
 first_name: firstName,
 last_name: lastName,
 title: "Lic.",
 email: username + "@evalua.edu.mx",
 username: username,
 password: password,
 role_title: "teacher",
 contact_number: "000000000"
 })
 .expect(200)
 .end(function (err, res) {
 expect(res.body.faculty_member.first_name).to.be.equal(firstName);
 expect(res.body.faculty_member.last_name).to.be.equal(lastName);
 console.log()
 done();
 });
 });
 }
 });*/