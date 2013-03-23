/*global module*/

var fs   = require('fs');
var path = require('path');

var extend = require('extend');
var mkdirp = require('mkdirp');

function JSONBrain(config) {
	this.config = {
		directory: './brain/'
	};

	this.config = extend(true, this.config, config);

	// If we're using a relative directory path, expand it
	if (this.config.directory.indexOf('/') !== 0) {
		this.config.directory = path.resolve(__dirname + '/../../' + this.config.directory);
	}

	var self = this;
	fs.exists(this.config.directory, function(exists) {
		if ( ! exists) {
			mkdirp(self.config.directory);
		}
	});

	this.data = {};
}

module.exports = JSONBrain;

JSONBrain.prototype.wake = function wake(callback) {
	if (typeof callback === 'function') {
		callback();
	}
};

JSONBrain.prototype.sleep = function sleep(callback) {
	if (typeof callback === 'function') {
		callback();
	}
};

JSONBrain.prototype.remember = function remember(key, data, callback) {
	this.data[key] = data;
	this.save(key, function() {
		if (typeof callback === 'function') {
			callback();
		}
	});
};

JSONBrain.prototype.recall = function recall(key, callback) {
	var self = this;

	var data;
	if ( ! this.data[key]) {
		this.load(key, function() {
			if (self.data[key]) {
				data = self.data[key];
			}

			if (typeof callback === 'function') {
				callback(data);
			}
		});
	}
};

JSONBrain.prototype.forget = function forget(key, callback) {
	if (this.data[key]) {
		delete this.data[key];
	}

	this.save(key, function() {
		if (typeof callback === 'function') {
			callback();
		}
	});
};

JSONBrain.prototype.save = function save(key, callback) {
	console.log(this.config.directory + '/' + key + '.json');
	fs.writeFile(this.config.directory + '/' + key + '.json', JSON.stringify(this.data[key]), 'utf8', function() {
		if (typeof callback === 'function') {
			callback();
		}
	});
};

JSONBrain.prototype.load = function load(key, callback) {
	var self = this;

	fs.readFile(this.config.directory + '/' + key + '.json', 'utf8', function(error, data) {
		try {
			self.data[key] = JSON.parse(data);
		}
		catch (e) {

		}

		if (typeof callback === 'function') {
			callback();
		}
	});
};

