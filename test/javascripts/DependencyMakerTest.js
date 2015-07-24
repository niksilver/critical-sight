describe("DependencyMaker", function() {
    'use strict';
	
	describe("dependency", function() {
		
		it("should give a shape within bounds for two tasks in direct sequence", function() {
			var p = new CS.Plan({
				periods: [
				    { id: "t1",
				      start: 0,
				      duration: 1.0,
				      type: "task"},
			        { id: "t2",
		        	  start: 1.0,
					  duration: 1.0,
					  type: "task"}
		        ],
				dependencies: [["t1", "t2"]]
			});
			
			var unitWidth = 50;
			var sizer = new CS.Sizer(p, unitWidth, 10);
			var perMaker = new CS.PeriodMaker(sizer);
            var t1Rect = perMaker.taskRect(0, 0, 1);
            var t2Rect = perMaker.taskRect(1, 1, 1);
            var depMaker = new CS.DependencyMaker(sizer);
			var graphicDep = depMaker.dependency( t1Rect, t2Rect );
			
			var depRect = graphicDep.getBounds();
            t1Rect = t1Rect.getBounds();
            t2Rect = t2Rect.getBounds();
			// Top
            expect( depRect.y                  ).toEqual( t1Rect.y + (t1Rect.height / 2) );
            // Bottom
            expect( depRect.y + depRect.height ).toEqual( t2Rect.y );
            // Left
            expect( depRect.x                  ).toEqual( t2Rect.x );
            // Right
            expect( depRect.x + depRect.width >= t2Rect.x ).toBeTruthy();
            expect( depRect.x + depRect.width ).toBeLessThan( t2Rect.x + unitWidth/4 );
		});
	});
});
