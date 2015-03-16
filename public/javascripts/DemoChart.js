/**
 * Demo of a Gantt chart
 */

var DemoChart = {
	"run" : function(canvas) {

		var sizer = new Sizer(20, 50);
		var tMaker = new TaskMaker(sizer);

		var taskSpec = {
			tasks : [ {
				id : 't1',
				start : 0,
				duration : 3
			}, {
				id : 't2',
				start : 3,
				duration : 5
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
