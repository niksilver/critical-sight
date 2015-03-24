/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(canvas, spec) {
		
		var CS = CriticalSight;

		var plan = new CS.Plan(spec);
		
		var htmlCanvasWidth = canvas.getElement().width;
		var sizer = new CS.Sizer(20, htmlCanvasWidth / plan.duration, plan.start);
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
