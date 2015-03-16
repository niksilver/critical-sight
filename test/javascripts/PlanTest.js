/**
 * Tests for the Plan prototype.
 */

describe("Plan", function() {
	
	var CS = CriticalSight;
	
	describe("taskList", function() {
		
		it("should contain the 0th task given a non-empty spec", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, duration: 1.0 }] };
			var p = new CS.Plan(spec);
			expect( p.taskList[0].id ).toEqual( 't0' );
		});
		
		it("should throw an error if there are no tasks in the spec", function() {
			expect( function(){ new CS.Plan({}); } ).toThrow();
		});
		
		it("should throw an error if no argument is given", function() {
			expect( function(){ new CS.Plan(); } ).toThrow();
		});
		
		it("should allow the tasks to be an empty array", function() {
			var spec = { tasks: [] };
			var p = new CS.Plan(spec);
			expect( p.taskList.length ).toEqual( 0 );
		});
		
		it("should require every task to have an id", function() {
			var spec = { tasks: [{ notAnId: 't0', start: 1.0, duration: 1.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow();
		});
		
		it("should require every task to have a start", function() {
			var spec = { tasks: [{ id: 't0', notAStart: 1.0, duration: 1.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow();
		});
		
		it("should allow a start of 0.0", function() {
			var spec = { tasks: [{ id: 't0', start: 0.0, duration: 1.0 }] };
			var p = new CS.Plan(spec);
			expect( p.taskList[0].start ).toEqual( 0.0 );
		});
		
		it("should require every task to have a duration", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, notADuration: 3.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow();
		});
	});
});