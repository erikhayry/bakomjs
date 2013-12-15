# bakom.js

bakom.js makes it possible to make your text fully transparent allowing you to see right through it to the image below.

## How Do I Use It?
```html
<script src="path/to/bakom.min.js"></script>
<script>
	var text = new Bakom({
		backgroundSelector : '#background',
		textSelector : '#text',
		styleClass : 'text',
		dy : '0.9em'
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
* text align center and right currently not working

## Changelog
* `v 1.0` - Initial Release

## In Use:
- [erikportin.com/bakomjs](http://erikportin.com/bakomjs)


##License
bakom.js is available under the [MIT license] (http://opensource.org/licenses/MIT).

### Download, Fork, Commit.
If you think you can make this better, please Download, Fork, & Commit.
