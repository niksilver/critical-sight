/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(canvas) {
		
		var CS = CriticalSight;

		var sizer = new CS.Sizer(20, 50);
		var tMaker = new CS.TaskMaker(sizer);

		var taskSpec = {
			tasks : [ {
				id : 't1',
				start : 0,
				duration : 3
			}, {
				id : 't2',
				start : 3,
				duration : 5
			}, {
				id : 't3',
				start : 1,
				duration : 1
			}, {
				id : 't4',
				start : 2,
				duration : 1.5
			} ]
		};

		for (var i = 0; i < taskSpec.tasks.length; i++) {
			var task = taskSpec.tasks[i];
			var start = task.start;
			var duration = task.duration;
			var rect = tMaker.taskRect(i, start, duration);
			canvas.add(rect);
		}
	}
};
