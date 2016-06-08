window.ZVG = require('./zvg');

// chrome polyfill
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(elem) {
	return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
};



// plugins
require('./plugins/drag');
require('./plugins/simplify');
require('./plugins/multilinetext');