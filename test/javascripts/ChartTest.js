/**
 * Tests for the Chart functions.
 */

define(['Chart', 'jquery', 'test/TestPlans'], function(Chart, $, TestPlans) {
	describe("Chart", function() {
		
		describe("populateChartText", function() {
		    it("should give empty table if no periods", function() {
		    	
		    	// Set up the HTML structure
		    	$('#test-area').remove();
		    	$('body').append('<div id="test-area"><table id="chart-text-table"></table></div>');
		    	
		    	var table = $('#chart-text-table');
		    	var trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( 0 );
		        
		        var plan = TestPlans.emptyPlan;
		        Chart.populateChartText('#chart-text-table', plan);
		    	
		    	table = $('#chart-text-table');
		    	trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( 0 );
		    });

		    it("should give a populated table if some periods", function() {
		    	
		    	// Set up the HTML structure
		    	$('#test-area').remove();
		    	$('body').append('<div id="test-area"><table id="some-table-id"></table></div>');
		    	
		    	var table = $('#some-table-id');
		    	var trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( 0 );
		        
		        var periods = 3;
		        var plan = TestPlans.dummyPlan(periods, plan);
		        Chart.populateChartText('#some-table-id', plan);
		    	
		    	table = $('#some-table-id');
		    	trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( periods );
		        
		        // We'll ready out the task id and description together 
		        expect( trs.eq(0).text() ).toEqual( "t0Task 0" );
		        expect( trs.eq(1).text() ).toEqual( "t1Task 1" );
		        expect( trs.eq(2).text() ).toEqual( "t2Task 2" );
		    });

		    it("should clear out the old description when repopulating", function() {
		    	
		    	// Set up the HTML structure
		    	$('#test-area').remove();
		    	$('body').append('<div id="test-area"><table id="some-table-id"></table></div>');
		    	
		    	var table = $('#some-table-id');
		    	var trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( 0 );
		        
		        var periods = 3;
		        var plan = TestPlans.dummyPlan(periods, plan);
		        Chart.populateChartText('#some-table-id', plan);
		        // And do it again...
		        Chart.populateChartText('#some-table-id', plan);
		    	
		    	table = $('#some-table-id');
		    	trs = table.find('tr');
		        expect( table.size() ).toEqual( 1 );
		        expect( trs.size() ).toEqual( periods );
		    });

		});
		
	});
});
