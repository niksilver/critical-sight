/**
 * Tests for the Plan class.
 */

describe("Plan", function() {
	
	var CS = CriticalSight;
	
	describe("contructor", function() {
		
		it("should throw an error if there are no tasks in the spec", function() {
			expect( function(){ new CS.Plan({}); } ).toThrow();
		});
		
		it("should throw an error if no argument is given", function() {
			expect( function(){ new CS.Plan(); } ).toThrow();
		});
	});
	
	describe("taskList", function() {
		
		it("should contain the 0th task given a non-empty spec", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, duration: 1.0 }] };
			var p = new CS.Plan(spec);
			expect( p.taskList[0].id ).toEqual( 't0' );
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
	
	describe("start", function() {
		
		it("should be undefined if there are no tasks", function() {
			var spec = { tasks: [] };
			var p = new CS.Plan(spec);
			expect( p.start ).toBeUndefined();
		});

		it("should give the earliest task start as the plan start (1)", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.start ).toEqual( 1.0 );
		});

		it("should give the earliest task start as the plan start (2 - to avoid faking)", function() {
			var spec = { tasks: [
			                     { id: 't0', start: 2.0, duration: 3.0 },
			                     { id: 't1', start: 0.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.start ).toEqual( 0.0 );
		});
	});
	
	describe("end", function() {
		
		it("should be undefined if there are no tasks", function() {
			var spec = { tasks: [] };
			var p = new CS.Plan(spec);
			expect( p.end ).toBeUndefined();
		});

		it("should give the latest task end as the plan end (1)", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 1.0 + 3.0 );
		});

		it("should give the latest task end as the plan end (2 - to avoid faking)", function() {
			var spec = { tasks: [
			                     { id: 't0', start: 2.0, duration: 2.0 },
			                     { id: 't1', start: 1.0, duration: 4.0 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 1.0 + 4.0 );
		});

		it("should give the latest task end when it's also not the earliest task", function() {
			var spec = { tasks: [
			                     { id: 't0', start: 2.0, duration: 2.0 },
			                     { id: 't1', start: 3.5, duration: 1.5 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 3.5 + 1.5 );
		});
	});
	
	describe("duration", function() {
		
		it("should be undefined if there are no tasks", function() {
			var spec = { tasks: [] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toBeUndefined();
		});

		it("should give correct duration if one task", function() {
			var spec = { tasks: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toEqual( 3.0 );
		});

		it("should give correct duration if two tasks", function() {
			var spec = { tasks: [
			                     { id: 't0', start: 2.0, duration: 3.0 },
			                     { id: 't1', start: 3.5, duration: 1.5 }] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toEqual( (3.5 + 1.5) - 2.0 );
		});
	});
	
	describe("task", function() {
		
		it("should reference a task by its id", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var spec = { tasks: [t0] };
			var p = new CS.Plan(spec);
			expect( p.task('t0') ).toEqual( t0 );
		});
		
		it("should return undefined if no such id", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var spec = { tasks: [t0] };
			var p = new CS.Plan(spec);
			expect( p.task('tNothing') ).toBeUndefined();
		});
	});
});
