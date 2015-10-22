var dbContext = require('../db/models');
var Errors = require('../utils/custom-errors');
var repos = require('../db/repositories');

(function(){
	var that;
	
	var RevisionsHandler = function () {
		that = this;
		that.revisionRepository = new repos.RevisionRepository();
		that.allocationRepository = new repos.AllocationRepository();
		that.bimesterRepository = new repos.BimesterRepository();
		that.altRevisionRepository = new repos.AltRevisionRepository();
	};
	
	RevisionsHandler.prototype.getOne = function (req, res){

		var revisionPromise = that.revisionRepository.findById(req.params.revision_id);
			
		return revisionPromise.then(function(revision){
				if (!revision){
					throw new Errors.NotFoundEntity();
				}
				
				res.json(revision);
		})
		.catch(function(error){
			res.status(500).json({
				error : true,
				data : {
					message : error.message
				}
			});
		});
	};
	
	RevisionsHandler.prototype.put = function (req, res){

		var revisionRequest = {
			created_date : req.body.created_date,
			origin_platform : req.body.origin_platform,
			is_finished : req.body.is_finished,
			finished_date : req.body.finished_date,
			last_change_date : req.body.last_change_date,
			allocation_id : req.body.allocation_id,
			is_in_conflict : req.body.is_in_conflict,
			bimester_number : req.body.bimester_number
		};
			
		// Validate Bimester
		return that.bimesterRepository
			.findByNumber(revisionRequest.bimester_number)
			.then(function(bimester){
				if (!bimester){
					throw new Errors.NotFoundEntity("The bimester number was not found");
				}
				
				// Validate Trimester
				return that.allocationRepository
					.findById(revisionRequest.allocation_id)
					.then(function(allocation){
						if (!allocation){
							throw new Errors.NotFoundEntity("The allocation was not found");
						}
						
						// Start checking info about the revision
						return that.revisionRepository
							.findByAllocationId(revisionRequest.allocation_id)
							.then(function(revision){
								
								if (!revision){
									// This is the easy path... we just save the data
									// TODO: Apply some validations, by now be happy
									return that.revisionRepository
										.insert(revisionRequest)
										.then(function(result){
											return res.json(result);
										});
								} else {
									
									// Problems start here
									// 1. If the revision is found, check if it is in conflict
									//    This means we have to reject the request since we already have
									//    a conflict revision and a normal one
									if (revision.get('is_in_conflict')){
										throw new Errors.RevisionIsDone();
									}
									
									// No conflict, then create the conflict and mark the revision
									return that.altRevisionRepository
										.insert(revisionRequest)
										.then(function(result){
											
											revision.save({
												is_in_conflict : 1
											})
											.then(function(){
												return res.json(result);
											});
										});
								}
							})
					});
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	RevisionsHandler.prototype.update = function (req, res){

		return that.revisionRepository
			.findById(req.params.revision_id)
			.then(function(result){
				
			})
		
		var revisionRequest = {
			created_date : req.body.created_date,
			origin_platform : req.body.origin_platform,
			is_finished : req.body.is_finished,
			finished_date : req.body.finished_date,
			last_change_date : req.body.last_change_date,
			allocation_id : req.body.allocation_id,
			is_in_conflict : req.body.is_in_conflict,
			bimester_number : req.body.bimester_number,
			indicators : req.body.allocations
		};
			
		// Validate Bimester
		return that.bimesterRepository
			.findByNumber(revisionRequest.bimester_number)
			.then(function(bimester){
				if (!bimester){
					throw new Errors.NotFoundEntity("The bimester number was not found");
				}
				
				// Validate Trimester
				return that.allocationRepository
					.findById(revisionRequest.allocation_id)
					.then(function(allocation){
						if (!allocation){
							throw new Errors.NotFoundEntity("The allocation was not found");
						}
						
						// Start checking info about the revision
						return that.revisionRepository
							.findByAllocationId(revisionRequest.allocation_id)
							.then(function(revision){
								
								if (!revision){
									// This is the easy path... we just save the data
									// TODO: Apply some validations, by now be happy
									return that.revisionRepository
										.insert(revisionRequest)
										.then(function(result){
											return res.json(result);
										});
								} else {
									
									// Problems start here
									// 1. If the revision is found, check if it is in conflict
									//    This means we have to reject the request since we already have
									//    a conflict revision and a normal one
									if (revision.get('is_in_conflict')){
										throw new Errors.RevisionIsDone();
									}
									
									// No conflict, then create the conflict and mark the revision
									return that.altRevisionRepository
										.insert(revisionRequest)
										.then(function(result){
											
											revision.save({
												is_in_conflict : 1
											})
											.then(function(){
												return res.json(result);
											});
										});
								}
							})
					});
			})
			.catch(function(error){
				res.status(500).json({
					error : true,
					data : {
						message : error.message
					}
				});
			});
	};
	
	var handler = new RevisionsHandler();
	
	module.exports.getOne = handler.getOne;
	module.exports.put = handler.put;
	// module.exports.getTest = handler.get;
})();