/**
 * Static functions for dealing with Plans.
 */

define(['Plan', 'jquery'], function(Plan, $) {
	return {
		/**
		 * Convert text to a Plan.
		 * @param text  The text that describes plan.
		 * @param fn    The callback function fn(plan) which processes the plan
		 *              when it's been generated.
		 */
		textToPlan: function(text, fn) {
	        $.post('/readPlan',
	                "text=" + encodeURI(text),
	                function(spec) {
	        			var plan = new Plan(spec);
	                    fn(plan);
	                });
		}
	};
});
