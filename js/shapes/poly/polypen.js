var el;
var points;

var PolyPen = function(shape)
{
	this.shape = shape;

	el = this.shape.el;
	points = el.points;
}

PolyPen.prototype = {

	isBlank: function() {
		return points.length === 0;
	},

	clear: function() {
		points.clear();
	},

	lineTo: function(x, y) {
		points.appendItem(this.shape.stage.point(x, y));
		return this;
	},

}

module.exports = PolyPen;