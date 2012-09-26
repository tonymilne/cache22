var should = require('should');
var ms = require('ms');
var step = require('step');

var Cache = require('../index');

var redis = require('redis');
var redisCache = new Cache({
	store: 'redis',
	redis: redis.createClient(6379, 'localhost', {

	})
});

var memoryCache = new Cache({
	store: 'memory'
});

var caches = [
	redisCache,
	memoryCache
];

var constants = require('../lib/constants');

describe('Cache', function() {

	before(function(done) {
		caches.forEach(function(cache) {
			cache.flushAll(function() {});
		});
		setTimeout(done, ms('0.5s'));
	});

	describe('.replace(key, value, callback)', function() {
		it('should return `constants.STORED` for a key that already exist', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.add('replacement example', 'Actor', group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					results.forEach(function(result) {
						result.should.equal(constants.STORED);
					});

					var group = this.group();
					caches.forEach(function(cache) {
						cache.replace('replacement example', 'Stunt Double', group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					results.forEach(function(result) {
						result.should.equal(constants.STORED);
					});

					done();
				}
			);
		});
	});

	describe('.replace(key, value, callback)', function() {
		it('should return `constants.NOT_STORED` for a key DOES NOT already exists', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.replace('OMG this key wont exist', 'TROLOLOL', group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					results.forEach(function(result) {
						result.should.equal(constants.NOT_STORED);
					});

					done();
				}
			);
		});
	});

});