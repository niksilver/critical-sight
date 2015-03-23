/**
 * Tests for the Plan class.
 */

describe("Plan", function() {
	
	var CS = CriticalSight;
	
	describe("constructorFn", function() {
		
		it("should throw an error if there are no tasks in the spec", function() {
			expect( function(){ new CS.Plan({}); } ).toThrow();
		});
		
		it("should throw an error if no argument is given", function() {
			expect( function(){ new CS.Plan(); } ).toThrow();
		});
		
		it("should be okay if there are no dependencies", function() {
			var spec = { periods: [] };
			new CS.Plan(spec);
		});
	});
	
	describe("taskList", function() {
		
		it("should contain the 0th task given a non-empty spec", function() {
			var spec = { periods: [{ id: 't0', start: 1.0, duration: 1.0 }] };
			var p = new CS.Plan(spec);
			expect( p.periodsList[0].id ).toEqual( 't0' );
		});
		
		it("should allow the period to be an empty array", function() {
			var spec = { periods: [] };
			var p = new CS.Plan(spec);
			expect( p.periodsList.length ).toEqual( 0 );
		});
		
		it("should require every period to have an id", function() {
			var spec = { periods: [{ notAnId: 't0', start: 1.0, duration: 1.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Found a period without an id"));
		});
		
		it("should require every period to have a start", function() {
			var spec = { periods: [{ id: 't0', notAStart: 1.0, duration: 1.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Found a period without a start"));
		});
		
		it("should allow a start of 0.0", function() {
			var spec = { periods: [{ id: 't0', start: 0.0, duration: 1.0 }] };
			var p = new CS.Plan(spec);
			expect( p.periodsList[0].start ).toEqual( 0.0 );
		});
		
		it("should require every period to have a duration", function() {
			var spec = { periods: [{ id: 't0', start: 1.0, notADuration: 3.0 }] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Found a period without a duration"));
		});
	});
	
	describe("start", function() {
		
		it("should be undefined if there are no periods", function() {
			var spec = { periods: [] };
			var p = new CS.Plan(spec);
			expect( p.start ).toBeUndefined();
		});

		it("should give the earliest period start as the plan start (1)", function() {
			var spec = { periods: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.start ).toEqual( 1.0 );
		});

		it("should give the earliest period start as the plan start (2 - to avoid faking)", function() {
			var spec = { periods: [
			                     { id: 't0', start: 2.0, duration: 3.0 },
			                     { id: 't1', start: 0.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.start ).toEqual( 0.0 );
		});
	});
	
	describe("end", function() {
		
		it("should be undefined if there are no periods", function() {
			var spec = { periods: [] };
			var p = new CS.Plan(spec);
			expect( p.end ).toBeUndefined();
		});

		it("should give the latest period end as the plan end (1)", function() {
			var spec = { periods: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 1.0 + 3.0 );
		});

		it("should give the latest period end as the plan end (2 - to avoid faking)", function() {
			var spec = { periods: [
			                     { id: 't0', start: 2.0, duration: 2.0 },
			                     { id: 't1', start: 1.0, duration: 4.0 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 1.0 + 4.0 );
		});

		it("should give the latest period end when it's also not the earliest period", function() {
			var spec = { periods: [
			                     { id: 't0', start: 2.0, duration: 2.0 },
			                     { id: 't1', start: 3.5, duration: 1.5 }] };
			var p = new CS.Plan(spec);
			expect( p.end ).toEqual( 3.5 + 1.5 );
		});
	});
	
	describe("duration", function() {
		
		it("should be undefined if there are no periods", function() {
			var spec = { periods: [] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toBeUndefined();
		});

		it("should give correct duration if one period", function() {
			var spec = { periods: [{ id: 't0', start: 1.0, duration: 3.0 }] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toEqual( 3.0 );
		});

		it("should give correct duration if two periods", function() {
			var spec = { periods: [
			                     { id: 't0', start: 2.0, duration: 3.0 },
			                     { id: 't1', start: 3.5, duration: 1.5 }] };
			var p = new CS.Plan(spec);
			expect( p.duration ).toEqual( (3.5 + 1.5) - 2.0 );
		});
	});
	
	describe("period", function() {
		
		it("should reference a period by its id", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var spec = { periods: [t0] };
			var p = new CS.Plan(spec);
			expect( p.period('t0') ).toEqual( t0 );
		});
		
		it("should return undefined if no such id", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var spec = { periods: [t0] };
			var p = new CS.Plan(spec);
			expect( p.period('tNothing') ).toBeUndefined();
		});
	});
	
	describe("dependencyIDs", function() {
		
		it("should give an empty dependency IDs array if no dependencies specified", function() {
			var spec = { periods: [] };
			var p = new CS.Plan(spec);
			expect( p.dependencyIDs ).toEqual( [] );
		});
		
		it("should give a non-empty dependency IDs array if some dependencies specified", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var spec = { periods: [t0, t1], dependencies: [['t0', 't1']] };
			var p = new CS.Plan(spec);
			expect( p.dependencyIDs[0] ).toEqual( ['t0', 't1'] );
		});
		
		it("should give an error if some first dependency id is not a task ID", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var t2 = { id: 't2', start: 5.0, duration: 2.0 };
			var t3 = { id: 't3', start: 7.0, duration: 2.0 };
			var spec = { periods: [t0, t1, t2], dependencies: [['t0', 't1'], ['t3', 't2']] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.UndefinedTaskError("Undefined period id 't3' among the dependencies"));
		});
		
		it("should give an error if some second dependency id is not a task ID", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var t2 = { id: 't2', start: 5.0, duration: 2.0 };
			var t4 = { id: 't4', start: 7.0, duration: 2.0 };
			var spec = { periods: [t0, t1, t2], dependencies: [['t0', 't1'], ['t2', 't4']] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.UndefinedTaskError("Undefined period id 't4' among the dependencies"));
		});
		
		it("should give an error if some so-called pair is not an array", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var spec = { periods: [t0, t1], dependencies: [['t0', 't1'], 'Hello!'] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Expected a period id pair, but found 'Hello!'"));
		});
		
		it("should give an error if some so-called pair doesn't have two elements (1)", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var t2 = { id: 't2', start: 5.0, duration: 2.0 };
			var spec = { periods: [t0, t1], dependencies: [['t0', 't1', 't2']] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Dependency 0 needs two elements, found 3"));
		});
		
		it("should give an error if some so-called pair doesn't have two elements (2 - to avoid faking)", function() {
			var t0 = { id: 't0', start: 1.0, duration: 3.0 };
			var t1 = { id: 't1', start: 3.0, duration: 2.0 };
			var t2 = { id: 't2', start: 5.0, duration: 2.0 };
			var t3 = { id: 't3', start: 7.0, duration: 2.0 };
			var spec = { periods: [t0, t1, t2, t3],
					dependencies: [['t0', 't1'], ['t0', 't2'], ['t3']] };
			expect( function(){ new CS.Plan(spec); } ).toThrow(
					new CS.BadlyDefinedObjectError("Dependency 2 needs two elements, found 1"));
		});
	});
});
