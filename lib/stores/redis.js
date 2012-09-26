/**
 * Redis Store.
 */

var step = require('step');
var constants = require('../constants');

function RedisStore(options) {
	var store = this;

	// Establish a connection to redis.
	// @TODO: Support establishing a new connection via host, port, credentials.
	if (typeof options.redis !== 'undefined') {
		store._redis = options.redis;
	}

	store._namespace = options.namespace || 'cache22:';

}

/**
 * noCallback
 * No Op (No Operation) function.
 */
function noCallback() {}

/**
 * set
 */
RedisStore.prototype.set = function(key, value, options, callback) {
	var store = this;

	step(
		function() {
			if (typeof options.expires !== 'undefined') {
				var milliseconds = options.expires;
				var seconds = Math.ceil(milliseconds / 1000);

				store._redis.setex(store.ns(key), seconds, value, this);
			}
			else {
				store._redis.set(store.ns(key), value, this);
			}
		},
		function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, constants.STORED);
		}
	);
};

/**
 * add
 */
RedisStore.prototype.add = function(key, value, options, callback) {
	var store = this;

	store._redis.setnx(store.ns(key), value, function(err, result) {
		if (err) {
			return callback(err);
		}

		if (typeof options.expires !== 'undefined') {
			var milliseconds = options.expires;
			var seconds = Math.ceil(milliseconds / 1000);

			store.touch(key, seconds, noCallback);
		}

		callback(null, result ? constants.STORED : constants.NOT_STORED);
	});
};

/**
 * replace
 */
RedisStore.prototype.replace = function(key, value, options, callback) {
	var store = this;

	// @NOTE: This implementation suffers from potential race conditions between multiple redis clients.

	store._redis.exists(store.ns(key), function(err, exists) {
		if (err) {
			return callback(err);
		}
		if (!exists) {
			return callback(null, constants.NOT_STORED);
		}

		store.set(key, value, options, callback);
	});
};

/**
 * append
 */
RedisStore.prototype.append = function(key, value, callback) {
	var store = this;

	store._redis.append(store.ns(key), value, function(err, length) {
		if (err) {
			return callback(err);
		}

		callback(null, constants.STORED);
	});
};

/**
 * prepend
 */
RedisStore.prototype.prepend = function(key, value, callback) {
	var store = this;

	// @NOTE: This implementation suffers from potential race conditions between multiple redis clients.

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}
		store.set(key, value + existingValue, {}, callback);
	});
};

/**
 * cas (check and set)
 */
RedisStore.prototype.cas = function() {
	var store = this;

};

/**
 * get
 */
RedisStore.prototype.get = function(key, callback) {
	var store = this;

	store._redis.get(store.ns(key), callback);
};

/**
 * gets
 */
RedisStore.prototype.gets = function(key, callback) {
	var store = this;

};

/**
 * del (delete)
 */
RedisStore.prototype.del = function(key, callback) {
	var store = this;

	store._redis.del(store.ns(key), function(err, count) {
		callback(err, count === 1 ? constants.DELETED : constants.NOT_FOUND);
	});
};

/**
 * incr
 */
RedisStore.prototype.incr = function(key, value, callback) {
	var store = this;

	store._redis.incrby(store.ns(key), value, callback);
};

/**
 * decr
 */
RedisStore.prototype.decr = function(key, value, callback) {
	var store = this;

	store._redis.decrby(store.ns(key), value, callback);
};

/**
 * touch
 * The "touch" command is used to update the expiration time of an existing item
 * without fetching it.
 */
RedisStore.prototype.touch = function(key, expires, callback) {
	var store = this;

	var milliseconds = expires;
	var seconds = Math.ceil(milliseconds / 1000);

	store._redis.expire(store.ns(key), seconds, callback);
};

/**
 * flushAll
 */
RedisStore.prototype.flushAll = function(delay, callback) {
	var store = this;

	setTimeout(function() {
		// Find keys beginning with the `store._namespace`.
		store._redis.keys(store._namespace + '*', function(err, keys) {
			store._redis.del(keys, noCallback);
		});
	}, delay);

	callback();
};

/**
 * stats
 */
RedisStore.prototype.stats = function(callback) {
	var store = this;

	// Count keys beginning with the `store._namespace`.
	store._redis.keys(store._namespace + '*', function(err, keys) {
		if (err) {
			return callback(err);
		}

		callback(null, {
			count: keys.length
		});
	});
};

/**
 * ns
 * namespace the passed key with our redis store's namespace.
 */
RedisStore.prototype.ns = function(key) {
	var store = this;

	return store._namespace + key;
};

module.exports = RedisStore;