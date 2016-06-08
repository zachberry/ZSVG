var applyAttrs = require('./applyattributes');
var createFromEl = require('./createfromel');

var SvgEl = function(svgElement) {
	this.el = svgElement;
};

SvgEl.prototype = {
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
		var parentNode = (typeof parentShape !== 'undefined' ? parentShape.el : this.el.parentElement);

		// console.log(this, this.parent(), this.el, this.parent().el, parentShape, parentNode);

		// Source: http://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
		var bBox = this.untransformedBbox();
		var tm = this.el.getTransformToElement(parentNode);

		var xMin = Infinity;
		var xMax = -Infinity;
		var yMin = Infinity;
		var yMax = -Infinity;

		var points = [
			window.ZVG.point(bBox.x,  bBox.y ),
			window.ZVG.point(bBox.x2, bBox.y ),
			window.ZVG.point(bBox.x2, bBox.y2),
			window.ZVG.point(bBox.x,  bBox.y2)
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

	children: function() {
		var children = [];
		var child;

		for(var i = 0, len = this.el.children.length; i < len; i++)
		{
			child = createFromEl(this.el.children[i]);
			children.push(child);
		}

		return children;
	},

	childAt: function(index) {
		var childEl = this.el.children[index];
		if(!childEl) return null;

		return createFromEl(childEl);
	},

	hasChild: function(svgEl) {
		var el = svgEl.el;

		while(el = el.parentNode)
		{
			if(el === this.el)
			{
				return true;
			}
		}

		return false;
	},

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

	appendTo: function(el) {
		el.appendChild(this.el);
		return this;
	},

	append: function(svgEl) {
		svgEl.appendTo(this.el);
		return this;
	},

	getNumChildren: function() {
		return this.el.childElementCount;
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

	on: function(eventName, callback) {
		this.el.addEventListener(eventName, callback);
	},

	off: function(eventName, callback) {
		this.el.removeEventListener(eventName, callback);
	}
};

module.exports = SvgEl;