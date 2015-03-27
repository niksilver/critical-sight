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
            
            expect( diamond.connector.fromX ).toEqual( sizer.left(start) );
            expect( diamond.connector.fromY ).toEqual( sizer.top(idx) + sizer.height );
            expect( diamond.connector.toX ).toEqual( sizer.left(start) );
            expect( diamond.connector.toY ).toEqual( sizer.top(idx) );
        });
    });
});