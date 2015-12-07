var should = require('should'),
	async = require('async'),
	assert = require('assert'),
	util = require('util'),
	_ = require('lodash'),
	orm = require('../../');

module.exports = function () {

	describe('#save', function () {
		it('should support changes in array with mutation', function (done) {
			var Connector = new orm.MemoryConnector();

			var User = orm.Model.define('user', {
				fields: {
					array: {type: Array}
				},
				connector: Connector
			});

			var instance = User.instance({array: []});
			should(instance).have.property('array');
			instance.array = [1, 2];
			instance.save(function (err, result) {
				should(err).not.be.ok;
				should(result).be.ok;
				should(result.array).be.eql(instance.array);
				var array = instance.array;
				array.splice(0, 1);
				instance.array = array;
				should(instance.array).be.eql([2]);
				instance.save(function (err, result) {
					should(err).not.be.ok;
					should(result).be.ok;
					should(result.array).be.eql([2]);
					done();
				});
			});
		});
	});

};