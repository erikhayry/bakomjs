
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
  		conf = {},
		hasBackgroundClipSupport = function(){
			//check for background clip support
			var	_testEl = document.createElement( "x-test" );			
			return 	typeof _testEl.style.webkitBackgroundClip !== "undefined" && ( _testEl.style.webkitBackgroundClip = "text", _testEl.style.webkitBackgroundClip === "text" ) ||
					typeof _testEl.style.backgroundClip !== "undefined" && ( _testEl.style.backgroundClip = "text", _testEl.style.backgroundClip === "text" )	
		},

  		//variables global to bakom
  		clipPathId = '',
  		hasBeenDrawn = false,
  		hasCssSupport = hasBackgroundClipSupport(),
  		bgProp = {},
  		textEl, originalText,
  		svgs = {},

  		//set default values
  		defaults = {
			backgroundSelector : 'body',
			textSelector : '',
			styleClass : '',
			dy : '', //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
			dx : '', //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dx
			backgroundClipSupportOnly : true,
			debug : false
		};
		
		//inital setup
		var setup = function(textElementSelector, configure){

			//get background element properties
			var _getBackground = function(){

				var _getBackgroundImageProperties = function(){
					/*
						TODO: add support for position fixed, local and multiple images
					*/
			    		var _src = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-image'),
			    			_xy = '',
			    			_size = [],
			    			_backgroundAttachment = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-attachment');

			        	if(!defaults.backgroundClipSupportOnly){
			        		var _backgroundRepeat = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-repeat');
			        		
			        		if(_backgroundRepeat !== 'no-repeat' && defaults.debug){
			        			console.warn('BAKOM.JS: background-repeat is set to "' + _backgroundRepeat + '" which can cause issues for browsers not supporting Background Clip. Set property to "no-repeat" to avoid this warning.')
			        		}

			        		if(_backgroundAttachment !== 'scroll' && defaults.debug){
			        			console.warn('BAKOM.JS: background-attachment is set to "' + _backgroundAttachment + '" which is not supported. Set property to "scroll" to avoid this warning.')
			        		}
			        	}
				     
				        if(_src && _src !== 'none') {
				        	_xy = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-position').split(' ');
			        		_size = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-size').split(' ');
				        	_src = _src.slice(_src.indexOf('url(') + 4, _src.lastIndexOf(')'));

				        	bgProp.pos = _getBackgroundBoxPosition();

				        	if(_backgroundAttachment === 'fixed'){
				        		textEl.pos.top = 0;
				        		textEl.pos.left = 0;

				        		bgProp.pos.top = 0;
				        		bgProp.pos.left = 0;
				        	}

					       	bgProp.prop = {
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

				        else {				    
				        	console.error('BAKOM.JS: Unable to find a background image for ' + bgProp.element);
				        	return false;
				        }
		    		},
				
					_getBackgroundBoxPosition = function(){
						return {
							bottom: bgProp.element.getBoundingClientRect().bottom,
							height: bgProp.element.getBoundingClientRect().height,
							left: bgProp.element.getBoundingClientRect().left,
							right: bgProp.element.getBoundingClientRect().right,
							top: bgProp.element.getBoundingClientRect().top,
							width: bgProp.element.getBoundingClientRect().width
						};
					};

				if(!defaults.backgroundSelector) {
					console.error('BAKOM.JS: Background element selector not set');
					return false;
				}
				
				bgProp.element = document.querySelectorAll(defaults.backgroundSelector)[0];
				
				if(bgProp.element){
					 return _getBackgroundImageProperties();
				}

				else{
					console.error('BAKOM.JS: Unable to find background element ' + defaults.backgroundSelector)
					return false;
				}
			},

			//get text element properties
			_getText = function(){
				if(!textElementSelector) {
					console.error('BAKOM.JS: Text element selector not set' + defaults.textSelector);
					return false;
				}

				var _element = document.querySelectorAll(textElementSelector)[0];
				
				if(_element){
					textEl = {
						element : _element,
						pos : {
							left : _element.getBoundingClientRect().left,
							top : _element.getBoundingClientRect().top,
							width : _element.getBoundingClientRect().width,
							height : _element.getBoundingClientRect().height
						}
					}					
					if(!defaults.styleClass) defaults.styleClass = _element.className.slice(0);
					return true;
				}

				else{
					console.error('BAKOM.JS: Unable to find text element ' + defaults.textSelector);
					return false;
				}
			}

			//update defaults
		  	for (var attrname in configure) {
		  		if (defaults.hasOwnProperty(attrname) && configure.hasOwnProperty(attrname)) { 
		  			defaults[attrname] = configure[attrname];
		  		} 
		  	}

		  	//get a unique id for the clip path
		  	var _i = 0;
		  	while(document.getElementById('bakom-cp-' + _i)){
		  		_i++;
		  	}
		  	clipPathId = 'bakom-cp-' + _i;

		  	return _getText() && _getBackground();		  	
		},

		//build the svgs (image and clip path)
		buildSvg = function(){

			//helper function for coneverting string to node
			var _stringToNode = function(string){
					var div = document.createElement('div');
					div.innerHTML = string;
					return div.firstChild;	
				},
			
				_buildImage = function(){
					var _image = '<svg width="' + textEl.pos.width + '" height="' + textEl.pos.height + '">' +
										'<image ' +  
											'xlink:href=' + bgProp.prop.src +
											'width="' + bgProp.prop.size.width + '"' +
											'height="' + bgProp.prop.size.height + '"' +
											'clip-path="url(#' + clipPathId + ')"' +
											'x="' + (bgProp.pos.left - textEl.pos.left + bgProp.prop.x) + '"' +
											'y="' + (bgProp.pos.top - textEl.pos.top + bgProp.prop.y) + '"' +
											'>' +
										'</image>' +
									'</svg>';

					originalText = textEl.element.innerHTML;				
					textEl.element.innerHTML = '';
					svgs.image = _stringToNode(_image)					
					textEl.element.appendChild(svgs.image);			
				},

				_buildClipPath = function(){
					var _clipPath = '<svg style="position: absolute; top: 0; left:0; z-index: -1;">' + 
										'<defs>' +
											'<clipPath id="' + clipPathId + '">' + 
												'<text text-anchor="start" x="0" dy="' + defaults.dy + '" dx="' + defaults.dx + '" class="' + defaults.styleClass + '">' + textEl.element.innerHTML + '</text>' + 
											'</clipPath>' +
										'</defs>' +
									'</svg>';

					svgs.clipPath = _stringToNode(_clipPath);									
					document.body.appendChild(svgs.clipPath)			
				};

			_buildClipPath();
			_buildImage();
			hasBeenDrawn = true;
		},

		//add Background clip
		setCSS = function(){
			textEl.style = {};
			textEl.style.backgroundPosition = textEl.element.style.backgroundPosition;
			textEl.style.backgroundImage = textEl.element.style.backgroundImage;
			textEl.style.webkitBackgroundClip = textEl.element.style.webkitBackgroundClip;
			textEl.style.backgroundClip = textEl.element.style.backgroundClip;
			textEl.style.color = textEl.element.style.color;
			textEl.style.backgroundAttachment = textEl.element.style.backgroundAttachment;

			textEl.element.style.backgroundPosition = (bgProp.pos.left - textEl.pos.left + bgProp.prop.x) + 'px ' + (bgProp.pos.top - textEl.pos.top + bgProp.prop.y) + 'px';
			textEl.element.style.backgroundSize = bgProp.prop.size.width + 'px ' + bgProp.prop.size.height + 'px';
			textEl.element.style.backgroundImage = 'url(' + bgProp.prop.src + ')';
			textEl.element.style.webkitBackgroundClip = 'text';
			textEl.element.style.backgroundClip = 'text';
			textEl.element.style.color = 'rgba(0, 0, 0, 0)';
			textEl.element.style.backgroundAttachment = bgProp.prop.backgroundAttachment;
			
			hasBeenDrawn = true;
		},

		//rest css on text element
		unsetCSS = function(){
			for(var attr in textEl.style){
				textEl.element.style[attr] = textEl.style[attr];
			}
		},

		//delete image and clip path svg
		deleteSvgs = function(){
			for(var svg in svgs){
				svgs[svg].parentNode.removeChild(svgs[svg]);
			}
		},

		//remove image svg and reset innertext
		resetElement = function(){
			textEl.element.innerHTML = originalText;
		},

		//setup elements
		init = function(textElementSelector, configure){
			if(setup(textElementSelector, configure)){
				if(hasCssSupport) setCSS();
				else if(!defaults.backgroundClipSupportOnly) {
					if(!defaults.dy && defaults.debug){
			        	console.warn('BAKOM.JS: no dy value set. Please read the documentation for bakom.js to find out why this isn\'t a good idea.');
			        }
					buildSvg();
				};				
			}
			else{
				console.error('BAKOM.JS: Something went wrong in the setup. Either the background or text element selector wasn\'t set or one of the element wasn\'t found');
			}
		},

		//reset the elements to it's inital state
		reset = function(){
			if(hasBeenDrawn){
				if(hasCssSupport) unsetCSS();
				else {
					deleteSvgs();
					resetElement();
				}
			}
		},

		/**
		 * updates the global states variables
		 */
		setState = function(){
			bakom.hasBeenDrawn = hasBeenDrawn;
			bakom.hasBackgroundClipSupport = hasCssSupport;
			bakom.svgs = svgs;

			if(textEl) bakom.textElement = textEl.element;
			else bakom.textElement = undefined;
			
			if(bgProp) bakom.backgroundElement = bgProp.element;
			else bakom.backgroundElement = undefined;
		};

		// set the blobal state variables on initialization
		setState();

	/*
		global api
	*/


	/**
	 * bakom.init builds a new bakom element
	 * @param  {String} textElementSelector
	 * @param  {object} configure Background element selector, style class string, dy variable, dx variable, backgroundClipSupportOnly boolean and debug boolean
	 * @return {object} the bakom object itself
	 */
	bakom.init = function(textElementSelector, configure){
		/*
			build new bakom if backgroundClipSupportOnly and the browser supports it OR if !backgroundClipSupportOnly
		 */
		if((configure.backgroundClipSupportOnly !== false && hasCssSupport) || configure.backgroundClipSupportOnly === false) init(textElementSelector, configure);
		
		//update gobal state TODO do something more clever so I don't have to remember to do this everywhere 
		setState();

		return bakom;
	};

	/**
	 * bakom.reset if a bakom elements been built reset it to its initial state
	 * @return {object} the bakom object itself
	 */
	bakom.reset = function(){
		
		reset();

		//update gobal state TODO do something more clever so I don't have to remember to do this everywhere 
		setState();
		return bakom;
	};

	/**
	 * bakom.redraw if a bakom elements been built its values get recalculated and new values applied
	 * @param  {String} textElementSelector
	 * @param  {object} configure Background element selector, style class string, dy variable, dx variable, backgroundClipSupportOnly boolean and debug boolean
	 * @return {object} the bakom object itself
	 */
	bakom.redraw = function(textElementSelector, configure){
		if(hasBeenDrawn){
			reset();
			init(textElementSelector, configure);
		}
		setState();
		return bakom;
	};
}