var fs = require('fs');
var path = require('path');

exports.getConfigurationScript = function getConfigurationView() {
	var connectorDirectory = this.filename;
	return fs.readFileSync(path.join(connectorDirectory, 'web/configuration.js'));
};
