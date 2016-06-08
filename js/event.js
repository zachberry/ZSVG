var Event = function() {

};

Event.prototype = {
	on: function(eventName, callback) {
		this.el.addEventListener(eventName, callback);
	},

	off: function(eventName, callback) {
		this.el.removeEventListener(eventName, callback);
	}
};

module.exports = Event;