/**
 * Top level container for our Critical Sight Javascript code
 */

var CriticalSight = {};

CriticalSight.Util = {
	/**
	 * In array `arr` require each object to have a property `propName`
	 * or else throw the error message `msg`.
	 */
	forEachRequireProperty : function(arr, propName, msg) {
		arr.forEach(function(item) {
			if (!item[propName]) {
				throw new Error(msg);
			}
		});
	}
};