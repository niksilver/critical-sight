/**
 * Tests for the Plan prototype.
 */

describe("Plan", function() {
	
	describe("taskList", function() {
		
		it("should contain the 0th task given a non-empty spec", function() {
			var spec = { tasks: [{ id: 't0' }] };
			var p = new Plan(spec);
			expect( p.taskList[0] ).toEqual( { id: 't0' } );
		});
		
		it("should throw an error if there are no tasks in the spec", function() {
			expect( function(){ new Plan({}); } ).toThrow();
		});
		
		it("should throw an error if no argument is given", function() {
			expect( function(){ new Plan(); } ).toThrow();
		});
		
		it("should allow the tasks to be an empty array", function() {
			var spec = { tasks: [] };
			var p = new Plan(spec);
			expect( p.taskList.length ).toEqual( 0 );
		});
		
		it("should throw an error if a task does not have an id", function() {
			var spec = { tasks: [{ notAnId: 't0' }] };
			expect( function(){ new Plan(spec); } ).toThrow();
		});
	});
});