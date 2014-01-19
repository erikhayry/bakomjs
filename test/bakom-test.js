describe('Bakom.js init', function () {
	//get some html  
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
    	var textCSSonly, textWithSvgSupport;	
    	
    	beforeEach(function(){
    		
    		textCSSonly = new Bakom().init('.text', {
				backgroundSelector : '.holder',
			});

			textWithSvgSupport = new Bakom().init('.text', {
				backgroundSelector : '.holder',
				backgroundClipSupportOnly : false
			});


    	});

    		
		describe('background clip Support Only', function(){
			it('should have been defined and set', function(){

	    		expect(textCSSonly.hasBackgroundClipSupport).toBeDefined();

	    		//if background clip is supported
	    		if(textCSSonly.hasBackgroundClipSupport){
	    			expect(textCSSonly.hasBeenDrawn).toEqual(true);
	    			expect(textCSSonly.svgs).toEqual({});	
	    			expect(textCSSonly.backgroundElement).toBeDefined();
	    			expect(textCSSonly.textElement).toBeDefined();
	    		}

	    		else{
	    			expect(textCSSonly.hasBeenDrawn).toEqual(false);
	    			expect(textCSSonly.backgroundElement).not.toBeDefined();
	    			expect(textCSSonly.textElement).not.toBeDefined();
	    		}
    		})
		})

		describe('background clip and SVG Support ', function(){
			it('should have been defined and set', function(){

	    		expect(textWithSvgSupport.hasBeenDrawn).toEqual(true)

	    		if(textWithSvgSupport.hasBackgroundClipSupport){
	    			expect(textWithSvgSupport.svgs).toEqual({}); //no svgs should have been set	
	    		}
	    		
	    		else{
	    			expect(textWithSvgSupport.svgs).not.toEqual({});
	    			expect(textWithSvgSupport.svgs.clipPath).toEqual(jasmine.any(Object)); //a clip path element should have been created
	    			expect(textWithSvgSupport.svgs.image).toEqual(jasmine.any(Object)); //an image element should have been created
	    		}
	    	})
    	})   		
    })

	/*
		TODO add tests for reset and redraw
	 */


});  