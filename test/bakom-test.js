describe('Bakom.js init', function () {  
	beforeEach(function(){
		window.__html__ = window.__html__ || {};
		document.body.innerHTML = __html__['test/bakom-test.html'];    	
	})

    it('should be defined globally', function () {
    	expect(Bakom).toBeDefined(); 
    });

    describe('bakom states', function(){    	
    	var text1;	
    	beforeEach(function(){
    		text1 = new Bakom();	
    	})

    	it('should have been defined and set', function(){
    		expect(text1.hasBeenDrawn).toEqual(false)
    		expect(text1.hasBackgroundClipSupport).toBeDefined();
    		expect(text1.svgs).toEqual(jasmine.any(Object));
    	})
    })  

    describe('bakom.init', function(){
    	var text1, text2;	
    	
    	beforeEach(function(){
    		text1 = new Bakom().init({
				backgroundSelector : '.holder',
				textSelector : '.text'
			});

			text2 = new Bakom().init({
				backgroundSelector : '.holder',
				textSelector : '.text',
				backgroundClipSupportOnly : false
			});		
    	});

    		
		describe('background clip Support Only', function(){
			it('should have been defined and set', function(){

	    		expect(text1.hasBackgroundClipSupport).toBeDefined();

	    		if(text1.hasBackgroundClipSupport){
	    			expect(text1.hasBeenDrawn).toEqual(true);
	    			expect(text1.svgs).toEqual({});	
	    			expect(text1.backgroundElement).toBeDefined();
	    			expect(text1.textElement).toBeDefined();
	    		}

	    		else{
	    			expect(text1.hasBeenDrawn).toEqual(false);
	    			expect(text1.backgroundElement).not.toBeDefined();
	    			expect(text1.textElement).not.toBeDefined();
	    		}
    		})
		})

		describe('background clip and SVG Support ', function(){
			it('should have been defined and set', function(){

	    		expect(text2.hasBeenDrawn).toEqual(true)

	    		if(text2.hasBackgroundClipSupport){
	    			expect(text2.svgs).toEqual({});	
	    		}
	    		
	    		else{
	    			expect(text2.svgs).not.toEqual({});
	    			expect(text2.svgs.clipPath).toEqual(jasmine.any(Object));
	    			expect(text2.svgs.image).toEqual(jasmine.any(Object));
	    		}
	    	})
    	})   		
    })
});  