var Shape = require('../shape');

var Line = function(attrs)
{
	Shape.call(this, 'line', attrs);
}
Line.prototype = Object.create(Shape.prototype);

module.exports = Line;