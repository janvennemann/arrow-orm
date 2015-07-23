var config = require('../../conf/local').connectors;
config = config[Object.keys(config)[0]];

exports.login = {
	// TODO: Customize all of these values according to your authentication.
	authenticationHeaders: ['username', 'password'],
	sessionHeaders: ['accesstoken'],
	goodAuthentication: {
		username: config.username,
		password: config.password
	},
	badAuthentication: {
		username: 'a-bad-username',
		password: 'a-bad-password'
	}
};
