var should = require('should');

exports.findOne = {
	// To run this test multiple times (useful when you're caching results), increase this number.
	iterations: 1,
	// TODO: If your connector doesn't support creating records, delete this "insert" object.
	insert: {
		first_name: 'Nolan',
		last_name: 'Wright'
	},
	check: function (result) {
		// TODO: Check your results.
		should(result.id).be.ok;
		should(result.first_name).equal('Nolan');
		should(result.last_name).equal('Wright');
	}
};
