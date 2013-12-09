
var Bakom = function(configure){
  	var This = this,
  		ClipPathId = '',
  		HasBeenDrawn = false,
  		BgProp = {},
  		TextEl, OriginalText; 
  		
  		This.Defaults = {
			background : 'bakom-bg-1',
			text : 'bakom-fg-1',
			style : '.text',
			dy : '0.9em'
		};

		var SVGs = {},

		Setup = function(configure){
		  	for (var attrname in configure) {
		  		if (This.Defaults.hasOwnProperty(attrname) && configure.hasOwnProperty(attrname)) { 
		  			This.Defaults[attrname] = configure[attrname];
		  		} 
		  	}
		  	
		  	var _i = 0;
		  	while(document.getElementById('bakom-cp-' + _i)){
		  		_i++;
		  	}
		  	ClipPathId = 'bakom-cp-' + _i;
		  	
		},

		GetBackground = function(){
			var _getBackgroundImageProperties = function(){
		    		var _src = '',
		    			_x = '',
		    			_y = '',
		    			_size = [];

			        if (BgProp.element.currentStyle) {
			        	_src = BgProp.element.currentStyle['background-image'];
			        	_x = BgProp.element.currentStyle['background-position-x'];
			        	_y = BgProp.element.currentStyle['background-position-y'];
			        }

			        else if(window.getComputedStyle) {
			        	_src = document.defaultView.getComputedStyle(BgProp.element, null).getPropertyValue('background-image');
			        	_x = document.defaultView.getComputedStyle(BgProp.element, null).getPropertyValue('background-position-x');
			        	_y = document.defaultView.getComputedStyle(BgProp.element, null).getPropertyValue('background-position-y');
			        	_size = document.defaultView.getComputedStyle(BgProp.element, null).getPropertyValue('background-size').split(' ');
			        }
			        
			        if(_src) _src = _src.slice(_src.indexOf('url(') + 4, _src.lastIndexOf(')'));
			        else console.error('Unable to find a background image for ' + BgProp.element)

			        return {
			        	src : _src,
			        	x : parseInt(_x, 10),
			        	y : parseInt(_y, 10),
			        	size : {
			        			width : parseInt(_size[0], 10), 
			        			height : parseInt(_size[1], 10)
			        		}
			        }
	    		},
			
				_getBackgroundBoxPosition = function(){
					var _pos = BgProp.element.getBoundingClientRect();
					return _pos;
				};

			BgProp.element = document.querySelectorAll('.' + This.Defaults.background)[0];
			
			if(BgProp.element){
				BgProp.prop = _getBackgroundImageProperties(),
				BgProp.pos = _getBackgroundBoxPosition();
			}

			else{
				console.error('Unable to find background element ' + This.Defaults.background)
			}
		},

		GetText = function(){
			var _element = document.querySelectorAll('.' + This.Defaults.text)[0];
			
			if(_element){
				TextEl = {
					element : _element,
					pos : _element.getBoundingClientRect()
				}
			}

			else{
				console.error('Unable to find text element ' + This.Defaults.text)
			}
		},

		BuildSvg = function(){
			var _stringToNode = function(string){
					var div = document.createElement('div');
					div.innerHTML = string;
					return div.firstChild;	
				},
			
				_buildImage = function(){
					var _image = '<svg width="' + TextEl.pos.width + '" height="' + TextEl.pos.height + '">' +
										'<image ' +  
											'xlink:href="' + BgProp.prop.src +'"' +
											'width="' + BgProp.prop.size.width + '"' +
											'height="' + BgProp.prop.size.height + '"' +
											'clip-path="url(#' + ClipPathId + ')"' +
											'x="' + (BgProp.pos.left - TextEl.pos.left + BgProp.prop.x) + '"' +
											'y="' + (BgProp.pos.top - TextEl.pos.top + BgProp.prop.y) + '"' +
											'>' +
										'</image>' +
									'</svg>';
					OriginalText = TextEl.element.innerHTML;				
					TextEl.element.innerHTML = '';
					SVGs.image = _stringToNode(_image)					
					TextEl.element.appendChild(SVGs.image);			
				},

				_buildClipPath = function(){
					var _clipPath = '<svg>' + 
										'<defs>' +
											'<clipPath id="' + ClipPathId + '">' + 
												'<text text-anchor="start" x="0" dy="' + This.Defaults.dy + '" class="' + This.Defaults.style + '">' + TextEl.element.innerHTML + '</text>' + 
											'</clipPath>' +
										'</defs>' +
									'</svg>';
					SVGs.clipPath = _stringToNode(_clipPath);									
					document.body.appendChild(SVGs.clipPath)			
				};

			_buildClipPath();
			_buildImage();
			HasBeenDrawn = true;
		},

		DeleteSVGs = function(){
			for(var svg in SVGs){
				SVGs[svg].parentNode.removeChild(SVGs[svg]);
			}
		},

		ResetElement = function(){
			TextEl.element.innerHTML = OriginalText;
		},

		Init = function(configure){
			Setup(configure);
			GetBackground();
			GetText();
			BuildSvg();
		},

		Reset = function(){
			if(HasBeenDrawn){
				DeleteSVGs();
				ResetElement();
			}
		};

		Init(configure);

	//api
	this.reset = function(){
		Reset()
	};	
	this.redraw = function(configure){
			if(HasBeenDrawn){
				Reset();
				Init(configure);
			}
		}
	this.print = function(){
		/*console.log(This)
  		console.log(ClipPathId)
  		console.log(HasBeenDrawn)
  		console.log(BgProp)
  		console.log(TextEl)
  		console.log(OriginalText)*/
  		console.log(This.Defaults)
		//console.log(SVGs)
	}			
}


var test = new Bakom({
	background : 'bakom-bg',
	text : 'bakom-fg',
	style : 'text',
	dy : '0.9em' //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
});

test.print();

//test.redraw();

var test2 = new Bakom({
	background : 'bakom-bg',
	text : 'bakom-fg2',
	style : 'text',
	dy : '0.8em' //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
});

test.print();
test2.print();









