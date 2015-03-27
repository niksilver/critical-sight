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
	 * `type` should be "task" or "buffer".
	 * `idx` is the row index on the chart.
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
	    var startX = sizer.left(start);
	    var startY = sizer.top(idx);
        var halfHeight = sizer.height / 2;
        var halfWidth = halfHeight;

        var diamond = new createjs.Shape();
	    diamond.graphics.beginFill(taskFillColour).
	        beginStroke(taskStrokeColour).
	        setStrokeStyle(taskStrokeWidth).
	        moveTo(startX, startY).
	        lineTo(startX + halfWidth, startY + halfHeight).
	        lineTo(startX, startY + 2*halfHeight).
	        lineTo(startX - halfWidth, startY + halfHeight).
	        closePath();
	    CriticalSight.Util.setBounds(diamond,
	            [startX - halfWidth], [startY], [2*halfWidth], [2*halfHeight]);
	    return diamond;
	};
	
	/**
	 * A rectangular task.
	 */
	this.taskRect = function(idx, start, duration) {
	    var rect = new createjs.Shape();
	    rect.graphics.beginFill(taskFillColour).
	        beginStroke(taskStrokeColour).
	        setStrokeStyle(taskStrokeWidth).
	        drawRect(
	            sizer.left(start),
	            sizer.top(idx),
	            sizer.width(duration),
                sizer.height);
	    CriticalSight.Util.setBounds(rect, [sizer.left(start)], [sizer.top(idx)], [sizer.width(duration)], [sizer.height]);
	    return rect;
	};
	
	/**
	 * A buffer
	 */
	this.bufferRect = function(idx, start, duration) {
        var rect = new createjs.Shape();
        rect.graphics.beginFill(bufferFillColour).
            beginStroke(bufferStrokeColour).
            setStrokeStyle(bufferStrokeWidth).
            drawRect(
                sizer.left(start),
                sizer.top(idx),
                sizer.width(duration),
                sizer.height);
        CriticalSight.Util.setBounds(rect, [sizer.left(start)], [sizer.top(idx)], [sizer.width(duration)], [sizer.height]);
        return rect;
	};
};

CriticalSight.DependencyMaker = function(sizer) {
    'use strict';
    
    this.sizer = sizer;
    
    /**
     * A shape for a dependency link between
     * two graphical objects.
     */
    this.dependency = function(fromElt, toElt) {
        var fromBounds = fromElt.getBounds();
        var toBounds = toElt.getBounds();
        var startX = fromBounds.x + fromBounds.width;
        var startY = fromBounds.y + fromBounds.height/2;
        var endX = toBounds.x;
        var endY = toBounds.y;
        
        var arrow = new createjs.Shape();
        arrow.graphics.beginStroke('rgb(0,0,0)'). // Line colour
            setStrokeStyle(2). // Line width
            moveTo(startX, startY).
            lineTo(endX, endY);
        CriticalSight.Util.setBounds(arrow,
                [startX], [startY], [endX - startX], [endY - startY]);
        return arrow;
    };
};
