define(['CriticalSight', 'easeljs'], function(CS) {
    describe("Util", function() {
	    'use strict';
	    
	    describe("setBounds", function() {
	        
	        it("should set the bounds of a shape if there's one value on each side (1)", function() {
	            var s = new createjs.Shape();
	            s.graphics.rect(32, 45, 200, 100);
	            
	            // Bounds should not be set initially.
	            expect( s.getBounds() ).toBeNull();
	            
	            CS.Util.setBounds(s, [32], [45], [200], [100]);
	            
	            expect( s.getBounds() ).not.toBeNull();
	            expect( s.getBounds().x ).toEqual( 32 );
	            expect( s.getBounds().y ).toEqual( 45 );
	            expect( s.getBounds().width ).toEqual( 200 );
	            expect( s.getBounds().height ).toEqual( 100 );
	        });
	        
	        it("should set the bounds of a shape if there's one value on each side (2 - to avoid faking)", function() {
	            var s = new createjs.Shape();
	            s.graphics.rect(44, 55, 202, 101);
	            
	            // Bounds should not be set initially.
	            expect( s.getBounds() ).toBeNull();
	            
	            CS.Util.setBounds(s, [44], [55], [202], [101]);
	            
	            expect( s.getBounds() ).not.toBeNull();
	            expect( s.getBounds().x ).toEqual( 44 );
	            expect( s.getBounds().y ).toEqual( 55 );
	            expect( s.getBounds().width ).toEqual( 202 );
	            expect( s.getBounds().height ).toEqual( 101 );
	        });
	        
	        it("should set the bounds of a shape if the correct value is first of two", function() {
	            var s = new createjs.Shape();
	            s.graphics.rect(32, 45, 200, 100);
	            
	            // Bounds should not be set initially.
	            expect( s.getBounds() ).toBeNull();
	            
	            CS.Util.setBounds(s, [32, 33], [45, 46], [200, 199], [100, 99]);
	            
	            expect( s.getBounds() ).not.toBeNull();
	            expect( s.getBounds().x ).toEqual( 32 );
	            expect( s.getBounds().y ).toEqual( 45 );
	            expect( s.getBounds().width ).toEqual( 200 );
	            expect( s.getBounds().height ).toEqual( 100 );
	        });
	        
	        it("should set the bounds of a shape if the correct value is second of two", function() {
	            var s = new createjs.Shape();
	            s.graphics.rect(32, 45, 200, 100);
	            
	            // Bounds should not be set initially.
	            expect( s.getBounds() ).toBeNull();
	            
	            CS.Util.setBounds(s, [33, 32], [46, 45], [199, 200], [99, 100]);
	            
	            expect( s.getBounds() ).not.toBeNull();
	            expect( s.getBounds().x ).toEqual( 32 );
	            expect( s.getBounds().y ).toEqual( 45 );
	            expect( s.getBounds().width ).toEqual( 200 );
	            expect( s.getBounds().height ).toEqual( 100 );
	        });
	    });
	});
});