<img src="https://www.codeship.io/projects/2da6c850-5551-0131-67f6-2237450a4507/status"/>

# bakom.js
=======

bakom.js makes it possible to make your text fully transparent allowing you to see right through it to the image below.

Please note this is an early untested version. Currently works in latest version of Chrome, Safari, IE and Firefox*.

*see known issues

## How Do I Use It?

Configure

<table>
	<tr>
		<th>Setting</th>
		<th>Default</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>backgroundSelector</td>
		<td>'body'</td>
		<td>Selector of element you want to use as background. If there is multiple macthes to the selector the first one will be used</td>
	</tr>
	<tr>
		<td>styleClass</td>
		<td>''</td>
		<td>Additional classes you want to add on the text element for styling</td>
	</tr>
	<tr>
		<td>dy</td>
		<td>''</td>
		<td>Only used on the svg clip path created for browsers not supporting the background clip property. <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy">Read more abut the dy attribute here</a></td>
	</tr>
	<tr>
		<td>dx</td>
		<td>''</td>
		<td>Only used on the svg clip path created for browsers not supporting the background clip property. <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dx">Read more abut the dx attribute here</a></td>
	</tr>
	<tr>
		<td>backgroundClipSupportOnly</td>
		<td>true</td>
		<td>If true no svg fallback will be built for browsers not supporting the background clip property (currently Firefox and IE)</td>
	</tr>
	<tr>
		<td>debug</td>
		<td>false</td>
		<td>Show debug logs in the console</td>
	</tr>
</table>

```html
<script src="path/to/bakom.min.js"></script>
<script>
	var text = new Bakom();

	text.init('#text', {
		backgroundSelector : '#background',
		styleClass : 'text',
		backgroundClipSupportOnly : false,
		dy : '0.9em'
	})
</script>
```

Redraw your element

```html
<script>
	text.redraw();
</script>
```

Reset your element

```html
<script>
	text.reset();
</script>
```

## Known issues

### For all browsers
* multiple images not supported

### For browsers not supporting background-clip (IE and Firefox)
* a background image size have to be set (both height and width)
* text align center and right currently not working
* multiple lines of text currently not working
* background position fixed not fully supported

## Changelog
* 19.01.2014 `v 0.1.1` 
	+ Background position fixed support for browser supporting background-clip
	+ Tests
	+ Bug fixes
* `v 0.1.0`
	+ Initial Release

## In Use:
- [erikportin.com/bakomjs](http://erikportin.com/bakomjs) (version 1.0)


## License
-------
bakom.js is available under the [MIT license] (http://opensource.org/licenses/MIT).

### Download, Fork, Commit.
If you think you can make this better, please Download, Fork, & Commit.
