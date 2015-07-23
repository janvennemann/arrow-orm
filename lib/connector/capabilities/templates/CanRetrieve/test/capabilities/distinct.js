var should = require('should');

exports.distinct = {
	// To run this test multiple times (useful when you're caching results), increase this number.
	iterations: 1,
	// TODO: If your connector doesn't support creating records, delete this "insert" object.
	insert: [
		{first_name: 'Rick', last_name: 'Blalock'},
		{first_name: 'Jeff', last_name: 'Haynie'},
		{first_name: 'Jeff', last_name: 'Smith'},
		{first_name: 'Jeff', last_name: 'Hyatt'}
	],
	distinct: 'first_name',
	check: function (results) {
		// TODO: Check your results.
		should(results.length).equal(2);
		should(results).containEql('Rick');
		should(results).containEql('Jeff');
	}
};
