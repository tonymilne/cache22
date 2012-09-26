# Cache22

Caching for node apps.
Currently supports in memory and redis stores.

The api is based on the memcached protocol, but may be updated as things stabilise.
https://github.com/memcached/memcached/blob/master/doc/protocol.txt

## Getting Started

Install the module with: `npm install cache22`

Require the cache22 module in your application. The module exposes a constructor function that you must instantiate with a store option.

```javascript
var Cache = require('cache22');
```

## Documentation

### Memory store

```javascript
var Cache = require('cache22');
var cache = new Cache({
	store: 'memory'
});
```

### Redis store

```javascript
var redis = require('redis');

var Cache = require('cache22');
var cache = new Cache({
	store: 'redis',
	redis: redis.createConnection(6379, 'localhost')
});
```

### .set(key, value, [options], callback)

Sets a value in cache for the given key.

```javascript
cache.set('name', 'Tony Milne', function(err, results) {
	if (err) throw err;

});
```

### .get(key, callback)

Sets a value in cache for the given key.

```javascript
cache.set('name', 'Tony Milne', function(err, results) {
	if (err) throw err;

	cache.get('name', function(err, value) {
		if (err) throw err;

		console.log('name (from cache): ' + value)
	});
});
```

### .add(key, value, [options], callback)

Adds a value to the cache for the given key only if the key does not already exist.

```javascript
cache.add('name', 'Tony Milne', function(err, results) {
	if (err) throw err;

});
```

### .replace(key, value, [options], callback)

Replaces a value in cache for the given key only if the key already exists.

```javascript
cache.replace('name', 'Tony Milne!!!', function(err, results) {
	if (err) throw err;

});
```

### .del(key, callback)

Deletes a value from the cache for the given key.

```javascript
cache.del('name', function(err, results) {
	if (err) throw err;

});
```

### .append(key, value, callback)

Appends a value to an existing cached value for the given key.

```javascript
cache.set('name', 'Tony', function(err, results) {
	if (err) throw err;

	cache.append('name', ' Milne', function(err, results) {
		if (err) throw err;

	});
});
```

### .prepend(key, value, callback)

Prepends a value to an existing cached value for the given key.

```javascript
cache.set('name', 'Milne', function(err, results) {
	if (err) throw err;

	cache.prepend('name', 'Tony ', function(err, results) {
		if (err) throw err;

	});
});
```

### .incr(key, [value], callback)

Increments the existing value for the given key, by the specified value (defaults to 1 if value is omitted).
Returns the new value for the given key.

```javascript
cache.incr('view-count', function(err, newValue) {
	if (err) throw err;

});
```

### .decr(key, [value], callback)

Decrements the existing value for the given key, by the specified value (defaults to 1 if value is omitted).
Returns the new value for the given key.

```javascript
cache.decr('uses-remaining', function(err, newValue) {
	if (err) throw err;

});
```

### .touch(key, expires, callback)

Updates the expiry for the specified key.

```javascript
var ms = require('ms');
cache.touch('example', ms('10m'), function(err, results) {
	if (err) throw err;

});
```

### .flushAll([delay], callback)

Flushes all key/values from the cache after the specified delay (defaults to 0 seconds if delay is omitted).

```javascript
cache.flushAll(function(err, results) {
	if (err) throw err;

});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Tony Milne
Licensed under the MIT license.