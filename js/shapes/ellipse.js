var Shape = require('../shape');

var Ellipse = function(attrs)
{
	Shape.call(this, 'ellipse', attrs);
}
Ellipse.prototype = Object.create(Shape.prototype);

Ellipse.prototype.moveTo = function(x, y) {
	var bbox = this.bbox();
	return this.setMatrixValues({ e:x + bbox.width / 2, f:y + bbox.height / 2 });
};
Ellipse.prototype.moveCenterTo = function(x, y) {
	return this.setMatrixValues({ e:x, f:y });
};

module.exports = Ellipse;