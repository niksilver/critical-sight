/**
 * Utilities for generating plans. Useful for testing.
 */

CriticalSight.TestPlans = {};

/**
 * An empty plan
 */
CriticalSight.TestPlans.emptyPlan = new CriticalSight.Plan({ periods: [], dependencies: []});

/**
 * A plan with a given number of tasks.
 */
CriticalSight.TestPlans.dummyPlan = function(taskCount, start) {
    var tasks = [];
    start = start || 0; 
    for (var i = 0; i < taskCount; i++) {
        tasks.push({ id: 't'+i, start: start, duration: 1 });
    }
    return new CriticalSight.Plan({ periods: tasks, dependencies: [] });
};