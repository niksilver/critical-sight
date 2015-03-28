/**
 * Make dependency arrows.
 */
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
        var startX = fromElt.connector.fromX;
        var startY = fromElt.connector.fromY;
        var endX = toElt.connector.toX;
        var endY = toElt.connector.toY;
        
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
