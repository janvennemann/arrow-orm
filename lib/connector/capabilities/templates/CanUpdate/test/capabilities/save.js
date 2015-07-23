var should = require('should');

exports.save = {
	iterations: 1, // To run this test multiple times (useful when you're caching results), increase this number.
	insert: {
		first_name: 'Dawson',
		last_name: 'Toth'
	},
	update: {
		last_name: 'Tooth'
	},
	check: function (result) {
		// TODO: Check your results.
		should(result.id).be.ok;
		should(result.first_name).equal('Dawson');
		should(result.last_name).equal('Tooth');
	}
};
