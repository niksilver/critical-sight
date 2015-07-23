/**
 * Top level container for our Critical Sight Javascript code,
 * plus sundry definitions.
 */

define(function() {
	return {
	    Util: {
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
			},
			
			/**
			 * Set the bounds of a shape. We give a list of left coords,
			 * top coords (and it picks the smallest of each), widths
			 * and heights (and it picks the greatest of each).
			 */
			setBounds: function(shape, lefts, tops, widths, heights) {
			    shape.setBounds(
			            Math.min.apply(this, lefts),
			            Math.min.apply(this, tops),
			            Math.max.apply(this, widths),
			            Math.max.apply(this, heights));
			}
		},
		
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