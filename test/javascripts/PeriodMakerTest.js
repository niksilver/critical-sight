describe("PeriodMaker", function() {
    'use strict';
    
    var CS = CriticalSight;
    
    describe("taskDiamond", function() {
        it("should add a connector point correctly", function() {
            var sizer = new CS.Sizer(55, 50, 10);
            var pMaker = new CS.PeriodMaker(sizer);
            
            var idx = 3;
            var start = 56;
            var diamond = pMaker.taskDiamond(idx, start);
            
            expect( diamond.connector.fromX ).toEqual( diamond.getBounds().x + diamond.getBounds().width );
            expect( diamond.connector.fromY ).toEqual( sizer.top(idx) + sizer.unitHeight/2 );
            expect( diamond.connector.toX ).toEqual( sizer.left(start) );
            expect( diamond.connector.toY ).toEqual( sizer.top(idx) );
        });
    });
    
    describe("taskRect", function() {
        it("should add a connector point correctly", function() {
            var sizer = new CS.Sizer(55, 50, 10);
            var pMaker = new CS.PeriodMaker(sizer);
            
            var idx = 3;
            var start = 56;
            var duration = 4;
            var rect = pMaker.taskRect(idx, start, duration);
            
            expect( rect.connector.fromX ).toEqual( sizer.left(start) + sizer.width(duration) );
            expect( rect.connector.fromY ).toEqual( sizer.top(idx) + sizer.unitHeight/2 );
            expect( rect.connector.toX ).toEqual( sizer.left(start) + sizer.width(1)/5 );
            expect( rect.connector.toY ).toEqual( sizer.top(idx) );
        });
    });
    
    describe("bufferRect", function() {
        it("should add a connector point correctly", function() {
            var sizer = new CS.Sizer(55, 50, 10);
            var pMaker = new CS.PeriodMaker(sizer);
            
            var idx = 3;
            var start = 56;
            var duration = 4;
            var rect = pMaker.bufferRect(idx, start, duration);
            
            expect( rect.connector.fromX ).toEqual( sizer.left(start) + sizer.width(duration) );
            expect( rect.connector.fromY ).toEqual( sizer.top(idx) + sizer.unitHeight/2 );
            expect( rect.connector.toX ).toEqual( sizer.left(start) + sizer.width(1)/5 );
            expect( rect.connector.toY ).toEqual( sizer.top(idx) );
        });
    });
});