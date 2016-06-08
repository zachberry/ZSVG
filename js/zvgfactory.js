var createFromElFn = require('./createFromEl');

var ZVGFactory = {
	createFromEl: function(el) {
		return createFromElFn(el);
	},

	// clone: function(svgElInstance) {
	// 	var cloneNode = svgElInstance.el.cloneNode(true);

	// 	return createFromElFn(ZVG, cloneNode);
	// },
};

module.exports = ZVGFactory;