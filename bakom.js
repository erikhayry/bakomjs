
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
			var _getBackgroundImage = function(){
		    		var _src = '';

			        if (BgProp.element.currentStyle) {
			        	var _src = BgProp.element.currentStyle['background']
			        }

			        else if(window.getComputedStyle) {
			        	var _src = document.defaultView.getComputedStyle(BgProp.element, null).getPropertyValue('background')
			        }

			        if(_src) _src = _src.slice(_src.indexOf('url(') + 4, _src.lastIndexOf(')'));
			        else console.error('Unable to find a background image for ' + BgProp.element)

			        return _src;
	    		},
			
				_getBackgroundPosition = function(){
					var _pos = BgProp.element.getBoundingClientRect();
					return _pos;
				};

			BgProp.element = document.querySelectorAll('.' + Defaults.background)[0];
			
			if(BgProp.element){
				BgProp.src = _getBackgroundImage(),
				BgProp.pos = _getBackgroundPosition();
			}

			else{
				console.error('Unable to find background element ' + Defaults.background)
			}
		},

		GetText = function(){
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
											'class="m-box-clip-image"' +  
											'xlink:href="' + BgProp.src +'"' +
											'width="750"' +
											'height="464"' +
											'clip-path="url(#clipPath)"' +
											'x="-' + (TextEls[0].pos.left - BgProp.pos.left) + '"' +
											'y="-' + (TextEls[0].pos.top - BgProp.pos.top) + '"' +
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
												'<text x="0" y="' + Defaults.leading + '" class="' + Defaults.style + '" xml:space="preserve">' + TextEls[0].element.innerHTML + '</text>' + 
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










