/**
 * A collection of related tasks. The spec looks like this:
 * {{{
 *     {
 *         periods: [
 *             { id: 't0', start: 1.0, duration: 3.0 },
 *             { id: 't1', start: 3.0, duration: 2.0 },
 *             { id: 't2', start: 5.0, duration: 2.0 }],
 *         dependencies: [['t0', 't1'], ['t1', 't2']]
 *     }
 * }}}
 * 
 */

define(['Util', 'Errors'], function(Util, Errors) {
    return function(spec) {
		'use strict';
	
		var self = this;
	
		// Create the periodList
		if (!spec.periods) {
			throw new Error("No periods property found");
		}
		Util.forEachRequireProperty(spec.periods, 'id', "Found a period without an id");
		Util.forEachRequireProperty(spec.periods, 'start', "Found a period without a start");
		Util.forEachRequireProperty(spec.periods, 'duration', "Found a period without a duration");
		
		/**
		 * The array of periods, with an end property for each one.
		 */
		this.periodList = spec.periods.map(function(curr, idx, arr) {
			curr.end = curr.start + curr.duration;
			return curr;
		});
	
		/**
		 * The start of the earliest task, or undefined if there are no tasks.
		 */
		var startFn = function(prev, curr, index, arr) {
			return (prev.start <= curr.start) ? prev : curr;
		};
		this.start = (this.periodList.length === 0) ? undefined : this.periodList.reduce(startFn).start;
	
		/**
		 * The end of the latest task, or undefined if there are no tasks.
		 */
		var endFn = function(prev, curr, index, arr) {
			return (prev.end >= curr.end) ? prev : curr;
		};
		this.end = (this.periodList.length === 0) ? undefined : this.periodList.reduce(endFn).end;
		
		/**
		 * The time between the plan start and end
		 */
		this.duration = (this.periodList.length === 0) ? undefined : (this.end - this.start);
		
		/**
		 * Get a period by its id, or undefined if it's not specified
		 */
		this.period = function(id) {
			for (var i = 0; i < this.periodList.length; i++) {
				var period = this.periodList[i];
				if (period.id === id) { return period; }
			}
		};
		
		/**
		 * An array of dependencies, referenced by period id only
		 */
		(spec.dependencies || []).forEach(function(pair, idx, deps) {
			if (!Array.isArray(pair)) {
				throw new Errors.BadlyDefinedObjectError("Expected a period id pair, but found '" + pair + "'");
			}
			if (pair.length != 2) {
				throw new Errors.BadlyDefinedObjectError("Dependency " + idx + " needs two elements, found " + pair.length);
			}
			if (self.period(pair[0]) === undefined) {
				throw new Errors.UndefinedTaskError("Undefined period id '" + pair[0] + "' among the dependencies");
			}
			if (self.period(pair[1]) === undefined) {
				throw new Errors.UndefinedTaskError("Undefined period id '" + pair[1] + "' among the dependencies");
			}
		});
		this.dependencyIDs = spec.dependencies || [];
		
		/**
		 * An array of dependencies. Each element is a 2-ary array, of which we
		 * have the "from" period and the "to" period.
		 */
		this.dependencies = this.dependencyIDs.map(function (curr, idx, arr) {
		    return [ self.period(curr[0]), self.period(curr[1]) ];
		});
	};
});
