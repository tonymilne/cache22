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

	describe('.prepend(key, value, callback)', function() {
		it('should prepend the value to the existing cached value', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.add('prepend-test', 'def', group());
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
						cache.prepend('prepend-test', 'abc', group());
					});
				},
				function(err, results) {
					if (err) {
						return done(err);
					}

					var group = this.group();
					caches.forEach(function(cache) {
						cache.get('prepend-test', group());
					});
				},
				function(err, values) {
					if (err) {
						return done(err);
					}

					values.forEach(function(value) {
						value.should.equal('abcdef');
					});

					done();
				}
			);
		});
	});

	describe('.prepend(key, value, callback)', function() {
		it('should error trying to prepend to a non string value', function(done) {
			step(
				function() {
					var group = this.group();
					caches.forEach(function(cache) {
						cache.add('prepend string to int', 42, group());
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
						cache.append('prepend string to int', 'a string', group());
					});
				},
				function(err, results) {
					should.exist(err);

					done();
				}
			);
		});
	});

});