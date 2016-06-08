var Shape = require('../shape');

var Group = function(attrs)
{
	Shape.call(this, 'group', attrs);
}
Group.prototype = Object.create(Shape.prototype);

module.exports = Group;