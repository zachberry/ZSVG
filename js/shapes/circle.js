var Shape = require('../shape');
var Ellipse = require('./ellipse');

var Circle = function(attrs)
{
	Shape.call(this, 'circle', attrs);
}
Circle.prototype = Object.create(Ellipse.prototype);

module.exports = Circle;