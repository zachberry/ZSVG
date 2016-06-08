module.exports = function(ns) {
	if(!ns)
	{
		ns = global;
	}

	ns.Stage = require('./stage');
	ns.Shape = require('./shape');
	ns.Circle = require ('./shapes/circle');
	ns.Ellipse = require ('./shapes/ellipse');
	ns.Line = require ('./shapes/line');
	ns.Path = require ('./shapes/path');
	ns.Polygon = require ('./shapes/polygon');
	ns.Polyline = require ('./shapes/polyline');
	ns.Rect = require ('./shapes/rect');
	ns.Image = require ('./shapes/image');
}