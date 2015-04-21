/**
 * Tests for the TestPlans class.
 */

describe("TestPlans", function() {
	
	var CS = CriticalSight;
	
	describe("emptyPlan", function() {
		
		it("should generate a Plan with no tasks", function() {
		    var plan = CS.TestPlans.emptyPlan;
		    expect( plan.periodList.length ).toEqual( 0 );
		});
	});
    
    describe("dummyPlan", function() {
        
        it("should generate a Plan with given number of tasks (1)", function() {
            var plan = CS.TestPlans.dummyPlan(5);
            expect( plan.periodList.length ).toEqual( 5 );
        });
        
        it("should generate a Plan with given number of tasks (2 - to avoid faking)", function() {
            var plan = CS.TestPlans.dummyPlan(7);
            expect( plan.periodList.length ).toEqual( 7 );
        });
        
        it("should generate a Plan with a given start time (1)", function() {
            var plan = CS.TestPlans.dummyPlan(7, 3);
            expect( plan.start ).toEqual( 3 );
        });
        
        it("should generate a Plan with a given start time (2 - to avoid faking)", function() {
            var plan = CS.TestPlans.dummyPlan(7, 4);
            expect( plan.start ).toEqual( 4 );
        });
    });

});
