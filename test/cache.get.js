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

	describe('.get(key, callback)', function() {
		it('should return the value for a key that was previously cached', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('animal', 'Aardvark', group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					var group = this.group();
					caches.forEach(function(cache) {
						cache.get('animal', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						value.should.equal('Aardvark');
					});

					done();
				}
			);
		});
	});

	describe('.get(key, callback)', function() {
		it('should return the value for a key that was previously cached', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.get('a key without a cached value', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						should.not.exist(value);
					});

					done();
				}
			);
		});
	});

	// @NOTE: This test is a replica of the cache.set test for expires option.
	// @TODO: Work out where it should live...
	describe('.get(key, callback)', function() {
		it('should return null for a key that has since expired (and the key/value should be removed)', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('favourite food', 'Chicken Parma', { expires: ms('1s') }, group());
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
						cache.get('favourite food', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					// Wait for the cache expiration before moving to the next step.
					var _this = this;
					setTimeout(function() {
						_this();
					}, ms('2s'));
				},
				function(err) {
					if (err) {
						return done(err);
					}

					var group = this.group();
					caches.forEach(function(cache) {
						cache.get('favourite food', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						should.not.exist(value);
					});

					done();
				}
			);
		});
	});

});