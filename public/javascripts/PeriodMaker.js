/**
 * Tools for building a Gantt chart.
 * 
 * Each shape will have connector points, in a property:
 * connector: {fromX: 99, fromY: 99, toX: 99, toY: 99}.
 */

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
	    diamond.set({ connector: {
    	        fromX: startX + halfWidth,
    	        fromY: startY + 2*halfHeight,
    	        toX: startX,
    	        toY: startY
	    }});
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
	    rect.set({ connector: {
	            fromX: sizer.left(start) + sizer.width(duration),
	            fromY: sizer.top(idx) + sizer.height/2,
	            toX: sizer.left(start) + sizer.unitWidth/5,
	            toY: sizer.top(idx)
	    }});
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
