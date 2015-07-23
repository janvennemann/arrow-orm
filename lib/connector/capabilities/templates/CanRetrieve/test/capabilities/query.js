var should = require('should');

exports.query = {
	// To run this test multiple times (useful when you're caching results), increase this number.
	iterations: 1,
	// TODO: If your connector doesn't support creating records, delete this "insert" object.
	insert: [
		{
			first_name: 'Rick',
			last_name: 'Blalock'
		},
		{
			first_name: 'Nolan',
			last_name: 'Wright'
		}
	],
	query: {
		where: {
			first_name: 'Nolan'
		}
	},
	check: function (results) {
		should(results.length).be.above(0);
		// TODO: Check your results.
		should(results[0].first_name).be.ok;
		should(results[0].last_name).be.ok;
	}
};
