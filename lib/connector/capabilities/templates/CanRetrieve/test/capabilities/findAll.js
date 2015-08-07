var should = require('should');

exports.findAll = {
	// To run this test multiple times (useful when you're caching results), increase this number.
	iterations: 1,
	// TODO: If your connector doesn't support creating records, delete this "insert" object.
	insert: {
		first_name: 'Nolan',
		last_name: 'Wright'
	},
	check: function (results) {
		should(results.length).be.above(0);
		// TODO: Check your results.
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			should(result.id).be.ok;
			should(result.first_name).be.ok;
			should(result.last_name).be.ok;
		}
	}
};
