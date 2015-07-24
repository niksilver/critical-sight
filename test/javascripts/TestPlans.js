/**
 * Utilities for generating plans. Useful for testing.
 */

define(['Plan'], function(Plan) {
	return {
		/**
		 * An empty plan
		 */
		emptyPlan: new Plan({ periods: [], dependencies: []}),
		
		/**
		 * A plan with a given number of tasks.
		 */
		dummyPlan: function(taskCount, start) {
		    var tasks = [];
		    start = start || 0; 
		    for (var i = 0; i < taskCount; i++) {
		        tasks.push({ id: 't'+i, start: start, duration: 1 });
		    }
		    return new Plan({ periods: tasks, dependencies: [] });
		}
	};
});
