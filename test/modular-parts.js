(function () {
    var utils = require('./utils');
    var authClient = "Basic d2ViY2xpZW50OnBhc3N3b3Jk";
    
    module.exports.getMasterToken = function (tApi, settings) {

        tApi.it('should GET master token', function (done) {

            tApi.api.post('/oauth/token')
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

                    tApi.expect(res.body.access_token).to.be.a('string');
                    tApi.expect(res.body.refresh_token).to.be.a('string');
                    settings.token = res.body.access_token;
                    done();
                });
        });
    };
})();
