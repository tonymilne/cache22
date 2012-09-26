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

	describe('.incr(key, callback)', function() {
		it('should increment the key by 1 (as a default) and return the new value', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('default increment test', 5, group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					var group = this.group();
					caches.forEach(function(cache) {
						cache.incr('default increment test', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						value.should.equal(6);
					});

					done();
				}
			);
		});
	});

	describe('.incr(key, value, callback)', function() {
		it('should increment the key by the specified value and return the new value', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.set('increment test', 12, group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					var group = this.group();
					caches.forEach(function(cache) {
						cache.incr('increment test', 8, group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						value.should.equal(20);
					});

					done();
				}
			);
		});
	});

});