/**
 * New node file
 */
exports.index = [ true, // login.ensureLoggedIn(),
server.authorization(function(clientID, redirectURI, done) {
	db.clients.findByClientId(clientID, function(err, client) {
		if (err) {
			return done(err);
		}
		// WARNING: For security purposes, it is highly advisable to check that
		// redirectURI provided by the client matches one registered with
		// the server. For simplicity, this example does not. You have
		// been warned.
		return done(null, client, redirectURI);
	});
}), function(req, res) {
	res.render('dialog', {
		transactionID : req.oauth2.transactionID,
		user : req.user,
		client : req.oauth2.client
	});
} ]