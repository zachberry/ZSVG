var el;
var list;

var PathPen = function(path)
{
	this.path = path;

	el = this.path.el;
	list = el.pathSegList;

	// appending to pathSegList needs some initial pathSegList to exist,
	// which we do by giving the path a non-undefined d attribute
	if(this.isBlank()) this.clear();
}

PathPen.prototype = {

	isBlank: function() {
		return list.numberOfItems === 0;
	},

	clear: function() {
		list.clear();
	},

	moveTo: function(x, y) {
		list.appendItem(el.createSVGPathSegMovetoAbs(x, y));
		return this;
	},

	moveBy: function(x, y) {
		list.appendItem(el.createSVGPathSegMovetoRel(x, y));
		return this;
	},

	lineTo: function(x, y) {
		if(this.isBlank()) this.moveTo(0, 0);

		list.appendItem(el.createSVGPathSegLinetoAbs(x, y));
		return this;
	},

	lineBy: function(x, y) {
		if(this.isBlank()) this.moveTo(0, 0);

		list.appendItem(el.createSVGPathSegLinetoRel(x, y));
		return this;
	},

	// specifying all arguments will result in a cubic curve
	// specify only first four arguments for quadradic curve
	curveTo: function(x, y, ctrl1x, ctrl1y, ctrl2x, ctrl2y) {
		var segItem;

		if(this.isBlank()) this.moveTo(0, 0);

		if(ctrl2x && ctrl2y)
		{
			segItem = el.createSVGPathSegCurvetoCubicAbs(x, y, ctrl1x, ctrl1y, ctrl2x, ctrl2y);
		}
		else
		{
			segItem = el.createSVGPathSegCurvetoQuadraticAbs(x, y, ctrl1x, ctrl1y);
		}

		list.appendItem(segItem);
		return this;
	},

	// specifying all arguments will result in a cubic curve
	// specify only first four arguments for quadradic curve
	curveBy: function(x, y, ctrl1x, ctrl1y, ctrl2x, ctrl2y) {
		var segItem;

		if(this.isBlank()) this.moveTo(0, 0);

		if(ctrl2x && ctrl2y)
		{
			segItem = el.createSVGPathSegCurvetoCubicRel(x, y, ctrl1x, ctrl1y, ctrl2x, ctrl2y);
		}
		else
		{
			segItem = el.createSVGPathSegCurvetoQuadraticRel(x, y, ctrl1x, ctrl1y);
		}

		list.appendItem(segItem);
		return this;
	},

	// specifying all arguments will resuilt in a cubic curve
	// specify only first two arguments for quadradic curve
	smoothCurveTo: function(x, y, ctrl2x, ctrl2y) {
		var segItem;

		if(this.isBlank()) this.moveTo(0, 0);

		if(ctrl2x && ctrl2y)
		{
			segItem = el.createSVGPathSegCurvetoCubicSmoothAbs(x, y, ctrl2x, ctrl2y);
		}
		else
		{
			segItem = el.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y);
		}

		list.appendItem(segItem);
		return this;
	},

	// specifying all arguments will resuilt in a cubic curve
	// specify only first two arguments for quadradic curve
	smoothCurveBy: function(x, y, ctrl2x, ctrl2y) {
		var segItem;

		if(this.isBlank()) this.moveTo(0, 0);

		if(ctrl2x && ctrl2y)
		{
			segItem = el.createSVGPathSegCurvetoCubicSmoothRel(x, y, ctrl2x, ctrl2y);
		}
		else
		{
			segItem = el.createSVGPathSegCurvetoQuadraticSmoothRel(x, y);
		}

		list.appendItem(segItem);
		return this;
	},

	arcTo: function(x, y, r1, r2, angle, drawLargestArc, drawClockwise) {
		if(this.isBlank()) this.moveTo(0, 0);

		list.appendItem(el.createSVGPathSegArcAbs(x, y, r1, r2, angle, drawLargestArc, drawClockwise));
		return this;
	},

	arcBy: function(x, y, r1, r2, angle, drawLargestArc, drawClockwise) {
		if(this.isBlank()) this.moveTo(0, 0);

		list.appendItem(el.createSVGPathSegArcRel(x, y, r1, r2, angle, drawLargestArc, drawClockwise));
		return this;
	},

	close: function() {
		list.appendItem(el.createSVGPathSegClosePath());
		return this;
	}
}

module.exports = PathPen;