/**
 * Top level container for our Critical Sight Javascript code,
 * plus sundry definitions.
 */

var CriticalSight = {};

CriticalSight.Util = {
	/**
	 * In array `arr` require each object to have a property `propName`
	 * or else throw the error message `msg`.
	 */
	forEachRequireProperty : function(arr, propName, msg) {
		arr.forEach(function(item) {
			if (typeof item[propName] === 'undefined') {
				throw new CriticalSight.BadlyDefinedObjectError(msg);
			}
		});
	}
};

CriticalSight.UndefinedTaskError = function(message) {
    this.name = "UndefinedTaskError";
    this.message = (message || "");
};
CriticalSight.UndefinedTaskError.prototype = Error.prototype;

CriticalSight.BadlyDefinedObjectError = function(message) {
    this.name = "BadlyDefinedObjectError";
    this.message = (message || "");
};
CriticalSight.BadlyDefinedObjectError.prototype = Error.prototype;
