var should = require('chai').should,
    expect = require('chai').expect,
    supertest = require('supertest'),
    conf = require('../_config'),
    data = require('../data-for-mockups'),
    utils = require('../utils'),
    api = supertest(conf.host);

var token = "";
var authClient = "Basic d2ViY2xpZW50OnBhc3N3b3Jk";
var suffix = String(utils.random(0, 10)) + String(utils.random(0, 10));


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

var teachers = [
    {
        first_name: "Bryan",
        last_name: "Montes",
        gender: "M",
        role_title: "teacher",
        username: "bryan.montes",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "0202020202"
    }, {
        first_name: "Jorge",
        last_name: "Cortés",
        gender: "M",
        role_title: "teacher",
        username: "jorge.cortes",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "03030303"
    }, {
        first_name: "Michel",
        last_name: "Oviedo",
        gender: "M",
        role_title: "teacher",
        username: "michel.oviedo",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "04040404"
    }, {
        first_name: "Alex",
        last_name: "Ocampo",
        gender: "M",
        role_title: "teacher",
        username: "alex.ocampo",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "05050505"
    }, {
        first_name: "Aarón",
        last_name: "Chávez",
        gender: "M",
        role_title: "teacher",
        username: "aaron.chavez",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "060606006"
    }, {
        first_name: "Iliana",
        last_name: "López",
        gender: "F",
        role_title: "teacher",
        username: "iliana.lopez",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "07070707"
    }, {
        first_name: "Hassem",
        last_name: "Hernández",
        gender: "M",
        role_title: "teacher",
        username: "hassem.hdez",
        password: "pass.word1",
        title: "Ing.",
        contact_number: "0808080808"
    }
];

teachers.forEach(function (teacher) {
    teacher.username += suffix;
});

before(function () {
    it('should GET master token', function (done) {
        api.post('/oauth/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', authClient)
            .send({
                username: "master",
                password: "pass.word1",
                grant_type: 'password'
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }

                expect(res.body.access_token).to.be.a('string');
                expect(res.body.refresh_token).to.be.a('string');
                token = res.body.access_token;

                done();
            });
    });
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
                    expect(res.body.faculty_member.first_name).to.be.equal(teacher.first_name);
                    expect(res.body.faculty_member.last_name).to.be.equal(teacher.last_name);
                    expect(res.body.user_data.username).to.be.equal(teacher.username);
                    expect(res.body.user_data.role).to.be.equal(teacher.role_title);
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