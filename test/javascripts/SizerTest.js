/**
 * Tests for the Sizer prototype
 */

describe("Sizer", function() {
	
	it("should position the top of the zero-indexed task correctly", function() {
		var s = new Sizer(10, 999);
		expect( s.top(0) ).toEqual( 10/2 );
	});
	
	it("should position the top of the 1-indexed task correctly", function() {
		var s = new Sizer(10, 999);
		expect( s.top(1) ).toEqual( 10/2 + 10 + 10/2 );
	});
});
