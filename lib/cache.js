/*!
 * Cache22
 * https://github.com/tonymilne/cache22
 *
 * Copyright (c) 2012 Tony Milne
 * Licensed under the MIT license.
 */

function Cache(options) {
	if (options.store === 'memory') {
		var MemoryStore = require('./stores/memory');
		this._store = new MemoryStore(options);
	}
	else if (options.store === 'redis') {
		var RedisStore = require('./stores/redis');
		this._store = new RedisStore(options);
	}
}

/**
 * set
 * "set" means "store this data".
 */
Cache.prototype.set = function(key, value, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	this._store.set(key, value, options, callback);
};

/**
 * add
 * "add" means "store this data, but only if the server doesn't already
 * hold data for this key".
 */
Cache.prototype.add = function(key, value, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	this._store.add(key, value, options, callback);
};

/**
 * replace
 * "replace" means "store this data, but only if the server *does*
 * already hold data for this key".
 */
Cache.prototype.replace = function(key, value, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	this._store.replace(key, value, options, callback);
};

/**
 * append
 * "append" means "add this data to an existing key after existing data".
 */
Cache.prototype.append = function(key, value, callback) {
	this._store.append(key, value, callback);
};

/**
 * prepend
 * "prepend" means "add this data to an existing key before existing data".
 */
Cache.prototype.prepend = function(key, value, callback) {
	this._store.prepend(key, value, callback);
};

/**
 * cas (check and set)
 */
// MemoryStore.prototype.cas = function() {

// };

/**
 * get
 */
Cache.prototype.get = function(key, callback) {
	this._store.get(key, callback);
};

/**
 * gets
 */
// MemoryStore.prototype.gets = function(key, callback) {

// };

/**
 * del (delete)
 */
Cache.prototype.del = function(key, callback) {
	this._store.del(key, callback);
};

/**
 * incr
 * @return the new value of the item's data, after the operation was executed.
 */
Cache.prototype.incr = function(key, value, callback) {
	if (typeof value === 'function') {
		callback = value;
		value = 1;
	}

	this._store.incr(key, value, callback);
};

/**
 * decr
 * @return the new value of the item's data, after the operation was executed.
 */
Cache.prototype.decr = function(key, value, callback) {
	if (typeof value === 'function') {
		callback = value;
		value = 1;
	}

	this._store.decr(key, value, callback);
};

/**
 * touch
 * The "touch" command is used to update the expiration time of an existing item
 * without fetching it.
 */
Cache.prototype.touch = function(key, time, callback) {
	this._store.touch(key, time, callback);
};

/**
 * flushAll
 */
Cache.prototype.flushAll = function(delay, callback) {
	if (typeof delay === 'function') {
		callback = delay;
		delay = 0;
	}

	this._store.flushAll(delay, callback);
};

/**
 * stats
 */
Cache.prototype.stats = function(callback) {
	this._store.stats(callback);
};

module.exports = Cache;