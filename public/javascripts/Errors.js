/**
 * Functions to generate errors. Use the form new Errors.UndefinedTaskError("Message");
 */

define(function() {
	return {		
		UndefinedTaskError: (function() {
			var fn = function(message) {
				this.name = "UndefinedTaskError";
				this.message = (message || "");
			};
			fn.prototype = Error.prototype;
			return fn;
		})(),
		
		BadlyDefinedObjectError: (function() {
			var fn = function(message) {
				this.name = "BadlyDefinedObjectError";
				this.message = (message || "");
			};
			fn.prototype = Error.prototype;
			return fn;
		})()
	};
});