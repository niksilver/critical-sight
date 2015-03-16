/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(canvas) {
		
		var CS = CriticalSight;

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

		var plan = new CS.Plan(taskSpec);
		
		var htmlCanvasWidth = canvas.getElement().width;
		var sizer = new CS.Sizer(20, htmlCanvasWidth / plan.duration);
		var tMaker = new CS.TaskMaker(sizer);

		for (var i = 0; i < plan.taskList.length; i++) {
			var task = plan.taskList[i];
			var start = task.start;
			var duration = task.duration;
			var rect = tMaker.taskRect(i, start, duration);
			canvas.add(rect);
		}
	}
};
