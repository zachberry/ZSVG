var Shape = require('../shape');

var lastMousePoint = null;
var targetShape = null;

var handleMousedown = function(event) {
	event.preventDefault();
	event.stopPropagation();

	startDrag(this, event);
};

var handleMousemove = function(event) {
	var curMousePt = targetShape.stage.pxPointToSvgPoint(event.clientX, event.clientY);
	var dx = curMousePt.x - lastMousePoint.x;
	var dy = curMousePt.y - lastMousePoint.y;

	if(targetShape.restrict)
	{
		var bbox = targetShape.bbox();

		if(bbox.x + dx < 0)
		{
			dx = -bbox.x;
		}
		else if(bbox.x2 + dx > targetShape.stage.width)
		{
			dx = targetShape.stage.width - bbox.x2;
		}

		if(bbox.y + dy < 0)
		{
			dy = -bbox.y;
		}
		else if(bbox.y2 + dy > targetShape.stage.height)
		{
			dy = targetShape.stage.height - bbox.y2;
		}
	}

	targetShape.moveBy(dx, dy);

	lastMousePoint.x += dx;
	lastMousePoint.y += dy;
};

var startDrag = function(shape, event) {
	targetShape = shape;
	lastMousePoint = shape.stage.pxPointToSvgPoint(event.clientX, event.clientY);

	document.addEventListener('mousemove', handleMousemove);
	document.addEventListener('mouseup', stopDrag);
};

var stopDrag = function(shape, event) {
	document.removeEventListener('mousemove', handleMousemove);
	document.removeEventListener('mouseup', stopDrag);
};

// Add a 'draggable' method to enable/disable
Shape.prototype.draggable = function(val, restrict) {
	//@TODO - what if you run this multiple times?
	this.restrict = restrict || false;

	if(val)
	{
		this.on('mousedown', handleMousedown);
	}
	else
	{
		this.off('mousedown', handleMousedown);
	}
};

// Shape.prototype.restrict