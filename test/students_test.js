var should = require('chai').should,
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

var token = "";
var authClient = "Basic d2ViY2xpZW50OnBhc3N3b3Jk";


describe('Authentication', function () {
    it('should return a valid access token', function (done) {

        api.post('/oauth/token')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', authClient)
            .send({
                username: 'alex.40',
                password: 'pass.word1',
                grant_type: 'password'
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.access_token).to.be.a('string');
                expect(res.body.refresh_token).to.be.a('string');

                token = res.body.access_token;

                done();
                Student();
            });
    });
});

function Student() {
    describe('Student', function () {
        it('should return a 404 response', function (done) {

            api.get('/api/students/0')
                .set('Accept', 'application/json')
                .set('Authorization', "Bearer " + token)
                .expect(404, done);
        });
    });
}