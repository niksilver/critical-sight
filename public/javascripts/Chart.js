/**
 * Demo of a Gantt chart
 */

CriticalSight.Chart = {
        
    /**
     * Show the chart defined by the Json `spec` on the specified `stage`.
     */
	"show" : function(stage, spec) {
		
		var CS = CriticalSight;
		
		// Clear any old elements from the last version of the chart.
        stage.removeAllChildren();
        stage.update();

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
	},
	
	/**
	 * Show the chart defined by the text description, on the specified `stage
	 */
	"showByText" : function(stage, text) {
        $.post('/readPlan',
                "text=" + encodeURI(text),
                function(spec) {
                    CS.Chart.show(stage, spec);
                });

	}
};
