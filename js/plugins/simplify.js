var simplifyFn = require('./vendor/simplify');
var Polyline = require('../shapes/polyline');
var Polygon = require('../shapes/polygon');

var simplify = function(tolerance, highestQuality) {
	var newPoints = simplifyFn(this.el.points, tolerance, highestQuality);

	this.pen.clear();
	newPoints.map((function(newPoint) {
		this.pen.lineTo(newPoint.x, newPoint.y);
	}).bind(this));
}

Polyline.prototype.simplify = simplify;
Polygon.prototype.simplify = simplify;