
(function(Bakom){
  	var BgProp = {},
  		TextEls = [],
  		Defaults = {
			background : 'bakom-bg-1',
			text : 'bakom-fg-1',
			style : '.text',
			leading : '0.9em'
		},
		
		Setup = function(configure){
		  	for (var attrname in configure) {
		  		if (Defaults.hasOwnProperty(attrname) && configure.hasOwnProperty(attrname)) { 
		  			Defaults[attrname] = configure[attrname];
		  		} 
		  	}
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

			BgProp.element = document.querySelectorAll('.' + Defaults.background)[0];
			
			if(BgProp.element){
				BgProp.prop = _getBackgroundImageProperties(),
				BgProp.pos = _getBackgroundBoxPosition();
			}

			else{
				console.error('Unable to find background element ' + Defaults.background)
			}
		},

		GetText = function(){
			//in the future more than one element might be supported
			var _elements = document.querySelectorAll('.' + Defaults.text);
			if(_elements.length > 0){
				for (var i = 0; i < _elements.length; i++) {
					var _text = {
						element : _elements[i],
						pos : _elements[i].getBoundingClientRect()
					}

				 	TextEls.push(_text);
				};
			}
			else{
				console.error('Unable to find text elements ' + Defaults.text)
			}
		},

		BuildSvg = function(){
			var _stringToNode = function(string){
					var div = document.createElement('div');
					div.innerHTML = string;
					return div.firstChild;	
				},
			
				_buildImage = function(){
					var _image = '<svg width="' + TextEls[0].pos.width + '" height="' + TextEls[0].pos.height + '">' +
										'<image ' +  
											'xlink:href="' + BgProp.prop.src +'"' +
											'width="' + BgProp.prop.size.width + '"' +
											'height="' + BgProp.prop.size.height + '"' +
											'clip-path="url(#clipPath)"' +
											'x="' + (BgProp.pos.left - TextEls[0].pos.left + BgProp.prop.x) + '"' +
											'y="' + (BgProp.pos.top - TextEls[0].pos.top + BgProp.prop.y) + '"' +
											'>' +
										'</image>' +
									'</svg>';

					TextEls[0].element.innerHTML = '';					
					TextEls[0].element.appendChild(_stringToNode(_image));			
				},

				_buildClipPath = function(){
					var _clipPath = '<svg>' + 
										'<defs>' +
											'<clipPath id="clipPath">' + 
												'<text x="0" y="' + Defaults.leading + '" class="' + Defaults.style + '">' + TextEls[0].element.innerHTML + '</text>' + 
											'</clipPath>' +
										'</defs>' +
									'</svg>';
					document.body.appendChild(_stringToNode(_clipPath))			
				};

			_buildClipPath();
			_buildImage();
		};

	//api
	Bakom.init = function(configure){
		Setup(configure);
		GetBackground();
		GetText();
		BuildSvg();
	};
}(this.Bakom = this.Bakom || {}));

Bakom.init({
	background : 'bakom-bg',
	text : 'bakom-fg',
	style : 'text',
	leading : '0.9em'
});










