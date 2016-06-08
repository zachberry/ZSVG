var Shape = require('../shape');
var PathPen = require('./path/pathpen');

var Path = function(attrs)
{
	Shape.call(this, 'path', attrs);
	this.pen = new PathPen(this);
}
Path.prototype = Object.create(Shape.prototype);

module.exports = Path;