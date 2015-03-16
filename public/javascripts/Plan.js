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

	var Util = CriticalSight.Util;

	// Create the taskList
	if (!spec.tasks) {
		throw new Error("No tasks property found");
	}
	Util.forEachRequireProperty(spec.tasks, 'id', "Found a task without an id");
	Util.forEachRequireProperty(spec.tasks, 'start', "Found a task without a start");
	Util.forEachRequireProperty(spec.tasks, 'duration', "Found a task without a duration");
	
	/**
	 * The array of tasks, with an end property for each one.
	 */
	this.taskList = spec.tasks.map(function(curr, idx, arr) {
		curr.end = curr.start + curr.duration;
		return curr;
	});

	/**
	 * The start of the earliest task, or undefined if there are no tasks.
	 */
	var startFn = function(prev, curr, index, arr) {
		return (prev.start <= curr.start) ? prev : curr;
	};
	this.start = (this.taskList.length === 0) ? undefined : this.taskList.reduce(startFn).start;

	/**
	 * The end of the latest task, or undefined if there are no tasks.
	 */
	var endFn = function(prev, curr, index, arr) {
		return (prev.end >= curr.end) ? prev : curr;
	};
	this.end = (this.taskList.length === 0) ? undefined : this.taskList.reduce(endFn).end;
};
