var Shape = require('../shape');

var Image = function(attrs)
{
	Shape.call(this, 'image', attrs);
}
Image.prototype = Object.create(Shape.prototype);

Image.prototype.src = function(url) {
	this.attr({'http://www.w3.org/1999/xlink xlink:href': url});
	return this;
};

module.exports = Image;