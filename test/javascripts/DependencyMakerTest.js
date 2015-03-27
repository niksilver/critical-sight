xdescribe("DependencyMaker", function() {
	
	var CS = CriticalSight;
	
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
			var sizer = new CS.Sizer(0, unitWidth, 10);
			var perMaker = new CS.PeriodMaker(sizer);
            var t1Rect = perMaker.taskRect(0, 0, 1);
            var t2Rect = perMaker.taskRect(1, 1, 1);
            var depMaker = new CS.DependencyMaker(sizer);
			var graphicDep = depMaker.dependency( t1Rect, t2Rect );
			
			var depRect = graphicDep.getBoundingRect();
            //console.log("t1Rect.top = " + t1Rect.top);
            //console.log("t1Rect.height = " + t1Rect.height);
			// Top
            expect( depRect.top                  ).toEqual( t1Rect.top + (t1Rect.height / 2) );
            // Bottom
            expect( depRect.top + depRect.height ).toEqual( t2Rect.top );
            // Left
            expect( depRect.left                 ).toEqual( t1Rect.left + t1Rect.width );
            // Right
            expect( depRect.left + depRect.width ).toBeGreaterThan( t2Rect.left );
            expect( depRect.left + depRect.width ).toBeLessThan( t2Rect.left + unitWidth/4 );
		});
	});
});
