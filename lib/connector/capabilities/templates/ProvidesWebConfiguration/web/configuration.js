/* global $, _ */
(function($, _) {
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
		$('#connector-config-form').on('loaded.connector.config', function(e) {
			originalConfig = e.config;

			transformAndPopulateConfig();
		});

		var $configForm = $('#connector-config-form');
		$configForm.submit(function(e) {
			e.preventDefault();

			var editedConfig = transformInput();
			var isValid = validateConfiguration(editedConfig);
			if (isValid) {
				var saveConfigEvent = $.Event('save.connector.config');
				saveConfigEvent.config = editedConfig;
				$configForm.trigger(saveConfigEvent);
			}
		});
	}

	/**
	 * Transforms the config as needed and then populates those values to the form
	 *
	 * THe default behavior is to iterate over all input fields and assign the
	 * config value found for the path defined in their data-property attribute.
	 *
	 * @see populateValue
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
			if (sourceValue) {
				populateValue($input, sourceValue);
			}
		});
	}

	/**
	 * Sets a given config value on the element
	 *
	 * Change this if you need to support more complex form elements
	 *
	 * @param {jQuery} element The elment to set the value on
	 * @param {*} value The value to set
	 */
	function populateValue(element, value) {
		element.val(value);
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
		var $form = $('#connector-config-form');
		var editedConfig = {};

		$form.find('input').each(function(key, input) {
			var $input = $(input);
			var propertyPath = $input.data('property');
			if (!propertyPath) {
				console.log('No property path configured for this input element. Did you forgot to add the "data-property" attribute?');
				return;
			}

			setConfigValue(editedConfig, propertyPath, $input);
		});

		return editedConfig;
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
		return true;
	}
})($, _);
