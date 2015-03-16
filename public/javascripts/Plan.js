/**
 * A collection of related tasks. The spec needs the following properties: -
 * tasks. An array of tasks (see below).
 * 
 * Each task must be an object with the following properties: - id. A simple
 * string. - start. A numeric. - duration. A numeric.
 */

CriticalSight.Plan = function(spec) {
	'use strict';

	var Util = CriticalSight.Util;

	// Create the taskList
	if (!spec.tasks) {
		throw new Error("No tasks property found");
	}
	Util.forEachRequireProperty(spec.tasks, 'id', "Found a task without an id");
	Util.forEachRequireProperty(spec.tasks, 'start',
			"Found a task without a start");
	this.taskList = spec.tasks;

};
