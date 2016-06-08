module.exports = function(shapeName, attrs) {
	var className = shapeName.substr(0,1).toUpperCase() + shapeName.substr(1);
	if(!window.ZVG[className]) className = 'Shape';
	return new window.ZVG[className](attrs);
};