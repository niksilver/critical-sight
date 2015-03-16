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
	
	/**
	 * The time between the plan start and end
	 */
	this.duration = (this.taskList.length === 0) ? undefined : (this.end - this.start);
	
	/**
	 * Get a task by its id, or undefined if it's not specified
	 */
	this.task = function(id) {
		for (var i = 0; i < this.taskList.length; i++) {
			var task = this.taskList[i];
			if (task.id === id) { return task; }
		}
	};
	
	/**
	 * An array of dependencies, referenced by task id only
	 */
	(spec.dependencies || []).forEach(function(pair, idx, deps) {
		if (!Array.isArray(pair)) {
			throw new CS.BadlyDefinedObjectError("Expected a task ID pair, but found '" + pair + "'");
		}
		if (pair.length != 2) {
			throw new CS.BadlyDefinedObjectError("Dependency " + idx + " needs two elements, found " + pair.length);
		}
		if (self.task(pair[0]) === undefined) {
			throw new Error("Undefined task ID '" + pair[0] + "' among the dependencies");
		}
		if (self.task(pair[1]) === undefined) {
			throw new Error("Undefined task ID '" + pair[1] + "' among the dependencies");
		}
	});
	this.dependencyIDs = spec.dependencies || [];
};
