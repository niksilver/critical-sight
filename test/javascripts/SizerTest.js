/**
 * Tests for the Sizer prototype
 */

describe("Sizer", function() {
	
	var CS = CriticalSight;
	
	it("should position the top of the zero-indexed task correctly", function() {
		var s = new CS.Sizer(10, 999);
		expect( s.top(0) ).toEqual( 10/2 );
	});
	
	it("should position the top of the 1-indexed task correctly", function() {
		var s = new CS.Sizer(10, 999);
		expect( s.top(1) ).toEqual( 10/2 + 10 + 10/2 );
	});
	
	it("should position the left of a task mindful of the plan start time", function() {
		// First create a zero-start sizer and take a measurement from that.
		// Them create a non-zero-start sizer and compare
		var s0 = new CS.Sizer(10, 999, 0);
		var left0 = s0.left(0);
		var s35 = new CS.Sizer(10, 999, 35);
		var left35 = s35.left(35);
		expect( left35 ).toEqual( left0 );
	});
});
