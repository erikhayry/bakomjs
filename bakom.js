
/*
 * bakom.js 1.0
 * http://erikportin.com/bakomjs
 *
 * Copyright 2013 Erik Portin
 * Released under the MIT license
 * https://github.com/erikportin/bakomjs/blob/master/LICENCE.md
 */

//define the global Bakom Variable as a class.
window.Bakom = function(configure){

  	var bakom = this,

  		//variables global to bakom
  		clipPathId = '',
  		hasBeenDrawn = false,
  		hasCssSupport = false,
  		bgProp = {},
  		textEl, originalText,
  		svgs = {};

  		//set default values
  		bakom.defaults = {
			backgroundSelector : '.bakom-bg-1',
			textSelector : '.bakom-fg-1',
			styleClass : 'text',
			dy : '0.9em' ////https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
		};

		//functions global to bakom

		//inital setup
		var setup = function(configure){

			//update defaults
		  	for (var attrname in configure) {
		  		if (bakom.defaults.hasOwnProperty(attrname) && configure.hasOwnProperty(attrname)) { 
		  			bakom.defaults[attrname] = configure[attrname];
		  		} 
		  	}

		  	//get a unique id for the clip path
		  	var _i = 0;
		  	while(document.getElementById('bakom-cp-' + _i)){
		  		_i++;
		  	}
		  	clipPathId = 'bakom-cp-' + _i;

		  	//check if supports backgroundClip
		  	var _testEl = document.createElement( "x-test" );
		  	hasCssSupport = typeof _testEl.style.webkitBackgroundClip !== "undefined" && ( _testEl.style.webkitBackgroundClip = "text", _testEl.style.webkitBackgroundClip === "text" );
		  	
		},

		//get background element properties
		getBackground = function(){
			var _getBackgroundImageProperties = function(){
		    		var _src = '',
		    			_xy = '',
		    			_size = [];

		        	_src = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-image');
		        	_xy = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-position').split(' ');
		        	_size = document.defaultView.getComputedStyle(bgProp.element, null).getPropertyValue('background-size').split(' ');
			        
			        if(_src) _src = _src.slice(_src.indexOf('url(') + 4, _src.lastIndexOf(')'));
			        else console.error('Unable to find a background image for ' + bgProp.element)

			        return {
			        	src : _src,
			        	x : parseInt(_xy[0], 10),
			        	y : parseInt(_xy[1], 10),
			        	size : {
			        			width : parseInt(_size[0], 10), 
			        			height : parseInt(_size[1], 10)
			        		}
			        }
	    		},
			
				_getBackgroundBoxPosition = function(){
					var _pos = bgProp.element.getBoundingClientRect();
					return _pos;
				};

			bgProp.element = document.querySelectorAll(bakom.defaults.backgroundSelector)[0];
			
			if(bgProp.element){
				bgProp.prop = _getBackgroundImageProperties(),
				bgProp.pos = _getBackgroundBoxPosition();
			}

			else{
				console.error('Unable to find background element ' + bakom.defaults.backgroundSelector)
			}
		},

		//get text element properties
		getText = function(){
			var _element = document.querySelectorAll(bakom.defaults.textSelector)[0];
			
			if(_element){
				textEl = {
					element : _element,
					pos : _element.getBoundingClientRect()
				}
			}

			else{
				console.error('Unable to find text element ' + bakom.defaults.textSelector)
			}
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
												'<text text-anchor="start" x="0" dy="' + bakom.defaults.dy + '" class="' + bakom.defaults.styleClass + '">' + textEl.element.innerHTML + '</text>' + 
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
			textEl.style.color = textEl.element.style.color;

			textEl.element.style.backgroundPosition = (bgProp.pos.left - textEl.pos.left + bgProp.prop.x) + 'px ' + (bgProp.pos.top - textEl.pos.top + bgProp.prop.y) + 'px';
			textEl.element.style.backgroundImage = 'url(' + bgProp.prop.src + ')';
			textEl.element.style.webkitBackgroundClip = 'text';
			textEl.element.style.color = 'rgba(0, 0, 0, 0)';
			hasBeenDrawn = true;
		},

		// rest css on text element
		unsetCSS = function(){
			for(var attr in textEl.style){
				textEl.element.style[attr] = textEl.style[attr];
			}
		}

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
		init = function(configure){
			setup(configure);
			getBackground();
			getText();
			if(hasCssSupport) setCSS();
			else buildSvg();
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
		};

		init(configure);

	/*
		global api
	*/

	//reset the elements to it's inital state
	bakom.reset = function(){
		reset();
	};

	//recalculates the postions and redraws it
	bakom.redraw = function(configure){
		if(hasBeenDrawn){
			reset();
			init(configure);
		}
	}			
}