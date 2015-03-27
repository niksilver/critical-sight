/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(canvas, spec) {
		
		var CS = CriticalSight;

		var plan = new CS.Plan(spec);
		
		var htmlCanvasWidth = canvas.getElement().width;
		var sizer = new CS.Sizer(plan.start,htmlCanvasWidth / plan.duration, 20);
		var pMaker = new CS.PeriodMaker(sizer);
		var dMaker = new CS.DependencyMaker(sizer);

		var prevShape = null;
		for (var i = 0; i < plan.periodList.length; i++) {
			var period = plan.periodList[i];
			var type = period.type;
			var start = period.start;
			var duration = period.duration;
			var periodShape = pMaker.periodShape(type, i, start, duration);
			canvas.add(periodShape);
			if (prevShape !== null) {
			    var dep = dMaker.dependency(prevShape, periodShape);
			    canvas.add(dep);
			}
            prevShape = periodShape;
		}
	}
};
