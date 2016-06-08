function findContainingSvg(el)
{
	while(el)
	{
		if(el.tagName && el.tagName === 'svg') return el;
		el = el.parentElement;
	}
}

module.exports = function(el) {
	var tagName, className, zvgClass, svgEl, stage;

	tagName = className = el.tagName;

	if(tagName === 'svg')
	{
		className = 'Stage';
	}
	else
	{
		className = tagName.substr(0,1).toUpperCase() + tagName.substr(1);
	}

	if(window.ZVG[className])
	{
		zvgClass = new window.ZVG[className];
	}
	else
	{
		zvgClass = new window.ZVG.Shape(tagName);
	}

	if(className !== 'Stage')
	{
		svgEl = findContainingSvg(el);
		if(svgEl)
		{
			stage = new window.ZVG.Stage(svgEl);
			zvgClass.stage = stage;
		}
	}

	zvgClass.el = el;

	return zvgClass;
};