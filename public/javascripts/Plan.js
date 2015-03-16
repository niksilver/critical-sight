/**
 * A collection of related tasks.
 * The spec needs the following properties:
 *   - tasks. An array of tasks (see below).
 * 
 * Each task must be an object with the following properties:
 *   - id. A simple string.
 *   - start. A numeric.
 *   - duration. A numeric.
 */

CriticalSight.Plan = function(spec) {
	'use strict';
	
	// Create the taskList
	if (!spec.tasks) {
		throw new Error("No tasks property found");
	}
	spec.tasks.forEach(function(task) {
		if (!task.id) { throw new Error("Found a task without an id"); }
	});
	this.taskList = spec.tasks;
	
};