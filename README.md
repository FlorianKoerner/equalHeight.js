equalHeight.js
==============

[![Greenkeeper badge](https://badges.greenkeeper.io/FlorianKoerner/equalHeight.js.svg)](https://greenkeeper.io/)

Applies the same height on all matched elements with the same vertical position.
Use this jQuery-Plugin as a flexible and stable CSS flexbox alternative.
Responsive Ready!


# How to use

- Install via bower: `bower install equalHeight.js`
- Install via npm: `npm install equalheight.js`
- Install via yarn: `yarn install equalheight.js`
- Or download the [jquery.equal-height.min.js](jquery.equal-height.min.js) directly.

Link jQuery and equalHeight.js in your document:

```html
<script type="text/javascript" src="/path/to/jquery.js"></script>
<script type="text/javascript" src="/path/to/jquery.equal-height.min.js"></script>
```

Apply the plugin to your elements:

```html
<div data-eqh>
	John Doe
</div>
<div data-eqh>
	Jane<br />
	Doe
</div>

<script type="text/javascript">
	$(document).ready(function() {
		$('[data-eqh]').equalHeight();
	});
</script>
```

## Examples and further documentation

Examples and Documentation: [floriankoerner.github.io/equalHeight.js/demo/](http://floriankoerner.github.io/equalHeight.js/demo/)


# Compile and minify TypeScript-File

1. Install `tsd` and `gulp`.

```
npm install -g tsd
npm install -g gulp
```

2. Install dev dependencies

```
tsd install
npm install
```

3. Compile and minify

```
gulp
```