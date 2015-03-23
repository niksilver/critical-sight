/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(canvas) {
		
		var CS = CriticalSight;

		var planSpec = {
			periods : [ {
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
			}, {
				id : 't5',
				start : 2,
				duration : 0
			} ]
		};

		var plan = new CS.Plan(planSpec);
		
		var htmlCanvasWidth = canvas.getElement().width;
		var sizer = new CS.Sizer(20, htmlCanvasWidth / plan.duration);
		var pMaker = new CS.PeriodMaker(sizer);

		for (var i = 0; i < plan.periodList.length; i++) {
			var period = plan.periodList[i];
			var start = period.start;
			var duration = period.duration;
			var periodShape = pMaker.periodShape(i, start, duration);
			canvas.add(periodShape);
		}
	}
};
