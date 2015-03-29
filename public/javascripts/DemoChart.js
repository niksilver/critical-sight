/**
 * Demo of a Gantt chart
 */

CriticalSight.DemoChart = {
	"run" : function(stage, spec) {
		
		var CS = CriticalSight;

		var plan = new CS.Plan(spec);
		
		var htmlCanvasWidth = stage.canvas.width;
		var sizer = new CS.Sizer(plan.start,htmlCanvasWidth / plan.duration, 20);
		var pMaker = new CS.PeriodMaker(sizer);
		var dMaker = new CS.DependencyMaker(sizer);

		var periodShapes = {};
		for (var i = 0; i < plan.periodList.length; i++) {
			var period = plan.periodList[i];
			var id = period.id;
			var type = period.type;
			var start = period.start;
			var duration = period.duration;
			var periodShape = pMaker.periodShape(type, i, start, duration);
			stage.addChild(periodShape);
			periodShapes[id] = periodShape;
		}
		
		var deps = plan.dependencyIDs;
		for (i = 0; i < deps.length; i++) {
		    var fromId = deps[i][0];
		    var toId = deps[i][1];
		    var fromShape = periodShapes[fromId];
		    var toShape = periodShapes[toId];
		    var depShape = dMaker.dependency(fromShape, toShape);
		    stage.addChild(depShape);
		}
		stage.update();
	}
};
