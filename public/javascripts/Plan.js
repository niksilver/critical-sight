/**
 * A collection of related tasks. The spec needs the following properties:
 * - tasks. An array of tasks (see below).
 * 
 * Each task must be an object with the following properties:
 * - id. A simple string.
 * - start. A numeric.
 * - duration. A numeric.
 */

CriticalSight.Plan = function(spec) {
	'use strict';

	var self = this;
	var CS = CriticalSight;
	var Util = CriticalSight.Util;

	// Create the periodsList
	if (!spec.periods) {
		throw new Error("No periods property found");
	}
	Util.forEachRequireProperty(spec.periods, 'id', "Found a period without an id");
	Util.forEachRequireProperty(spec.periods, 'start', "Found a period without a start");
	Util.forEachRequireProperty(spec.periods, 'duration', "Found a period without a duration");
	
	/**
	 * The array of periods, with an end property for each one.
	 */
	this.periodsList = spec.periods.map(function(curr, idx, arr) {
		curr.end = curr.start + curr.duration;
		return curr;
	});

	/**
	 * The start of the earliest task, or undefined if there are no tasks.
	 */
	var startFn = function(prev, curr, index, arr) {
		return (prev.start <= curr.start) ? prev : curr;
	};
	this.start = (this.periodsList.length === 0) ? undefined : this.periodsList.reduce(startFn).start;

	/**
	 * The end of the latest task, or undefined if there are no tasks.
	 */
	var endFn = function(prev, curr, index, arr) {
		return (prev.end >= curr.end) ? prev : curr;
	};
	this.end = (this.periodsList.length === 0) ? undefined : this.periodsList.reduce(endFn).end;
	
	/**
	 * The time between the plan start and end
	 */
	this.duration = (this.periodsList.length === 0) ? undefined : (this.end - this.start);
	
	/**
	 * Get a period by its id, or undefined if it's not specified
	 */
	this.period = function(id) {
		for (var i = 0; i < this.periodsList.length; i++) {
			var period = this.periodsList[i];
			if (period.id === id) { return period; }
		}
	};
	
	/**
	 * An array of dependencies, referenced by period id only
	 */
	(spec.dependencies || []).forEach(function(pair, idx, deps) {
		if (!Array.isArray(pair)) {
			throw new CS.BadlyDefinedObjectError("Expected a period id pair, but found '" + pair + "'");
		}
		if (pair.length != 2) {
			throw new CS.BadlyDefinedObjectError("Dependency " + idx + " needs two elements, found " + pair.length);
		}
		if (self.period(pair[0]) === undefined) {
			throw new CS.UndefinedTaskError("Undefined period id '" + pair[0] + "' among the dependencies");
		}
		if (self.period(pair[1]) === undefined) {
			throw new CS.UndefinedTaskError("Undefined period id '" + pair[1] + "' among the dependencies");
		}
	});
	this.dependencyIDs = spec.dependencies || [];
};
