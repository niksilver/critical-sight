/**
 * Make dependency arrows.
 */
CriticalSight.DependencyMaker = function(sizer) {
    'use strict';
    
    this.sizer = sizer;

    var arrowStrokeColour = 'rgb(0,0,0)';
    var arrowFillColour = 'rgb(0,0,0)';
    var arrowStrokeWidth = 2;
    
    /**
     * A shape for a dependency link between
     * two graphical objects.
     */
    this.dependency = function(fromElt, toElt) {
        var fromBounds = fromElt.getBounds();
        var toBounds = toElt.getBounds();
        var startX = fromElt.connector.fromX;
        var startY = fromElt.connector.fromY;
        var endX = toElt.connector.toX;
        var endY = toElt.connector.toY;
        
        var controlX = (startX == endX) ? (startX + this.sizer.unitWidth/5) : endX;
        var controlY = (startX == endX) ? (startY + (endY - startY)/2) : startY;
        
        var arrow = new createjs.Shape();
        arrow.graphics.beginStroke(arrowStrokeColour).
            setStrokeStyle(arrowStrokeWidth).
            moveTo(startX, startY).
            quadraticCurveTo(controlX, controlY, endX, endY);
        this._addArrowHead(arrow, endX, endY);
        CriticalSight.Util.setBounds(arrow,
                [startX], [startY], [endX - startX], [endY - startY]);
        return arrow;
    };
    
    this._addArrowHead = function(arrow, beginX, beginY) {
        var headDepth = this.sizer.unitHeight/3;
        var halfWidth = this.sizer.unitWidth/40;
        arrow.graphics.
            beginFill(arrowFillColour).
            beginStroke(arrowStrokeColour).
            setStrokeStyle(arrowStrokeWidth).
            moveTo(beginX, beginY).
            lineTo(beginX - halfWidth, beginY - headDepth).
            lineTo(beginX + halfWidth, beginY - headDepth).
            closePath();
    };
};
