var Shape = require('../shape');
var PolyPen = require('./poly/polypen');

var Polyline = function(attrs)
{
	Shape.call(this, 'polyline', attrs);
	this.pen = new PolyPen(this);
}
Polyline.prototype = Object.create(Shape.prototype);

module.exports = Polyline;