var createFromEl = require('./createfromel');

var svgEl = require('./createsvgelement')('svg');

var ZVG = function(el) {
	return createFromEl(el);
};

ZVG.point = function(x, y) {
	var p = svgEl.createSVGPoint();
	p.x = isNaN(x) ? 0 : x;
	p.y = isNaN(x) ? 0 : y;

	return p;
};

ZVG.matrix = function(a, b, c, d, e, f) {
	var m = svgEl.createSVGMatrix();
	m.a = isNaN(a) ? 0 : a;
	m.b = isNaN(b) ? 0 : b;
	m.c = isNaN(c) ? 0 : c;
	m.d = isNaN(d) ? 0 : d;
	m.e = isNaN(e) ? 0 : e;
	m.f = isNaN(f) ? 0 : f;

	return m;
};

//@TODO - more?


ZVG.SvgEl = require('./svgel');

ZVG.Stage = require('./stage');

ZVG.Shape = require('./shape');

ZVG.Circle = require ('./shapes/circle');
ZVG.Ellipse = require ('./shapes/ellipse');
ZVG.Group = require ('./shapes/group');
ZVG.Image = require ('./shapes/image');
ZVG.Line = require ('./shapes/line');
ZVG.Path = require ('./shapes/path');
ZVG.Polygon = require ('./shapes/polygon');
ZVG.Polyline = require ('./shapes/polyline');
ZVG.Rect = require ('./shapes/rect');
ZVG.Text = require ('./shapes/text');
ZVG.Tspan = require ('./shapes/tspan');

module.exports = ZVG;