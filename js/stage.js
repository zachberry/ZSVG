/* Copyright 2013 Zachary Berry, All Rights Reserved */

//@TODO - export img for ie8: https://developer.mozilla.org/en-US/docs/HTML/Canvas/Drawing_DOM_objects_into_a_canvas


var Shape = require('./shape');
var SvgEl = require('./svgel');
// var constants = require('./constants');
var createSvgEl = require('./createsvgelement');
var createFromName = require('./createfromname');
var applyAttrs = require('./applyattributes');
var extend = require('./util/extend');

var createSvgElement = function(stage) {
	stage.el = createSvgEl('svg');
	stage.el.setAttributeNS(null, 'version', '1.1');

	// default size:
	stage.size(300, 200);
};

var Stage = function(containerIdOrSvgElement) {
	// If a placeholder is given...
	if(typeof containerIdOrSvgElement === 'string')
	{
		// Replace placeholder with svg element
		createSvgElement(this);
		document.getElementById(containerIdOrSvgElement).appendChild(this.el);
	}
	// Else, if a svg element is given...
	else if(typeof containerIdOrSvgElement === 'object')
	{
		console.log('@TODO - Need to figure out what the dimensions are');
		//@TODO this won't make a container!
		// Don't create the element, use the one passed in
		SvgEl.call(this, containerIdOrSvgElement);
	}
	// Else, neither is given...
	else
	{
		// Create the svg element but don't attach it to the DOM
		createSvgElement(this);
	}
};

Stage.prototype = Object.create(SvgEl.prototype);

extend(Stage.prototype, {
	create: function(shapeName, attrs) {
		newShape = createFromName(shapeName, attrs);
		this.append(newShape);

		return newShape;
	},

	// children: function() {
	// 	var children = SvgEl.prototype.children.call(this);
	// 	return children.map(function(child) {
	// 		child.stage = this;
	// 		return child;
	// 	});
	// },

	// childAt: function(index) {
	// 	var child = SvgEl.prototype.childAt.call(this, index);
	// 	if(!child) return null;

	// 	child.stage = this;
	// 	return child;
	// },

	size: function(width, height) {
		this.width = width;
		this.height = height;
		this.attr({ 'viewBox':'0 0 ' + this.width + ' ' + this.height });
		// this.bg.attr({ 'width':this.width, 'height':this.height });

		return this;
	},

	//MOVED TO SvgEl
	// isShapeChildOfSvgElement: function(shape) {
	// 	var element = shape.el;

	// 	while(element = element.parentNode)
	// 	{
	// 		if(element === this.el)
	// 		{
	// 			return true;
	// 		}
	// 	}

	// 	return false;
	// },

	// factory method to create a new shape - needed to
	// make sure the new shape is hooked up with
	// this as it's svgCanvas (and svgCanvas knows about it)
	// createShape: function(shapeName, attrs, innerText) {
	// 	var shape = new Shape(shapeName, attrs, innerText);

	// 	this.append(shape);

	// 	return shape;
	// },

	append: function(shape) {
		SvgEl.prototype.append.call(this, shape);
		shape.stage = this;

		return this;
	},

	removeShape: function(shape) {
		SvgEl.prototype.remove.call(this, shape);
		shape.stage = undefined;

		return true;
	},

	// Given a point over the svg element returns the SVG point
	pxPointToSvgPoint: function(px, py) {
		// NOTE: Ideally I would use getCTM instead of getScreenCTM, but FF seems to return
		// null for getCTM! Instead, fudge it by subtracting it by the left and top offsets.
		// Also - getScreenCTM accounts for scrolling, so we have to counteract against that.
		var brect = this.el.getBoundingClientRect(); //@TODO - do this work?
		var m = this.el.getScreenCTM();

		return window.ZVG.point(px + brect.left, py + brect.top).matrixTransform(m.inverse());
	},

	// Given a point on the page returns the SVG point for that position
	// Removes having to figure out current scroll position and svg
	// element position.
	// Useful if you know where you are on the page
	pagePointToSvgPoint: function(px, py) {
		// NOTE: Ideally I would use getCTM instead of getScreenCTM, but FF seems to return
		// null for getCTM! Instead, fudge it by subtracting it by the left and top offsets.
		// Also - getScreenCTM accounts for scrolling, so we have to counteract against that.
		var m = this.el.getScreenCTM();

		m.e += window.pageXOffset;
		m.f += window.pageYOffset;

		return window.ZVG.point(px, py).matrixTransform(m.inverse());
	},

	// Given a point on the screen returns the SVG point for that position
	// Removes having to figure out current scroll position and svg
	// element position.
	// Useful if you know where you are on the screen
	screenPointToSvgPoint: function(px, py) {
		return window.ZVG.point(px, py).matrixTransform(this.el.getScreenCTM().inverse());
	},

	svgPointToPxPoint: function(x, y) {
		var brect = this.el.getBoundingClientRect();

		return {
			x: x / this.width * brect.width,
			y: y / this.height * brect.height
		};
	},

	globalSvgPointToPxPointOLD: function(x, y) {
		var brect = this.el.getBoundingClientRect();

		return {
			x: x / this.width * brect.width + brect.left + window.pageXOffset,
			y: y / this.height * brect.height + brect.top + window.pageYOffset
		};
	},

	globalSvgPointToPxPoint: function(x, y) {
		var brect = this.el.getBoundingClientRect();
		var p = this.el.getScreenCTM();

		var m = this.el.getScreenCTM();
		var pp = window.ZVG.point(x,y).matrixTransform(m.inverse());
		console.log('mti', x, '=', pp.x, ',', y, '=', pp.y);

		return {
			x: x / this.width * brect.width + brect.left + window.pageXOffset,
			y: y / this.height * brect.height + brect.top + window.pageYOffset
		};
	},

	// Returns the scale factors for the current pixel width and height of the svg
	// compared to the viewBox
	// (Ex: 1000px svg width with 1000 viewbox width = 100% (1),
	// 500px svg width with 1000 viewbox width = 50% (.5))
	scaleFactor: function() {
		var brect = this.el.getBoundingClientRect();

		return {
			x: brect.width / this.width,
			y: brect.height / this.height
		};
	},
});

module.exports = Stage;