var Shape = require('../shape');
var Text = require('./text');

var Tspan = function(attrs, text)
{
	Shape.call(this, 'tspan', attrs);
	this.setText(text);
}
Tspan.prototype = Object.create(Text.prototype);

module.exports = Tspan;