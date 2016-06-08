var constants = require('./constants');

module.exports = function(elName) {
	return document.createElementNS(constants.SVG_NAMESPACE, elName);
};