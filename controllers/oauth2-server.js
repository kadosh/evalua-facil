var oauth2orize = require('oauth2orize')
    , passport = require('passport')
    , dbContext = require('../db/models')
    , crypto = require('crypto')
    , bcrypt = require('bcryptjs');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

//Resource owner password
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {

    dbContext.User
		.forge({
			username: username
		})
		.fetch()
		.then(function (user) {
			
			// Compare the passwords
			if(!bcrypt.compareSync(password, user.get('password_hash'))){
				return done(null, false);
			}
			
			var token = uid(256);
			var tokenHash = crypto.createHash('sha1').update(token).digest('hex');
			
			var expirationDate = new Date(new Date().getTime() + (3600 * 1000));
			
			dbContext.AccessToken
				.forge({
					token: tokenHash, 
					issued_timestamp : new Date().getTime() / 1000, 
					client_id: client.get('id'), 
					user_id: user.get('id'),
					expires_timestamp : expirationDate.getTime() / 1000
				})
				.save()
				.then(function(accessToken){
					
					var refreshToken = uid(256);
					var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');
					var expirationDate = new Date(new Date().getTime() + (3600 * 1000)) / 1000;
					
					dbContext.RefreshToken
						.forge({
							refresh_token: refreshTokenHash, 
							client_id: client.get('id'), 
							user_id: user.get('id'),
							expires_timestamp : accessToken.get('expires_timestamp'),
							issued_timestamp : accessToken.get('issued_timestamp'), 
						})
						.save()
						.then(function(refreshTokenModel){
							return done(null, token, refreshToken, { expires_in: expirationDate });
						})
						.catch(function(err){
							return done(err);
						})
				})
				.catch(function(err){
					return done(err);
				});
		})
		.catch(function(err){
			return done(err);
		});
    }));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
	
    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');
	
	dbContext.RefreshToken
		.forge({
			refresh_token : refreshTokenHash
		})
		.fetch()
		.then(function(refreshTokenModel){
			
			// No token found
			if (!refreshTokenModel) {
				return done(null, false);
			}
			
			// Maybe a hack!!!
			if (client.client_id !== refreshTokenModel.client_id){
				return done(null, false);
			}
			
			// Create new access token
			var newAccessToken = uid(256);
			var accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex');
			
			var expirationDate = new Date(new Date().getTime() + (3600 * 1000)) / 1000;
			
			dbContext.AccessToken
				.forge({
					user_id : refreshTokenModel.get('user_id')
				})
				.fetch()
				.then(function(accessToken){
					accessToken
						.save({ 
							token : accessTokenHash,
							issued_timestamp : new Date().getTime() / 1000,
							expires_timestamp : expirationDate
						})
						.then(function(){
							done(null, newAccessToken, refreshToken, { expires_in: expirationDate });
						})
						.catch(function(err){
							return done(err);
						});
				})
				.catch(function(err){
					return done(err);
				});
		})
		.catch(function(err){
			return done(err);
		});
}));

// token endpoint
exports.token = [
    server.token(),
    server.errorHandler()
];

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}