var Text = require('../shapes/text');
var Tspan = require('../shapes/tspan');

var measuredContainer;

var MultilineText = function(attrs, text, textWidth) {
	Text.call(this, attrs);
	this.setText(text, textWidth);
}

MultilineText.prototype = Object.create(Text.prototype);

MultilineText.prototype.setText = function(text, textWidth) {
	if(typeof text === "undefined") return;
	this.text = text;
	this.setTextWidth(textWidth);

	return this;
};
MultilineText.prototype.getText = function() {
	return this.text;
};
MultilineText.prototype.setTextWidth = function(newTextWidth) {
	if(!isNaN(newTextWidth) && newTextWidth > 0) this.textWidth = newTextWidth;

	this.empty();
	createTextElements(this);
}
MultilineText.prototype.clone = function() {
	var clone = new MultilineText();
	clone.el = this.el.cloneNode(true);
	clone.setText(this.text, this.textWidth);

	return clone;
}
// MultilineText.prototype.attr = function() {
// 	Text.prototype.attr.apply(this, arguments);
// 	this.setTextWidth(this.textWidth);
// }



var measureText = function(text)
{
	var bbox;

	var tspan = new Tspan({}, text);
	measuredContainer.append(tspan);

	bbox = tspan.bbox();

	tspan.remove();

	return { width:bbox.width, height:bbox.height };
};

var createTextElements = function(instance)
{
	var text = instance.text;
	var maxWidth = instance.textWidth;
	var lines = text.split('\n');
	var curLineLength = 0;
	var curLine;
	var curLineEmpty;
	var splitResult;
	var curTextMeasurements;
	var curText;
	var totalTextHeight = 0;
	var textEls = [];
	var numTspansCreated = 0;

	// measureTextShape = textShape.clone();
	// measuredContainer = instance.clone();
	measuredContainer = Text.prototype.clone.call(instance);
	this.stage.append(measuredContainer);

	// since we are modifying the array on the fly I'm intentionally
	// not caching length:
	for(var i = 0; i < lines.length; i++)
	{
		curLine = lines[i];

		// Empty lines won't be measured correctly, so we insert a character
		// so we can measure the line correctly:
		if(curLine === '')
		{
			curLineEmpty = true;
			curLine = '_';
		}
		else
		{
			curLineEmpty = false;
		}

		curTextMeasurements = measureText(curLine);
		curLineLength = curTextMeasurements.width;
		if(curLineLength > maxWidth)
		{
			// split the line up, process the line that fits
			// and squeeze in the remainder as a new line:
			splitResult = splitLine(curLine, maxWidth);
			if(splitResult !== false)
			{
				curLine = splitResult[0];
				lines.splice(i, 1, splitResult[1]);
				// since we had to split this line we want to rewind a step
				// and process the rest of the split line that is now in the
				// same place.
				i--;
			}
		}

		//@TODO - don't hardcode the bold option here man!
		//curTspan = this.svgCanvas.createShape('tspan', { 'font-weight':'bold' }, curLineEmpty ? '' : curLine);
		curTspan = new Tspan({}, curLineEmpty ? '' : curLine);

		numTspansCreated++;
		instance.append(curTspan);
		// We shift each element down to get rid of the baseline problem.
		// However this causes a problem if there is only one tspan element.
		totalTextHeight += curTextMeasurements.height;
		curTspan.attr({ 'x':0, 'y':totalTextHeight });
	}

	// this.stopMeasuringText();
	// measuredContainer.remove();

	if(numTspansCreated === 1)
	{
		// Reset our height-shifted y if we only have one tspan!
		curTspan.attr({ 'y':0 });
	}
};

var splitLine = function(line, maxWidth)
{
	var words = line.split(' ');
	var curWord;
	var curText;
	var curFittingLineIndex = 0;
	var curTestLine = '';
	var s;

	for(var i = 0, len = words.length; i < len; i++)
	{
		curWord = words[i] + (i === len - 1 ? '' : ' ');
		curTestLine += curWord;
		if(measureText(curTestLine).width <= maxWidth)
		{
			curFittingLineIndex += curWord.length;
		}
		else
		{
			break;
		}
	}

	if(curFittingLineIndex === 0)
	{
		// try splitword
		s = splitWord(line, maxWidth);
		if(s !== null && s[0] !== '-') return s;

		// splitword failed, so, giveup
		curFittingLineIndex = 1;
	}

	s = [ line.substr(0, curFittingLineIndex), line.substr(curFittingLineIndex) ];

	return s;
};

// Returns a two-item array where 0 contains the portion of the word that will fit
// and 1 contains the remaining word.
// Appends a "-" to the word portion.
var splitWord = function(word, maxWidth)
{
	for(var i = word.length; i >= 0; i--)
	{
		if(measureText(word.substr(0, i) + '-').width <= maxWidth)
		{
			return [word.substr(0, i) + '-', word.substr(i)];
		}
	}

	return null;
};

ZVG.MultilineText = MultilineText;