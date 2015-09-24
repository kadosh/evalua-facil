// elsewhere, to use the bookshelf client:
var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');

(function(){
	exports.getBimesters = function(req, res){
		dbContext.Bimester
			.forge()
			.fetchAll()
			.then(function(bimesters) {
				res.send(bimesters.toJSON());
			}).catch(function(error) {
				res.send('An error occured');
			});
	};

	exports.getBimester = function(req, res) {

		dbContext.Bimester
			.forge( { bimester_number : req.params.bimester_number } )
			.fetch()
			.then(function(bimester){
				res.json(bimester);
			});
	};
	
	exports.putBimester = function(req, res, next){

		dbContext.Bimester
			.forge( { bimester_number : req.body.bimester_number } )
			.fetch()
			.then(function(bimester) {
				
				if (bimester){
					throw new Errors.EntityExistsError("The bimester already exists");
				}
				
				return dbContext.Bimester
					.forge()
					.save({
						bimester_number : req.body.bimester_number,
						start_timestamp : req.body.start_timestamp,
						end_timestamp : req.body.end_timestamp
					})
					.then(function(bimester){
						res.json(bimester);
					});
			})
			.catch(function(error) {
				// Do something with error
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
})();