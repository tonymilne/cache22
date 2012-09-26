/**
 * Memory Store.
 */

var constants = require('../constants');

function MemoryStore(options) {
	var store = this;

	store._cache = {};
	store._meta = {};
}

function noopFn() {}

/**
 * set
 * "set" means "store this data".
 */
MemoryStore.prototype.set = function(key, value, options, callback) {
	var store = this;

	store._cache[key] = value;

	// @TODO: Refactor the option handling into something more re-usable.
	if (typeof options.expires !== 'undefined') {
		var expires = options.expires;
		// @TODO: Check typeof expires.
		store._meta[key] = {
			created: +(new Date()),
			expires: expires
		};
	}

	callback(null, constants.STORED);
};

/**
 * add
 * "add" means "store this data, but only if the server doesn't already
 * hold data for this key".
 */
MemoryStore.prototype.add = function(key, value, options, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		// @TODO: Ensure that this evaluates true/false appropriately.
		if (existingValue !== null && typeof existingValue !== 'undefined') {
			return callback(null, constants.NOT_STORED);
		}

		store.set(key, value, options, callback);
	});
};

/**
 * replace
 * "replace" means "store this data, but only if the server *does*
 * already hold data for this key".
 */
MemoryStore.prototype.replace = function(key, value, options, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}

		if (existingValue === null || typeof existingValue === 'undefined') {
			return callback(null, constants.NOT_STORED);
		}

		store.set(key, value, options, callback);
	});
};

/**
 * append
 * "append" means "add this data to an existing key after existing data".
 */
MemoryStore.prototype.append = function(key, value, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}

		if (typeof existingValue !== 'string') {
			return callback(new Error('Cache.append can only be used to append a string to an existing string value'));
		}

		store.set(key, existingValue + value, {}, callback);
	});
};

/**
 * prepend
 * "prepend" means "add this data to an existing key before existing data".
 */
MemoryStore.prototype.prepend = function(key, value, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}

		if (typeof existingValue !== 'string') {
			return callback(new Error('Cache.append can only be used to append a string to an existing string value'));
		}

		store.set(key, value + existingValue, {}, callback);
	});
};

/**
 * cas (check and set)
 */
// MemoryStore.prototype.cas = function() {

// };

/**
 * get
 */
MemoryStore.prototype.get = function(key, callback) {
	var store = this;

	if (typeof store._meta[key] !== 'undefined') {
		if (typeof store._meta[key].expires !== 'undefined') {
			var created = store._meta[key].created;
			var delta = +(new Date()) - created;
			if (delta > store._meta[key].expires) {
				store.del(key, noopFn);
				return callback(null, null);
			}
		}
	}

	return callback(null, this._cache[key]);
};

/**
 * gets
 */
// MemoryStore.prototype.gets = function(key, callback) {

// };

/**
 * del (delete)
 */
MemoryStore.prototype.del = function(key, callback) {
	var store = this;

	var deleted = (typeof store._cache[key] !== 'undefined');

	delete store._cache[key];
	delete store._meta[key];

	callback(null, deleted ? constants.DELETED : constants.NOT_FOUND);
};

/**
 * incr
 */
MemoryStore.prototype.incr = function(key, value, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}

		var newValue = existingValue + value;
		store.set(key, newValue, {}, function(err, results) {
			if (err) {
				return callback(err);
			}

			callback(null, newValue);
		});
	});
};

/**
 * decr
 */
MemoryStore.prototype.decr = function(key, value, callback) {
	var store = this;

	store.get(key, function(err, existingValue) {
		if (err) {
			return callback(err);
		}

		var newValue = existingValue - value;
		store.set(key, newValue, {}, function(err, results) {
			if (err) {
				return callback(err);
			}

			callback(null, newValue);
		});
	});
};

/**
 * touch
 * The "touch" command is used to update the expiration time of an existing item
 * without fetching it.
 */
MemoryStore.prototype.touch = function(key, expires, callback) {
	var store = this;

	store._meta[key] = {
		created: +(new Date()),
		expires: expires
	};

	callback(null);
};

/**
 * flushAll
 */
MemoryStore.prototype.flushAll = function(delay, callback) {
	var store = this;

	setTimeout(function() {
		store._cache = {};
		store._meta = {};
	}, delay);

	callback();
};

module.exports = MemoryStore;