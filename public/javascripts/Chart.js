/**
 * Tools for the bar chart part of a Gantt chart
 */

define(['Plans', 'Sizer', 'PeriodMaker', 'DependencyMaker', 'jquery'],
		function(Plans, Sizer, PeriodMaker, DependencyMaker, $) {
	var self =  {
	        
	    /**
	     * Show the chart bar area defined by the given `Plan` on the specified `stage`.
	     */
		"showBarsByJson" : function(stage, plan) {
			
			// Clear any old elements from the last version of the chart.
	        stage.removeAllChildren();
	        stage.update();
			
			var htmlCanvasWidth = stage.canvas.width;
			var sizer = new Sizer(plan, htmlCanvasWidth / plan.duration, 20);
			var pMaker = new PeriodMaker(sizer);
			var dMaker = new DependencyMaker(sizer);
			
			stage.canvas.height = sizer.chartHeight;
	
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
		
		/** Populate the chart text area with period descriptions from the
		 * given plan.
		 * @param tableSelector  CSS selector to identify the table to populate.
		 * @param plan           The plan with the periods.
		 */
		populateChartText: function(tableSelector, plan) {
	    	$(tableSelector).html("");
	    	plan.periodList.forEach(function(curr, idx, arr) {
	    		var id = curr.id;
	    		var desc = curr.description;
	    		$(tableSelector).append($("<tr>").html($('<td>').html(id)).append($('<td>').html(desc)));
	    	});

		}
	};
	return self;
});
