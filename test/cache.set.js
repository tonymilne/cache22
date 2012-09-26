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

	describe('.set(key, value, callback)', function() {
		it('should store a value against a key and return `constants.STORED`', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('name', 'Tony Milne', group());
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

	describe('.set(key, value, options, callback)', function() {
		it('should add an expiry time if an expires option exists', function(done) {
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