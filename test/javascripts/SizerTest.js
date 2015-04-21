/**
 * Tests for the Sizer prototype
 */

describe("Sizer", function() {
	
	var CS = CriticalSight;
	
	describe("constructorFn", function() {
	    it("should reject the first argument if it's a number", function() {
	        expect( function(){ new CS.Sizer(11, 22, 33); } ).toThrow();
	    });
	});
	
	describe("top", function() {
    	it("should position the top of the zero-indexed task correctly", function() {
            var plan = CS.TestPlans.dummyPlan(1, 0);
    		var s = new CS.Sizer(plan, 999, 10);
    		expect( s.top(0) ).toEqual( 10/2 );
    	});
    	
    	it("should position the top of the 1-indexed task correctly", function() {
            var plan = CS.TestPlans.dummyPlan(1, 0);
    		var s = new CS.Sizer(plan, 999, 10);
    		expect( s.top(1) ).toEqual( 10/2 + 10 + 10/2 );
    	});
	});
	
	describe("left", function() {
    	it("should position the left of a task mindful of the plan start time", function() {
    		// First create a zero-start sizer and take a measurement from that.
    		// Them create a non-zero-start sizer and compare
    	    
            var plan0 = CS.TestPlans.dummyPlan(1, 0);
    		var s0 = new CS.Sizer(plan0, 999, 10);
    		var left0 = s0.left(0);
    		
            var plan35 = CS.TestPlans.dummyPlan(1, 35);
    		var s35 = new CS.Sizer(plan35, 999, 10);
    		var left35 = s35.left(35);
    		expect( left35 ).toEqual( left0 );
    	});
	});
	
	describe("chartHeight", function() {
	    it("should calculate the chart height correctly for several tasks", function() {
	        var plan = CS.TestPlans.dummyPlan(5, 999);
	        var s = new CS.Sizer(plan, 888, 11);
	        
	        var totalBars = 5 * 11;
	        var totalPadding = s.topPadding + (5-1)*s.midPadding + s.bottomPadding;
	        
	        expect( s.chartHeight ).toEqual( totalBars +totalPadding );
	    });
	});
});
