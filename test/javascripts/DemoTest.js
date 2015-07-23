/**
 * Demo of a test that runs with require.js.
 */

define(['mymodule'], function(mymodule) {
	describe('Testing require.js in karma', function() {
		it('Should be able to read the module property', function() {
			expect(mymodule.prop).toEqual('My prop');
		});
	});
});
