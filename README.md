jasmine-custom-message
======================
> **works with `jasmine v1.3`** (for work with `jasmine v2` see [`jasmine2-custom-message`](https://github.com/avrelian/jasmine2-custom-message))


This script makes it possible to use your own failure message on any jasmine assertion.

#### Example

```js
describe('the story', function() {
  it('should finish ok', function() {
    since('all cats are grey in the dark').
    expect('tiger').toEqual('kitty'); // => 'all cats are grey in the dark'
  });
});
```


## Simple

All the magic happens in `since` function. That returns an object with a property `expect`. That contains no more than a wrapped jasmine `expect` function. That returns jasmine `expectation` object with a specially defined `message` function. That can produce a custom failure message. That is generating based on a custom message you have supplied to `since` function as the first argument. That can be a primitive (except `null` and `undefined`), a function, or any other object. That is it.

#### Example

```js
describe('test', function() {
  it('should be ok', function() {
    since(function() {
      return {'tiger': 'kitty'};
    }).
    expect(3).toEqual(4); // => '{"tiger":"kitty"}'
  });
});
```


## Unobtrusive

You can use jasmine as you did before, since `jasmine-custom-message` does not replace global jasmine `expect` function.

#### Example

```js
describe('test', function() {
  it('should be ok', function() {
    expect(3).toEqual(4); // => ordinary jasmine message
  });
});
```


## Powerful

You can use expected and actual value of the assertion in your custom message, by:

  * Passing a function, and using `this.actual` and `this.expected`
  * Passing a string, and using `#{actual}` and `#{expected}`

#### Example using a function

```js
describe('test', function() {
  it('should be ok', function() {
    since(function(expected) {
      return this.actual + ' =/= ' + expected;
    }).
    expect(3).toEqual(4); // => '3 =/= 4'
  });
});
```

#### Example using a string

```js
describe('test', function() {
  it('should be ok', function() {
    since('#{actual} =/= #{expected}').
    expect(3).toEqual(4); // => '3 =/= 4'
  });
});
```

Moreover, you can use a promise as an argument of expect or matcher functions. Promise is recognized by `then` method, so be careful if your non-promise object has this method.

#### Example (with a little help of protractor)

```js
describe('test', function() {
  it('should be ok', function() {
    since(function(expected) {
      return this.actual + ' =/= ' + expected;
    }).
    expect(protractor.promise.fulfilled(3)).toEqual(protractor.promise.fulfilled(4)); // => '3 =/= 4'
  });
});
```

## Front-end usage
*  install the bower package from github
```
bower install jasmine-custom-message --save-dev
```
* include `jasmine-custom-message.js` into your HTML file next to `jasmine` script
```html
<script src="PATH-TO/jasmine.js"></script>
<script src="PATH-TO/jasmine-custom-message.js"></script>   
```

## Node.js usage

*  install the bower package
```
bower install jasmine-custom-message --save-dev
```
or npm package
```
npm install jasmine-custom-message --save-dev
```

*  require it in your spec file before your tests
```js
require('jasmine-custom-message');
```

## Change log

`v0.8.0` - 2015.08.05 - **Be careful of objects with `then` method, since they are treated as promises**
  * fixed issue with custom failure messages on promised assertions
  * implemented "format string" functionality: #{actual} and #{expected}
  * configured `protractor` environment
  * corrected displaying of colors in tests running through `protractor`
  * updated specs

`v0.7.0` - 2014.10.23
  * fixed issue with custom failure messages on inverse assertions
  * updated specs

`v0.6.0` - 2014.01.18 - **BROKEN COMPATIBILITY!**
  * all the magic moved into newly introduced `since` function
  * restored automatic initiation of the script upon inclusion (browser) or require (Node.js)
  * cleaned specs

`v0.5.0` - 2014.01.15
  * added support for nested message functions
  * dropped automatic wrapping of jasmine `it` and `expect` functions in browsers
  * added specs for Node.js
  * added specs for browsers
  * registered bower package
  * made disambiguation and readability improvements

`v0.2.0` - 2014.01.10 - **BROKEN COMPATIBILITY!**
  * custom messages is supplied as the third argument for jasmine `it` function

`v0.1.0` - 2014.01.08
  * the first functional version


## Release plan

`v0.9.0` - some new features (based on requests from Issues)
