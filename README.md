# bakom.js

bakom.js makes it possible to make your text fully transparent allowing you to see right through it to the image below.

Please note this is an early untested version. Currently works in latest version of Chrome, Safari, IE and Firefox*.

*see known issues

## How Do I Use It?
```html
<body id="background">
...
<div class="box">
	<h1 id="text">Transparent Text</h1>
</div>
...
</body>

<script src="path/to/bakom.min.js"></script>
<script>
	var text = new Bakom({
		backgroundSelector : '#background',
		textSelector : '#text',
		styleClass : 'text',
		dy : '0.9em' //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dy
	});
</script>
```

Redraw your element.

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

* a background image size have to be set (both height and width)
* text align centera and right currently not working in Firefox and IE
* multiple lines of text currently not working in Firefox and IE

## Changelog
* `v 1.0` - Initial Release

## In Use:
- [erikportin.com/bakomjs](http://erikportin.com/bakomjs)


##License
bakom.js is available under the [MIT license] (http://opensource.org/licenses/MIT).

### Download, Fork, Commit.
If you think you can make this better, please Download, Fork, & Commit.
