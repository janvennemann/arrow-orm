var should = require('should');

exports.create = {
	iterations: 1, // To run this test multiple times (useful when you're caching results), increase this number.
	insert: {
		first_name: 'Nolan',
		last_name: 'Wright'
	},
	check: function (result) {
		// TODO: Check your results.
		should(result.first_name).be.ok;
		should(result.last_name).be.ok;
	}
};
