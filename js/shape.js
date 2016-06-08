var createSvgEl = require('./createsvgelement');
var SvgEl = require('./svgel');
var extend = require('./util/extend');

var createFromEl = require('./createFromEl');

var Shape = function(shapeNameOrSvgElement, attrs) {
	if(typeof shapeNameOrSvgElement === 'undefined') throw 'No shape name given';

	this.stage = undefined;

	if(typeof shapeNameOrSvgElement === 'string')
	{
		this.el = createSvgEl(shapeNameOrSvgElement);
		this.attr(attrs);
	}
	else
	{
		SvgEl.call(this, shapeNameOrSvgElement);
	}
};

Shape.prototype = Object.create(SvgEl.prototype);

extend(Shape.prototype, {
	clone: function() {
		var cloneNode = this.el.cloneNode(true);

		return createFromEl(cloneNode);
	},

	// children: function() {
	// 	var children = SvgEl.prototype.children.call(this);
	// 	return children.map(function(child) {
	// 		child.stage = this.stage;
	// 		return child;
	// 	});
	// },

	// childAt: function(index) {
	// 	var child = SvgEl.prototype.childAt.call(this, index);
	// 	if(!child) return null;

	// 	child.stage = this.stage;
	// 	return child;
	// },

	getShapeName: function() {
		return this.el.tagName;
	},

	setMatrix: function(matrix) {
		this.el.transform.baseVal.initialize(this.stage.el.createSVGTransformFromMatrix(matrix));

		return this;
	},

	setMatrixValues: function(newValues) {
		var m = this.getLocalTransformMatrix();

		m.a = typeof newValues.a === "undefined" ? m.a : newValues.a;
		m.b = typeof newValues.b === "undefined" ? m.b : newValues.b;
		m.c = typeof newValues.c === "undefined" ? m.c : newValues.c;
		m.d = typeof newValues.d === "undefined" ? m.d : newValues.d;
		m.e = typeof newValues.e === "undefined" ? m.e : newValues.e;
		m.f = typeof newValues.f === "undefined" ? m.f : newValues.f;

		return this.setMatrix(m);
	},

	//@rename to addMatrixValuces or something
	modifyMatrixValues: function(a, b, c, d, e, f) {
		var m = this.getLocalTransformMatrix();

		m.a += a;
		m.b += b;
		m.c += c;
		m.d += d;
		m.e += e;
		m.f += f;

		return this.setMatrix(m);
	},

	multiplyMatix: function(a, b, c, d, e, f) {
		var m = this.getLocalTransformMatrix();

		var result = m.multiply(this.stage.matrix(a, b, c, d, e, f));

		return this.setMatrixValues(result);
	},

	getTransformMatrix: function(toShape) {
		return this.el.getTransformToElement(typeof toShape === 'undefined' || toShape === null ? this.stage.el : toShape.el);
	},

	getLocalTransformMatrix: function() {
		return this.getTransformMatrix(this.parent());
	},

	globalBbox: function() {
		var parent = this.parent();
		return this.bbox(parent === null ? this.stage : parent);
	},

	pxBbox: function(parentShape) {
		var bBox = this.bbox(parentShape);
		var tl = this.stage.svgPointToPxPoint(bBox.x, bBox.y);
		var br = this.stage.svgPointToPxPoint(bBox.x2, bBox.y2);

		return {
			x: tl.x,
			y: tl.y,
			x2: br.x,
			y2: br.y,
			width: br.x - tl.x,
			height: br.y - tl.y
		};
	},

	globalPxBbox: function() {
		var bbox = this.untransformedBbox();
		var m = this.el.getScreenCTM();
		var tl = this.stage.point(bbox.x, bbox.y).matrixTransform(m);
		var br = this.stage.point(bbox.x2, bbox.y2).matrixTransform(m);

		return {
			x: tl.x + window.pageXOffset,
			y: tl.y + window.pageYOffset,
			x2: br.x + window.pageXOffset,
			y2: br.y + window.pageYOffset,
			width: br.x - tl.x,
			height: br.y - tl.y
		};
	},

	parent: function() {
		if(this.el.parentElement === this.stage.el) return this.stage;
		// return this.stage.getShapeByElement(this.el.parentElement);
		var parent = createFromEl(this.el.parentElement);
		parent.stage = this.stage;
		return parent;
	},

	// these two methods assume position is relative to top-left corner
	// override if not the case
	moveTo: function(x, y) {
		return this.setMatrixValues({ e:x, f:y });
	},

	moveCenterTo: function(x, y) {
		var bbox = this.bbox();
		return this.setMatrixValues({ e:x - bbox.width / 2, f:y - bbox.height / 2 });
	},

	// move the element's top left corner to (x,y) in the svg coord space
	moveToOLD: function(x, y) {
		var bBox;

		switch(this.getShapeName())
		{
			case 'circle': // fallthrough
			case 'ellipse':
				bBox = this.bbox();
				x += bBox.width / 2;
				y += bBox.height / 2;
				break;
		}

		this.setMatrixValues({ e:x, f:y });

		return this;
	},

	// move the element's center point to (x, y) in the svg coord space
	moveCenterToOLD: function(x, y) {

		var bBox;

		switch(this.getShapeName())
		{
			case 'rect': // fallthrough
			case 'g':
				bBox = this.bbox();
				x -= bBox.width / 2;
				y -= bBox.height / 2;
				break;
			case 'text':
				bBox = this.bbox();
				x -= bBox.width / 2;
				//y = (y - bBox.height / 2) + bBox.height;
				y += bBox.height / 4;
				break;
		}

		return this.setMatrixValues({ e:x, f:y });
	},

	// Matches this and shape's center points, even if the two shapes
	// are not in the same containing element
	// @TODO - this doesn't seem to work
	alignCenterToShape: function(shape) {
		var targetBBox = shape.globalBbox();
		//var cp = this.getLocalPointFromGlobalPoint(targetBBox.cx, targetBBox.cy);
		// var cp = this.globalSvgPointToLocalSvgPoint(this.stage.point(targetBBox.cx, targetBBox.cy));
		var cp = this.globalSvgPointToLocalSvgPoint(this.stage.point(targetBBox.x, targetBBox.y));

		// return this.moveCenterTo(cp.x, cp.y);
		console.log(cp);
		return this.moveTo(cp.x, cp.y);
	},

	globalSvgPointToLocalSvgPoint: function(globalPoint)
	{
		var bbox = this.bbox();

		return {
			x: globalPoint.x - bbox.x,
			y: globalPoint.y - bbox.y
		};
	},

	localSvgPointToGlobalSvgPoint: function(localPoint)
	{
		//@TODO
		return 0;
	},

	stroke: function(color, width, opacity) {
		var attrs = {};

		if(typeof color !== 'undefined')
		{
			attrs['stroke'] = color;
		}
		if(typeof width !== 'undefined')
		{
			attrs['stroke-width'] = width;
		}
		if(typeof opacity !== 'undefined')
		{
			attrs['stroke-opacity'] = opacity;
		}

		return this.attr(attrs);
	},

	unstroke: function() {
		return this.attr({ 'stroke':'', 'stroke-width':'' });
	},

	fill: function(color, opacity) {
		var attrs = {};

		if(typeof color !== 'undefined')
		{
			attrs['fill'] = color;
		}
		if(typeof opacity !== 'undefined')
		{
			attrs['fill-opacity'] = opacity;
		}

		return this.attr(attrs);
	},

	moveBy: function(dx, dy) {
		var m = this.getLocalTransformMatrix();
		m = m.translate(dx, dy);
		return this.setMatrixValues(m);

		// return { x:dx, y:dy };

	},

	getScaleNonUniform: function() {
		var m;
		var scale;
		var r = this.getRotation();

		this.rotateTo(0);
		m = this.getLocalTransformMatrix();
		scale = { x:m.a, y:m.d };
		this.rotateTo(r);

		return scale;
	},

	getScale: function() {
		var m;
		var scale;
		var r = this.getRotation();

		this.rotateTo(0);
		m = this.getLocalTransformMatrix();
		scale = m.a;
		this.rotateTo(r);

		return scale;
	},

	scaleBy: function(s, x, y) {
		x = typeof x === 'undefined' ? 0 : x;
		y = typeof y === 'undefined' ? 0 : y;

		var m = this.getLocalTransformMatrix()
			.translate(x, y)
			.scale(s)
			.translate(-x, -y);
		return this.setMatrixValues(m);
	},

	scaleByNonUniform: function(sx, sy, x, y) {
		x = typeof x === 'undefined' ? 0 : x;
		y = typeof y === 'undefined' ? 0 : y;

		var m = this.getLocalTransformMatrix()
			.translate(x, y)
			.scaleNonUniform(sx, sy)
			.translate(-x, -y);
		return this.setMatrixValues(m);
	},

	scaleTo: function(s, x, y) {
		var scale = this.getScale();
		if(scale !== 0)
		{
			this.scaleBy(s / scale, x, y);
		}

		return this;
	},

	scaleToNonUniform: function(sx, sy, x, y) {
		var scale = this.getScaleNonUniform();
		if(scale.x !== 0 && scale.y !== 0)
		{
			this.scaleByNonUniform(sx / scale.x, sy / scale.y, x, y);
		}

		return this;
	},

	getRotation: function() {
		var m = this.getLocalTransformMatrix();

		// @TODO: ensure a and b are not both 0
		var angleRadians = Math.atan2(m.c, m.a);

		return angleRadians * 180 / Math.PI;
	},

	rotateTo: function(angle, xRotationPt, yRotationPt) {
		xRotationPt = typeof xRotationPt === 'undefined' ? 0 : xRotationPt;
		yRotationPt = typeof yRotationPt === 'undefined' ? 0 : yRotationPt;

		var angleDegrees = this.getRotation();

		var angleDiff = angle - angleDegrees;

		return this.rotateBy(-angleDiff, xRotationPt, yRotationPt);
	},

	rotateBy: function(angle, xRotationPt, yRotationPt) {
		xRotationPt = typeof xRotationPt === 'undefined' ? 0 : xRotationPt;
		yRotationPt = typeof yRotationPt === 'undefined' ? 0 : yRotationPt;

		var m = this.getLocalTransformMatrix()
			.translate(xRotationPt, yRotationPt)
			.rotate(angle)
			.translate(-xRotationPt, -yRotationPt);
		return this.setMatrixValues(m);
	},

	sendBackward: function() {
		var prevSib = this.el.previousElementSibling;
		if(!prevSib) return this;

		this.el.parentNode.insertBefore(this.el, this.el.previousElementSibling);

		return this;
	},

	sendForward: function() {
		var nextSib = this.el.nextElementSibling;
		if(!nextSib) return this;

		this.el.parentNode.insertBefore(nextSib, this.el);

		return this;
	},

	sendToBack: function() {
		var firstSib = this.el.parentNode.children[0];

		this.el.parentNode.insertBefore(this.el, firstSib);
	},

	sendToFront: function() {
		this.el.parentNode.appendChild(this.el);
		return this;
	}
});

module.exports = Shape;