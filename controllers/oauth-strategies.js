var passport = require('passport')
    , BasicStrategy = require('passport-http').BasicStrategy
    , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
    , BearerStrategy = require('passport-http-bearer').Strategy
    , dbContext = require('../db/models')
    , crypto = require('crypto');

/**
 * These strategies are used to authenticate registered OAuth clients.
 * The authentication data may be delivered using the basic authentication scheme (recommended)
 * or the client strategy, which means that the authentication data is in the body of the request.
 */
passport.use("clientBasic", new BasicStrategy(
    function (client_id, client_secret, done) {

        dbContext.Client
            .forge({
                client_id: client_id
            })
            .fetch()
            .then(function (client) {

                if (!client) {
                    return done(null, false);
                } else {
                    if (client.get('client_secret') == client_secret) {
                        return done(null, client);
                    } else {
                        return done(null, false);
                    }
                }
            })
            .catch(function (err) {
                return done(err);
            });
    }
));

passport.use("clientPassword", new ClientPasswordStrategy(
    function (client_id, client_secret, done) {
        dbContext.Client
            .forge({
                client_id: client_id
            })
            .then(function (client) {
                if (!client) {
                    return done(null, false);
                } else {
                    if (client.client_secret == client_secret) {
                        return done(null, client);
                    } else {
                        return done(null, false);
                    }
                }
            })
            .catch(function (err) {
                return done(err);
            });
    }
));

/**
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).
 */
passport.use("accessToken", new BearerStrategy(
    function (accessToken, done) {
        var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex');

        dbContext.AccessToken
            .forge({
                token: accessTokenHash
            })
            .fetch()
            .then(function (accessTokenModel) {

                if (!accessTokenModel) {
                    return done(null, false);
                }

                // This is an expired token,
                // destroy it and block the request
                if ((new Date().getTime() / 1000) > accessTokenModel.get('expires_timestamp')) {
                    accessTokenModel
                        .destroy()
                        .then(function () {
                            return done(null, false);
                        })
                        .catch(function (err) {
                            return done(err);
                        });
                }
                else {
                    dbContext.User
                        .forge({
                            id: accessTokenModel.get('user_id')
                        })
                        .fetch({withRelated: ['facultyMember', 'role']})
                        .then(function (user) {
                            // Here load user profile
                            var info = {scope: '*'};
                            done(null, user, info);
                        })
                        .catch(function (err) {
                            return done(err);
                        });
                }
            })
            .catch(function (err) {
                return done(err);
            });
    }
));

exports.isAuthenticated = passport.authenticate(['local', 'bearer'], {session: false});
exports.isClientAuthenticated = passport.authenticate('clientBasic', {session: false});
exports.isBearerAuthenticated = passport.authenticate('accessToken', {session: false});
exports.checkRole = function (roles) {
    return function (req, res, next) {
        var userRole = req.user.related('role').get('title');

        var success = false;

        if (roles instanceof String || typeof roles == 'string') {
            if (userRole == roles) {
                success = true;
                next();
            }
        }

        if (roles instanceof Array || typeof roles == 'array') {
            if (roles.indexOf(userRole) >= 0) {
                success = true;
                next();
            }
        }

        if (!success) {
            res.status(401).send('Unauthorized to access Evalua-Facil');
        }
    };
};
