var Shape = require('../shape');

var Rect = function(attrs)
{
	Shape.call(this, 'rect', attrs);
}
Rect.prototype = Object.create(Shape.prototype);

module.exports = Rect;