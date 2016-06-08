var Shape = require('../shape');
var PolyPen = require('./poly/polypen');

var Polygon = function(attrs)
{
	Shape.call(this, 'polygon', attrs);
	this.pen = new PolyPen(this);
}
Polygon.prototype = Object.create(Shape.prototype);

module.exports = Polygon;