var Shape = require('../shape');

var Text = function(attrs, text)
{
	Shape.call(this, 'text', attrs);
	this.setText(text);
}
Text.prototype = Object.create(Shape.prototype);

Text.prototype.setText = function(text) {
	if(typeof text !== "undefined") this.el.textContent = text;

	return this;
};
Text.prototype.getText = function() {
	return this.el.textContent;
};

module.exports = Text;