/**
 * Code for the demo.html page, just for a quick visual test.
 */

require.config({
    // Default location for any module IDs
    baseUrl: '/public/javascripts',
    
    // Each library is is its own location
    paths: {
    	'jquery': '../lib/jquery',
    	'easeljs': '../lib/easeljs-0.8.0.min'
      },
      
    // We use a shim for easeljs because it's not written as a module
    // and it drop a createjs variable into the global namespace.
    shim: {
      'easeljs': {
        exports: 'createjs'
      }
    }

});

require(['Chart', 'jquery', 'easeljs'], function(Chart, $, easeljs) {
	var defaultPlan =
	    't0: "Start"\n' +
	    't1: "Write a long list" 2.0\n' +
	    't2: "Do what\'s on the list" 5.0\n' +
	    'tEnd: "End"\n' +
	    't4: "Extra work" 2.0\n' +
	    't0 -> t1 -> tEnd\n' +
	    't0 -> t2 -> tEnd\n' +
	    't0 -> t4 -> t1\n' +
	    't4 -> tEnd\n';
	
	// Do this when the page has loaded
	
	$(function() {
	
		var htmlCanvas = document.getElementById('chart-bars-canvas');
		htmlCanvas.width = 1000;
		htmlCanvas.height = 500;
	
		var stage = new createjs.Stage(htmlCanvas);
	
		// Lay out the chart text (testing only)
		
		$("#chart-text").css("padding-top", "5px");  // Top padding - (mid-bar padding / 2)
		$("#chart-text-inner td").each(function() {
		    $(this).css("height", "20px");        // Bar height
		    $(this).css("padding-top", "5px");    // Mid-bar padding / 2
		    $(this).css("padding-bottom", "5px"); // Mid-bar padding / 2
		});
		
		// Insert and render the default plan (chart bars)
		
		$("#plantext").val(defaultPlan);
		Chart.showBarsByText(stage, defaultPlan);
		
		// Update the rendering when we change the text
		
		$("#submit-plan").click(function() {
		    var text = $("#plantext").val();
		    Chart.showBarsByText(stage, text);
		});
		
		// Respond to the bars div scrolling
		
		$("#chart-bars").scroll(function(data) {
		    var top = $("#chart-bars").scrollTop();
		    var marginTop = ""+(-1 * top)+"px";
		    $("#chart-text-inner").css("margin-top", marginTop);
		});
	});
});
