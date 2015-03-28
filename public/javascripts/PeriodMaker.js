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
    	        fromY: startY + halfHeight,
    	        toX: startX,
    	        toY: startY
	    }});
	    return diamond;
	};
	
	/**
	 * A rectangular task.
	 */
	this.taskRect = function(idx, start, duration) {
	    return this._rect(idx, start, duration, taskFillColour, taskStrokeColour, taskStrokeWidth);
	};
	
	/**
	 * A buffer
	 */
	this.bufferRect = function(idx, start, duration) {
        return this._rect(idx, start, duration, bufferFillColour, bufferStrokeColour, bufferStrokeWidth);
	};
    
    this._rect = function(idx, start, duration, fillColour, strokeColour, strokeWidth) {
        var rect = new createjs.Shape();
        var left = sizer.left(start);
        var top = sizer.top(idx);
        var width = sizer.width(duration);
        var height = sizer.height;
        rect.graphics.beginFill(fillColour).
            beginStroke(strokeColour).
            setStrokeStyle(strokeWidth).
            drawRect(left, top, width, height);
        CriticalSight.Util.setBounds(rect, [left], [top], [width], [height]);
        rect.set({ connector: {
                fromX: left + width,
                fromY: top + height/2,
                toX: left + sizer.unitWidth/5,
                toY: top
        }});
        return rect;
    };
};
