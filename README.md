![styleflux logo](https://raw.githubusercontent.com/Firebrand/styleflux/master/logo.gif)

# Styleflux

Convert plain CSS into SCSS, or CSS into a JS object or SCSS into tidier SCSS!

## Installation

### As an executable:

```
npm install -g styleflux
```

### As a library:

```
npm install --save styleflux
```


## Usage

### As an executable:

You can use the command styleflux on a css file to convert it to scss, or on an existing scss file to clean it up

```
styleflux -o <filename>
```

### As a library:

You can use styleflux as a library to convert css into scss, a javascript object, a clean scss string or a processed file.

```
const cssConverter = require('styleflux');

const cssObject = cssConverter.cssToObject(<string>);
```

**OR**

```
const cssConverter = require('styleflux');

const scssString = cssConverter.cssToScss(<string>);
```

**OR**

```
const cssConverter = require('styleflux');

cssConverter.processCSSFile(<filename>);
```


## Examples

### Running styleflux executable on a css/sass/scss file

```
$ styleflux -o lib/styles/main.css
```

### Using the styleflux library


```
const cssConverter = require('styleflux');

const cssObject = cssConverter.cssToObject('.class1 {color: red} .class1 h1 {font-size: 15px}');
console.log(cssObject['.class1']);

const scssString = cssConverter.cssToScss('.class1 {color: red} .class1 h1 {font-size: 15px}');
console.log(scssString);
```

## Support

If you experience any bugs or issues please post a comment here:  <https://github.com/Firebrand/styleflux/issues>
Typically it will get responded to and resolved within 24hrs.
Make sure to include the error message as well as the css you are inputting into it.

## License

ISC
