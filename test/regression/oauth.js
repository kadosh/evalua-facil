var should = require('chai').should,
    expect = require('chai').expect,
    supertest = require('supertest'),
    conf = require('../_config'),
    api = supertest(conf.host);

var token = "";
var authClient = "Basic d2ViY2xpZW50OnBhc3N3b3Jk";

var userCredentials = {
    username: "alex.40",
    password: "pass.word1"
};


describe('OAUTH', function () {
    it('should GET master token', function (done) {
        api.post('/oauth/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', authClient)
            .send({
                username: userCredentials.username,
                password: userCredentials.password,
                grant_type: 'password'
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.access_token).to.be.a('string');
                expect(res.body.refresh_token).to.be.a('string');
                token = res.body.access_token;
                
                done();
            });
    });
});

module.exports = "";

function Student() {
    var studentIdToFind = 0;

    describe('Student', function () {
        it('should not found the student id: ' + studentIdToFind, function (done) {
            api.get('/api/students/' + studentIdToFind)
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + token)
                .expect(404, done);
        });

        it('should not create a new student', function (done) {
            api.put('/api/students/')
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + token)
                .send({
                    first_name: 'Alex',
                    last_name: 'Ocampo',
                    mothers_name: 'Salazar'
                })
                .expect(400)
                .end(function (err, res) {
                    //console.log(res.body.form_errors["first_name"]);
                    expect(res.body.form_errors).to.not.be.empty;
                    expect(res.body.form_errors).to.be.instanceof(Object);
                    done();
                });
        });
    });
}