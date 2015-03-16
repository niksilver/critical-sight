/**
 * Tools for building a Gantt chart.
 */

CriticalSight.Sizer = function(unitHeight, unitWidth) {
	'use strict';
	
	this.topPadding = unitHeight * 0.5;
	this.height = unitHeight;
	this.midPadding = unitHeight * 0.5;
	this.unitWidth = unitWidth;

	/**
	 * Top of a task rectangle, where the task is index `idx`.
	 */
	this.top = function(idx) {
		return (this.height + this.midPadding) * idx + this.topPadding;
	};

	/**
	 * Left of a task rectangle, where the start is at time `start`.
	 */
	this.left = function(start) {
		return start * this.unitWidth;
	};

	/**
	 * Width of a task rectangle, where the task's duration is `dur`.
	 */
	this.width = function(dur) {
		return dur * this.unitWidth;
	};
};

CriticalSight.TaskMaker = function(sizer) {
	'use strict';
	
	this.sizer = sizer;
	this.taskRect = function(idx, start, duration) {
		return new fabric.Rect({
			originX : 'left',
			originY : 'top',
			stroke: 'rgb(255,0,0)',
			strokeWidth: 2,
			left : sizer.left(start),
			top : sizer.top(idx),
			height : sizer.height,
			width : sizer.width(duration),
			fill : 'rgba(255,0,0,0.5)'
		});
	};
};
