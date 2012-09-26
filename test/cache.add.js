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

	describe('.add(key, value, callback)', function() {
		it('should return `constants.STORED` for a key that DOES NOT already exist', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.add('suburb', 'Camberwell', group());
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
						cache.get('suburb', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						value.should.equal('Camberwell');
					});

					done();
				}
			);
		});
	});

	describe('.add(key, value, callback)', function() {
		it('should return `constants.NOT_STORED` for a key that already exists', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('age', '27', group());
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
						cache.add('age', '30', group());
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