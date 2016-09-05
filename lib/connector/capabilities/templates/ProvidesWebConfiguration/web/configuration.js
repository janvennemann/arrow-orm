/* global $, _, APPC_SESSION */
(function($, _) {
	var configurationManager = new ConfigurationManager();
	/**
	 * Holds the name of the connector the currently selected config file belongs to
	 */
	var selectedConnectorName;
	/**
	 * Holds the filename of the currently selected config file
	 */
	var selectedConfigFilename;
	/**
	 * Stores the orignal config from the config file. Used leter to merge
	 * the the edited config back.
	 */
	var originalConfig;
	/**
	 * Stores the actual config that is active after arrow merges the different
	 * config files. Used to detect if a value is coming directly from the currently
	 * selected config file or is inherited from another
	 */
	var activeConfig;

	registerEventListener();

	/**
	 * Registers the event listeners for when the user selects a config file
	 * to edit and when he finally presses the save button
	 *
	 * If your form needs to listen to more events you can reigster them here.
	 */
	function registerEventListener() {
		$('#connector-config-form').on('selected.connector.config', function(e) {
			selectedConnectorName = e.connector;

			loadConfiguration(e.filename, function(err, config) {
				if (err) {
					// TODO: Handle error
					console.log(err);
					selectedConnectorName = null;
					return;
				}

				selectedConfigFilename = e.filename;
				originalConfig = config;
				// FIXME: Evaluate if we need this
				activeConfig = {};

				transformAndPopulateConfig();
			});
		});

		$('#connector-config-form').submit(function(e) {
			e.preventDefault();

			alert('Oops, we are still working on that!');

			var editedConfig = transformInput();
			validateConfiguration(editedConfig);
			var mergedConfig = mergeConfiguration(originalConfig, editedConfig);
			saveConfiguration(mergedConfig);
		});
	}

	/**
	 * Loads the configuration file
	 *
	 * @param {Event} e Event that is fired upon selecting a config file in the nav
	 */
	function loadConfiguration(filename, callback) {
		configurationManager.loadConfiguration(filename, function (err, config) {
			if (err) {
				return callback(err);
			}

			callback(null, config);
		});
	}

	/**
	 * Transforms the config as needed and then populates those values to the form
	 *
	 * THe default behavior is to iterate over all input fields and assign the
	 * config value found for the path defined in their data-property attribute.
	 * We also check the currently active config to detected if there is an
	 * inherited value and display a note.
	 *
	 * @see populateValue
	 * @see showInheritedValueNote
	 */
	function transformAndPopulateConfig() {
		var $form = $('#connector-config-form');
		$form.find('input').each(function(key, input) {
			var $input = $(input);
			var propertyPath = $input.data('property');
			if (!propertyPath) {
				return;
			}

			var sourceValue = _.get(originalConfig, propertyPath);
			var actualValue = _.get(activeConfig, propertyPath);
			if (sourceValue) {
				populateValue($input, sourceValue);
			}
			if (actualValue !== sourceValue) {
				showInheritedValueNote($input, actualValue);
			}
		});
	}

	/**
	 * Sets a given config value on the element
	 *
	 * Change this if you need to support more complex form elements
	 *
	 * @param {jQuery} element The elment to set the value on
	 * @param {mixed} value The value to set
	 */
	function populateValue(element, value) {
		element.val(value);
	}

	/**
	 * Shows a note to inform the user that this element
	 *
	 * @return {[type]} [description]
	 */
	function showInheritedValueNote(element, value) {
		// TODO: show note
	}

	/**
	 * Transforms the value of a form element back to its config representation.
	 *
	 * The default is to iterate over all input fields and assign their value to
	 * the property path in the config.
	 *
	 * @see setConfigValue
	 */
	function transformInput() {
		var $form = $('#connector-form');
		var editedConfig = {};

		$form.find('input').each(function(input) {
			var propertyPath = input.data('property');
			if (!propertyPath) {
				return;
			}

			setConfigValue(editedConfig, propertyPath, input);
		});
	}

	/**
	 * Sets a value in the the config from a given form element.
	 *
	 * You can change this to upport more complex elements.
	 *
	 * @param {[type]} propertyPath [description]
	 * @param {[type]} element [description]
	 */
	function setConfigValue(config, propertyPath, element) {
		_.set(config, propertyPath, element.val());
	}

	/**
	 * Validates the given config object
	 *
	 * You can implement your client side validation logic here.
	 *
	 * @param {[type]} configuration The config object
	 * @return {boolean}
	 */
	function validateConfiguration(configuration) {

	}

	/**
	 * Merges the updated configuration with the old one
	 *
	 * We need to do this since not all available settings for a connector are
	 * neccessarily editable in the form. To save the config as a whole we merge
	 * everything back together.
	 *
	 * @param {Object} existingConfiguration The complete original configuration as read from the config file
	 * @param {Object} updatedConfiguration Edited configuration from the form elements
	 * @return {[Object} The merged config object
	 */
	function mergeConfiguration(existingConfiguration, updatedConfiguration) {
		return _.extend(existingConfiguration, updatedConfiguration);
	}

	/**
	 * Saves configuration back to the file
	 */
	function saveConfiguration(config) {
		configurationManager.saveConfiguration(config, selectedConfigFilename, function(err) {
			if (err) {

			}


		});
	}

	function ConfigurationManager() {
		var user = APPC_SESSION && APPC_SESSION.valid && APPC_SESSION.user || {};
		this.authQueryString = 'org_id=' + user.org_id + '&user_id=' + user.user_id + '&username=' + user.username;
	}

	ConfigurationManager.prototype.loadConfiguration = function(filename, callback) {
		$.get(this.createEndpointUrl(filename))
			.done(function(data) {
				callback(null, data);
			})
			.fail(function(xhr) {
				callback(new Error('Failed to load configuration file from server.'));
			});
	};

	ConfigurationManager.prototype.saveConfiguration = function(config, filename, callback) {
		$.post(this.createEndpointUrl(filename), config)
			.done(function() {
				callback();
			})
			.fail(function() {
				callback(new Error('Failed to save configuration file.'));
			});
	};

	ConfigurationManager.prototype.createEndpointUrl = function (filename) {
		var configEndpoint = 'connectors/' + selectedConnectorName + '/config';
		return configEndpoint + '?f=' + filename + '&' + this.authQueryString;
	};
})($, _);
