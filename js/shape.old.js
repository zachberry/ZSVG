var createSvgEl = require('./createsvgelement');
var applyAttrs = require('./applyattributes');

var Shape = function(shapeNameOrSvgElement, attrs, innerText) {
	if(typeof shapeNameOrSvgElement === 'undefined') throw 'No shape name given';

	this.stage = undefined;

	//////ZSVG.EventManager.decorate(this);

	if(typeof shapeNameOrSvgElement === 'string')
	{
		createSvgEl(shapeNameOrSvgElement, attrs, innerText);
		this.el = createSvgEl(shapeNameOrSvgElement);
		this.attr(attrs);
		this.setText(innerText);
	}
	else
	{
		this.el = shapeNameOrSvgElement;
	}

	//this.init();

	// Define some "class-level" properties:

	//Shape.EVENT_CHANGE = 'change';
};

// Object.defineProperties(Shape.prototype, {
// 	"bbox": {
// 		get: function() {

// 		}
// 	}
// })

Shape.prototype = {
	SVG_NAMESPACE: "http://www.w3.org/2000/svg",

	// initFns: [],

	// init: function() {
	// 	for(var i = 0, len = this.initFns.length; i < len; i++)
	// 	{

	// 	}
	// },

	clone: function() {
		var cloneNode = this.el.cloneNode(true);

		return this.stage.createShape(cloneNode);
	},

	getShapeName: function() {
		return this.el.tagName;
	},

	setText: function(text) {
		if(typeof text !== "undefined") this.el.textContent = text;

		return this;
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

	// return the svg bounding box (which excludes transforms)
	untransformedBbox: function() {
		// IE doesn't allow us to modify the actual bounding box, so we'll copy it
		// to get around this.
		var bbox = this.el.getBBox();

		return {
			x: bbox.x,
			y: bbox.y,
			x2: bbox.x + bbox.width,
			y2: bbox.y + bbox.height,
			cx: bbox.x + (bbox.width / 2),
			cy: bbox.y + (bbox.height / 2),
			width: bbox.width,
			height: bbox.height
		};
	},

	// Determine bounding box, after transforms
	// Note: This only works if the element is on the DOM
	bbox: function(parentShape) {
		var parentNode = (typeof parentShape !== 'undefined' ? parentShape.el : this.parent().el);

		// console.log(this, this.parent(), this.el, this.parent().el, parentShape, parentNode);

		// Source: http://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
		var bBox = this.untransformedBbox();
		var tm = this.el.getTransformToElement(parentNode);

		var xMin = Infinity;
		var xMax = -Infinity;
		var yMin = Infinity;
		var yMax = -Infinity;

		var points = [
			this.stage.point(bBox.x,  bBox.y ),
			this.stage.point(bBox.x2, bBox.y ),
			this.stage.point(bBox.x2, bBox.y2),
			this.stage.point(bBox.x,  bBox.y2)
		]

		// transform each into the space of the parent,
		// and calcuate the min/max points from that.
		points.forEach(function(pt) {
			pt = pt.matrixTransform(tm);
			xMin = Math.min(xMin, pt.x);
			xMax = Math.max(xMax, pt.x);
			yMin = Math.min(yMin, pt.y);
			yMax = Math.max(yMax, pt.y);
		});

		bBox.x = xMin;
		bBox.y = yMin;
		bBox.width = xMax - xMin;
		bBox.height = yMax - yMin;

		// Add useful additional properties:
		bBox.x2 = bBox.x + bBox.width;
		bBox.y2 = bBox.y + bBox.height;
		bBox.cx = bBox.x + bBox.width / 2;
		bBox.cy = bBox.y + bBox.height / 2;

		return bBox;
	},

	globalBbox: function() {
		var parent = this.parent();
		return this.bbox(parent === null ? this.stage : parent);
	},

	// globalPxBbox: function() {
	// 	var pxBbox = this.pxBbox(this.stage);
	// 	var brect = this.stage.el.getBoundingClientRect();

	// 	console.log('br', brect);

	// 	pxBbox.x += brect.left;
	// 	pxBbox.y += brect.top;
	// 	pxBbox.x2 += brect.left;
	// 	pxBbox.y2 += brect.top;

	// 	return pxBbox;
	// },
	// globalPxBboxOLD: function() {
	// 	var bBox = this.bbox(this.stage);
	// 	var tl = this.stage.globalSvgPointToPxPoint(bBox.x, bBox.y);
	// 	var br = this.stage.globalSvgPointToPxPoint(bBox.x2, bBox.y2);

	// 	return {
	// 		x: tl.x,
	// 		y: tl.y,
	// 		x2: br.x,
	// 		y2: br.y,
	// 		width: br.x - tl.x,
	// 		height: br.y - tl.y
	// 	};
	// },

		/*
	var svg = document.querySelector('svg');
	var pt  = svg.createSVGPoint();
	function screenCoordsForRect(rect){
	  var corners = {};
	  var matrix  = rect.getScreenCTM();
	  pt.x = rect.x.animVal.value;
	  pt.y = rect.y.animVal.value;
	  corners.nw = pt.matrixTransform(matrix);
	  pt.x += rect.width.animVal.value;
	  corners.ne = pt.matrixTransform(matrix);
	  pt.y += rect.height.animVal.value;
	  corners.se = pt.matrixTransform(matrix);
	  pt.x -= rect.width.animVal.value;
	  corners.sw = pt.matrixTransform(matrix);
	  return corners;
	}
		*/

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
		var parent = new Shape(this.el.parentElement);
		parent.stage = this.stage;
		return parent;
	},

	children: function() {
		var children = [];
		var child;

		for(var i = 0, len = this.el.children.length; i < len; i++)
		{
			child = new Shape(this.el.children[i]);
			child.stage = this.stage;
			children.push(child);
		}

		return children;
	},

	// move the element's top left corner to (x,y) in the svg coord space
	moveTo: function(x, y) {
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
	moveCenterTo: function(x, y) {

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

	globalSvgPointToLocalSvgPointOLD: function(globalPoint)
	{
		var globalToLocal = this.el.getTransformToElement(this.stage.el).inverse();
		var inObjectSpace = globalPoint.matrixTransform(globalToLocal);

		return inObjectSpace;
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

	stroke: function(color, width) {
		var attrs = {};

		if(typeof color !== 'undefined')
		{
			attrs['stroke'] = color;
		}
		if(typeof width !== 'undefined')
		{
			attrs['stroke-width'] = width;
		}

		return this.attr(attrs);
	},

	unstroke: function() {
		return this.attr({ 'stroke':'', 'stroke-width':'' });
	},

	fill: function(color) {
		return this.attr({ 'fill':color });
	},

	//@TODO - shared with stage
	getAttr: function(attrName) {
		var attr = this.el.attributes.getNamedItem(attrName);
		if(attr === null)
		{
			return undefined;
		}

		return attr.nodeValue;
	},

	//attr('x', 12)
	//attr({'x':12})
	attr: function(attrsOrAttrName, optionalAttrValue) {
		var attrs;

		if(typeof attrsOrAttrName === 'object')
		{
			attrs = attrsOrAttrName;
		}
		else
		{
			attrs = {};
			attrs[attrsOrAttrName] = optionalAttrValue;
		}

		applyAttrs(this.el, attrs);
		return this;
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

	appendTo: function(svgEl) {
		svgEl.appendChild(this.el);
		return this;
	},

	appendShape: function(shape) {
		shape.appendTo(this.el);
		return this;
	},

	getNumChildren: function() {
		return this.el.childNodes.length;
	},

	remove: function() {
		this.el.parentNode.removeChild(this.el);
		return this;
	},

	empty: function() {
		for(var i = this.el.childNodes.length - 1; i >= 0; i--)
		{
			this.el.removeChild(this.el.childNodes[i]);
		}

		return this;
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
	},

	//@TODO - this shouldn't be defined in both stage and here
	on: function(eventName, callback) {
		this.el.addEventListener(eventName, callback.bind(this));
	},

	off: function(eventName, callback) {
		//@TODO - does this need the callback????
		this.el.removeEventListener(eventName, callback);
	},

	dispatchEvent: function(eventName, args) {
		this.eventManager.dispatchEvent(eventName, this, args);
	},

	toString: function() {
		var bBox = this.untransformedBbox();
		var position = this.$el.position();
		var offset = this.$el.offset();
		var attrs = this.el.attributes;
		var attrStr = '';

		for(var i = 0, len = attrs.length; i < len; i++)
		{
			attrStr += ' ' + attrs[i].nodeName + '="' + attrs[i].nodeValue + '"';
		}

		return '[Shape <' + this.shapeName + '>' + attrStr + ' (x="' + bBox.x + '" y="' + bBox.y + '" w="' + bBox.width + '" h="' + bBox.height + '") ' + '(p.l="' + position.left.toFixed(2) + '" p.t="' + position.top.toFixed(2) + '" o.l="' + offset.left.toFixed(2) + '" o.t="' + offset.top.toFixed(2) + '")]';
	},

	log: function() {
		if(typeof console !== 'undefined' && typeof console.log !== 'undefined')
		{
			console.log(this.toString());
		}
	}
};

module.exports = Shape;