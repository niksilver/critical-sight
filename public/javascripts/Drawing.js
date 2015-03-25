/**
 * Tools for building a Gantt chart.
 */

CriticalSight.Sizer = function(planStart, unitWidth, unitHeight) {
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
		return (start - planStart) * this.unitWidth;
	};

	/**
	 * Width of a task rectangle, where the task's duration is `dur`.
	 */
	this.width = function(dur) {
		return dur * this.unitWidth;
	};
};

CriticalSight.PeriodMaker = function(sizer) {
	'use strict';
	
	this.sizer = sizer;
	
	var taskStrokeColour = 'rgb(0,0,255)';
	var taskFillColour = 'rgb(128,128,255)';
	var taskStrokeWidth = 2;
	
	var bufferStrokeColour = 'rgb(64,64,64)';
	var bufferFillColour = 'rgb(192,192,192)';
	var bufferStrokeWidth = 2;
	
	/**
	 * A shape for a period (depends if it's zero-length or not).
	 * `type` should be "task" or "buffer"
	 */
	this.periodShape = function(type, idx, start, duration) {
		if (type == "buffer") {
			return this.bufferRect(idx, start, duration);
		} else if (duration === 0 ) {
			return this.taskDiamond(idx, start);
		} else {
			return this.taskRect(idx, start, duration);
		}
	};
	
	/**
	 * A diamond-shaped task, if zero-duration.
	 */
	this.taskDiamond = function(idx, start) {
		var halfHeight = sizer.height / 2;
		var halfWidth = halfHeight;
		var outline =
			'M ' + '0,0' +
			' l ' +  halfWidth + ',' +  halfHeight +
			' l ' + -halfWidth + ',' +  halfHeight +
			' l ' + -halfWidth + ',' + -halfHeight +
			' Z';
		var diamond = new fabric.Path( outline, {
			originX: 0, // To fix positioning bug
			originY: 0, // To fix positioning bug
			left : sizer.left(start),
			top : sizer.top(idx),
			fill: taskFillColour,
			stroke: taskStrokeColour,
			strokeWidth: taskStrokeWidth
		});
		return diamond;
	};
	
	/**
	 * A rectangular task.
	 */
	this.taskRect = function(idx, start, duration) {
		return new fabric.Rect({
			originX : 'left',
			originY : 'top',
			stroke: taskStrokeColour,
			strokeWidth: taskStrokeWidth,
			left : sizer.left(start),
			top : sizer.top(idx),
			height : sizer.height,
			width : sizer.width(duration),
			fill : taskFillColour
		});
	};
	
	/**
	 * A buffer
	 */
	this.bufferRect = function(idx, start, duration) {
		return new fabric.Rect({
			originX : 'left',
			originY : 'top',
			stroke: bufferStrokeColour,
			strokeWidth: bufferStrokeWidth,
			left : sizer.left(start),
			top : sizer.top(idx),
			height : sizer.height,
			width : sizer.width(duration),
			fill : bufferFillColour
		});
	};
};
