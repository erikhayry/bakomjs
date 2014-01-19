
/*
 * @preserve
 * bakom.js 1.1
 * http://erikportin.com/bakomjs
 *
 * Copyright 2013 Erik Portin
 * Released under the MIT license
 * https://github.com/erikportin/bakomjs/blob/master/LICENCE.md
 */

/**
 * define the global Bakom Variable as a class.
 */
window.Bakom = function(){

  	var bakom = this,

  		//background and text properties
  		BgProperties = {},
  		TextProperties, 

  		//varaibales only needed when using svgs
  		ClipPathId = '', //id connecting svg and clip path
  		OriginalText, //store the original text of element to be able to reset later

  		//set default values
  		Defaults = {
			backgroundSelector : 'body',
			textSelector : '',
			styleClass : '',
			dy : '', //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
			dx : '', //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dx
			backgroundClipSupportOnly : true,
			debug : false
		};
		
		 
  		/**
  		 * tests if the browser supports background clip support
  		 * @return {Boolean}
  		 */
		var hasBackgroundClipSupport = function(){
			//check for background clip support
			var	_testEl = document.createElement( "x-test" );			
			return 	typeof _testEl.style.webkitBackgroundClip !== "undefined" && ( _testEl.style.webkitBackgroundClip = "text", _testEl.style.webkitBackgroundClip === "text" ) ||
					typeof _testEl.style.backgroundClip !== "undefined" && ( _testEl.style.backgroundClip = "text", _testEl.style.backgroundClip === "text" )	
		}, 

		/**
		 * setup background element and text element properties if they exists and are well formatted
		 *
		 * 	Available Configure settings and Defaults 
		 * 	backgroundSelector : 'body',
			textSelector : '',
			styleClass : '',
			dy : '',
			dx : '',
			backgroundClipSupportOnly : true,
			debug : false
		 * 
		 * @param  {String} textElementSelector Selector for text element
		 * @param  {Object} configure           Configure setup
		 * @return {Boolean} success            setup done
		 */
		setup = function(textElementSelector, configure){

			/**
			 * get background of background element
			 * @return {Boolean} success Background properties set
			 */
			var _setBackground = function(){

				/**
				 * set background image properties
				 * @return {Boolean} success Background Image properties set
				 */
				var _setBackgroundImageProperties = function(){
					
					/*
						TODO: add support for local and multiple images
					*/
			    		var _src = document.defaultView.getComputedStyle(BgProperties.element, null).getPropertyValue('background-image'),
			    			_xy = '',
			    			_size = [],
			    			_backgroundAttachment = document.defaultView.getComputedStyle(BgProperties.element, null).getPropertyValue('background-attachment');

			    		//for non background clip support check what type of background repeat and attachment properties values	are set
			        	if(!Defaults.backgroundClipSupportOnly){
			        		var _backgroundRepeat = document.defaultView.getComputedStyle(BgProperties.element, null).getPropertyValue('background-repeat');
			        		
			        		if(_backgroundRepeat !== 'no-repeat' && Defaults.debug){
			        			console.warn('BAKOM.JS: background-repeat is set to "' + _backgroundRepeat + '" which can cause issues for browsers not supporting Background Clip. Set property to "no-repeat" to avoid this warning.')
			        		}

			        		if(_backgroundAttachment !== 'scroll' && Defaults.debug){
			        			console.warn('BAKOM.JS: background-attachment is set to "' + _backgroundAttachment + '" which is not supported. Set property to "scroll" to avoid this warning.')
			        		}
			        	}
				     
				     	//if background image get url
				        if(_src && _src !== 'none') {
				        	_xy = document.defaultView.getComputedStyle(BgProperties.element, null).getPropertyValue('background-position').split(' ');
			        		_size = document.defaultView.getComputedStyle(BgProperties.element, null).getPropertyValue('background-size').split(' ');
				        	_src = _src.slice(_src.indexOf('url(') + 4, _src.lastIndexOf(')'));

				        	BgProperties.pos = _getBackgroundBoxPosition();

				        	//if position fixed reset top and left pos to 0 to make it work.
				        	if(_backgroundAttachment === 'fixed'){
				        		TextProperties.pos.top = 0;
				        		TextProperties.pos.left = 0;

				        		BgProperties.pos.top = 0;
				        		BgProperties.pos.left = 0;
				        	}

				        	//sett all properties to global variable
					       	BgProperties.prop = {
					        	src : _src,
					        	x : parseInt(_xy[0], 10),
					        	y : parseInt(_xy[1], 10),
					        	size : {
				        			width : parseInt(_size[0], 10), 
				        			height : parseInt(_size[1], 10)
					        		},
					        	backgroundAttachment : _backgroundAttachment	
					        }

					        return true;
				        }

				        //if no image print error and return false
				        else {				    
				        	console.error('BAKOM.JS: Unable to find a background image for ' + BgProperties.element);
				        	return false;
				        }
		    		},
				
					_getBackgroundBoxPosition = function(){
						return {
							bottom: BgProperties.element.getBoundingClientRect().bottom,
							height: BgProperties.element.getBoundingClientRect().height,
							left: BgProperties.element.getBoundingClientRect().left,
							right: BgProperties.element.getBoundingClientRect().right,
							top: BgProperties.element.getBoundingClientRect().top,
							width: BgProperties.element.getBoundingClientRect().width
						};
					};

				if(!Defaults.backgroundSelector) {
					console.error('BAKOM.JS: Background element selector not set');
					return false;
				}
				
				BgProperties.element = bakom.backgroundElement = document.querySelectorAll(Defaults.backgroundSelector)[0];
				
				if(BgProperties.element){
					 return _setBackgroundImageProperties();
				}

				else{
					console.error('BAKOM.JS: Unable to find background element ' + Defaults.backgroundSelector)
					return false;
				}
			},

			/**
			 * set text element properties
			 * @return {Boolean} success Text elem properties set
			 */
			_setText = function(){
				if(!textElementSelector) {
					console.error('BAKOM.JS: Text element selector not set');
					return false;
				}

				var _element = bakom.textElement = document.querySelectorAll(textElementSelector)[0];
				
				if(_element){
					// set text properties
					TextProperties = {
						element : _element,
						pos : {
							left : _element.getBoundingClientRect().left,
							top : _element.getBoundingClientRect().top,
							width : _element.getBoundingClientRect().width,
							height : _element.getBoundingClientRect().height
						}
					}					
					if(!Defaults.styleClass) Defaults.styleClass = _element.className.slice(0);
					return true;
				}

				else{
					console.error('BAKOM.JS: Unable to find text element ' + Defaults.textSelector);
					return false;
				}
			}

			//update Defaults
		  	for (var attrname in configure) {
		  		if (Defaults.hasOwnProperty(attrname) && configure.hasOwnProperty(attrname)) { 
		  			Defaults[attrname] = configure[attrname];
		  		} 
		  	}

		  	//get a unique id for the clip path
		  	var _i = 0;
		  	
		  	while(document.getElementById('bakom-cp-' + _i)){
		  		_i++;
		  	}

		  	ClipPathId = 'bakom-cp-' + _i;

		  	return _setText() && _setBackground();		  	
		},

		/**
		 * build svg text and clippath element
		 */
		buildSvg = function(){

			/**
			 * convert string to html node
			 * @param  {String} string Template string
			 * @return {Object} node   Template as html node
			 */
			var _stringToNode = function(string){
					var _div = document.createElement('div');
					_div.innerHTML = string;
					return _div.firstChild;	
				},
			/**
			 * Stores orginal text, builds svg image and replaces text with it
			 */
			_buildImage = function(){
				var _image = '<svg width="' + TextProperties.pos.width + '" height="' + TextProperties.pos.height + '">' +
									'<image ' +  
										'xlink:href=' + BgProperties.prop.src +
										'width="' + BgProperties.prop.size.width + '"' +
										'height="' + BgProperties.prop.size.height + '"' +
										'clip-path="url(#' + ClipPathId + ')"' +
										'x="' + (BgProperties.pos.left - TextProperties.pos.left + BgProperties.prop.x) + '"' +
										'y="' + (BgProperties.pos.top - TextProperties.pos.top + BgProperties.prop.y) + '"' +
										'>' +
									'</image>' +
								'</svg>';

				OriginalText = TextProperties.element.innerHTML;				
				TextProperties.element.innerHTML = '';
				bakom.svgs.image = _stringToNode(_image)					
				TextProperties.element.appendChild(bakom.svgs.image);			
			},

			/**
			 * Build clip path and attach it to body
			 * @return {[type]} [description]
			 */
			_buildClipPath = function(){
				var _clipPath = '<svg style="position: absolute; top: 0; left:0; z-index: -1;">' + 
									'<defs>' +
										'<clipPath id="' + ClipPathId + '">' + 
											'<text text-anchor="start" x="0" dy="' + Defaults.dy + '" dx="' + Defaults.dx + '" class="' + Defaults.styleClass + '">' + TextProperties.element.innerHTML + '</text>' + 
										'</clipPath>' +
									'</defs>' +
								'</svg>';

				bakom.svgs.clipPath = _stringToNode(_clipPath);									
				document.body.appendChild(bakom.svgs.clipPath)			
			};

			_buildClipPath();
			_buildImage();

			bakom.hasBeenDrawn = true;
		},

		/**
		 * Saves original css values and replace them with the new ones
		 */
		buildCSS = function(){
			TextProperties.style = {};
			TextProperties.style.backgroundPosition = TextProperties.element.style.backgroundPosition;
			TextProperties.style.backgroundImage = TextProperties.element.style.backgroundImage;
			TextProperties.style.webkitBackgroundClip = TextProperties.element.style.webkitBackgroundClip;
			TextProperties.style.backgroundClip = TextProperties.element.style.backgroundClip;
			TextProperties.style.color = TextProperties.element.style.color;
			TextProperties.style.backgroundAttachment = TextProperties.element.style.backgroundAttachment;

			TextProperties.element.style.backgroundPosition = (BgProperties.pos.left - TextProperties.pos.left + BgProperties.prop.x) + 'px ' + (BgProperties.pos.top - TextProperties.pos.top + BgProperties.prop.y) + 'px';
			TextProperties.element.style.backgroundSize = BgProperties.prop.size.width + 'px ' + BgProperties.prop.size.height + 'px';
			TextProperties.element.style.backgroundImage = 'url(' + BgProperties.prop.src + ')';
			TextProperties.element.style.webkitBackgroundClip = 'text';
			TextProperties.element.style.backgroundClip = 'text';
			TextProperties.element.style.color = 'rgba(0, 0, 0, 0)';
			TextProperties.element.style.backgroundAttachment = BgProperties.prop.backgroundAttachment;
			
			bakom.hasBeenDrawn = true;
		},

		/**
		 * Reset text element's css properties
		 */
		deleteCSS = function(){
			for(var attr in TextProperties.style){
				TextProperties.element.style[attr] = TextProperties.style[attr];
			}
		},

		/**
		 * delete all svgs build and attached by Bakom
		 */
		deleteSvgs = function(){
			for(var svg in bakom.svgs){
				bakom.svgs[svg].parentNode.removeChild(bakom.svgs[svg]);
			}
		},

		/**
		 * Reset text element's text
		 */
		resetElement = function(){
			TextProperties.element.innerHTML = OriginalText;
		},

		/**
		 * Initialize Bakom
		 *
		 * 	Available Configure settings and Defaults 
		 * 	backgroundSelector : 'body',
			textSelector : '',
			styleClass : '',
			dy : '',
			dx : '',
			backgroundClipSupportOnly : true,
			debug : false
		 * 
		 * @param  {String} textElementSelector Text elemnt selector
		 * @param  {Object} configure           Configure setup
		 */
		init = function(textElementSelector, configure){
			
			//if the setup success, build css or svg
			if(setup(textElementSelector, configure)){
				//css only
				if(bakom.hasBackgroundClipSupport) buildCSS();

				//use svg
				else if(!Defaults.backgroundClipSupportOnly) {
					if(!Defaults.dy && Defaults.debug){
			        	console.warn('BAKOM.JS: no dy value set. Please read the documentation for bakom.js to find out why this isn\'t a good idea.');
			        }
					buildSvg();
				};

			}

			//build failed
			else{
				console.error('BAKOM.JS: Something went wrong in the setup. Either the background or text element selector wasn\'t set or one of the element wasn\'t found');
			}
		},

		/**
		 * Resets all element changed or attached by Bakom
		 * @return {[type]} [description]
		 */
		reset = function(){
			if(bakom.hasBeenDrawn){
				if(bakom.hasBackgroundClipSupport) deleteCSS();
				else {
					deleteSvgs();
					resetElement();
				}
			}
		};

	/*
		global variables
	 */
	
	bakom.hasBeenDrawn = false;
	bakom.hasBackgroundClipSupport = hasBackgroundClipSupport();
	bakom.svgs = {};
	bakom.textElement = undefined;		
	bakom.backgroundElement = undefined;	

	/*
		global api
	*/

	/**
	 * bakom.init builds a new bakom element
	 * @param  {String} textElementSelector
	 * @param  {object} Configure Configure Background element selector, style class string, dy variable, dx variable, backgroundClipSupportOnly boolean and debug boolean
	 * @return {object} Bakom The bakom object itself
	 */
	bakom.init = function(textElementSelector, configure){
		var configure = configure || {};

		/*
			build new bakom if backgroundClipSupportOnly and the browser supports it OR if !backgroundClipSupportOnly
		 */
		if((configure.backgroundClipSupportOnly !== false && bakom.hasBackgroundClipSupport) || configure.backgroundClipSupportOnly === false) {
			init(textElementSelector, configure);
		}

		return bakom;
	};

	/**
	 * bakom.reset if a bakom elements been built reset it to its initial state
	 * @return {object} Bakom The bakom object itself
	 */
	bakom.reset = function(){		
		reset();
		return bakom;
	};

	/**
	 * bakom.redraw if a bakom elements been built its values get recalculated and new values applied
	 * @param  {String} textElementSelector
	 * @param  {object} Configure Configure Background element selector, style class string, dy variable, dx variable, backgroundClipSupportOnly boolean and debug boolean
	 * @return {object} Bakom The bakom object itself
	 */
	bakom.redraw = function(textElementSelector, configure){
		if(bakom.hasBeenDrawn){
			reset();
			init(textElementSelector, configure);
		}
		setState();
		return bakom;
	};

}