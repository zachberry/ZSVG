module.exports = function(el, attrs) {
	var val, ns;

	if(typeof attrs === 'undefined') return;

	for(var attrName in attrs)
	{
		val = attrs[attrName];
		ns = null;

		// Retrieve namespace (example: 'http://www.w3.org/1999/xlink href')
		if(attrName.indexOf(' ') > -1)
		{
			tokens = attrName.split(' ');
			ns = tokens[0];
			attrName = tokens[1];
		}

		// Note: IE9 had a weird issue where attempting to removeAttributeNS
		// on "y" didn't appear to work. As a workaround, always set attribute
		// to the desired value (even ''), and then good browsers will call
		// removeAttributeNS - if that call fails at least the attribute
		// is now ''
		el.setAttributeNS(ns, attrName, val);

		if(attrs[attrName] === '')
		{
			el.removeAttributeNS(ns, attrName);
		}
	}
};