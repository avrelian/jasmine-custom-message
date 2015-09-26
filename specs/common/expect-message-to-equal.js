'use strict';

(function() {
  var global = Function('return this')();
  if(! (global.jasmine && global.expect)) {
    return;
  }

  var isBrowserEnv = global.window && global === global.window;
  var isCommonJS = typeof module !== 'undefined' && typeof module.exports === 'object';

  var isPromise = function(val) {
    return val && typeof val.then === 'function';
  };

  var diff;
  if (isBrowserEnv) {
    diff = window.JsDiff;
  } else {
    if (isCommonJS) {
      diff = require('diff');
    }
  }

  // toEqual matcher does not distinguish different Error objects
  jasmine.getEnv().addEqualityTester(function(a, b) {
    if (a instanceof Error && b instanceof Error) {
      return (a.message === b.message);
    }
  });

  var getMessage = function(actualMessage, expectedMessage) {
    actualMessage = actualMessage ? actualMessage.toString() : '';
    expectedMessage = expectedMessage ? expectedMessage.toString() : '';

    var colorize = function(value, color) {
      if (value.value) {
        value = value.value;
      }
      if (isBrowserEnv) {
        return '<span class="color-' + color + '">' + value + '</span>';
      } else {
        if (isCommonJS) {
          var colors = {
            addition: 'cyan',
            deletion: 'yellow',
            common: 'grey'
          };
          return value[colors[color]];
        }
      }
      return value;
    };

    var colorScheme = [
      ['with', 'common'],
      ['additions', 'addition'],
      ['and', 'common'],
      ['deletions', 'deletion']
    ].map(function(item) {
      return colorize(item[0], item[1]);
    }).join(' ');

    var messagesDiff = function() {
      if (typeof 'a'[0] === 'undefined') {
        // this browser does not support ES5 bracket notation on a string
        return colorize(expectedMessage, 'deletion') + '<br>' + colorize(actualMessage, 'addition');
      }

      return diff.diffChars(expectedMessage, actualMessage).reduce(function(result, part) {
        var color = part.added ? 'addition' : part.removed ? 'deletion' : 'common';
        return result + colorize(part, color);
      }, '');
    };

    var createMessage = function(prompt, colorScheme, messagesDiff) {
      if (isBrowserEnv) {
        var el = document.createElement('div');
        el.className = 'custom-message';
        el.innerHTML = '<div class="prompt">' + prompt + '</div>' +
        '<div class="color-scheme">' + colorScheme + ':</div>' +
        '<div class="message-diff">' + messagesDiff + '</div>';
        return el;
      }

      return prompt + ' ' + colorScheme + ':\n\t' + messagesDiff;
    };

    return createMessage('See diff of expected and actual message', colorScheme, messagesDiff());
  };

  var wrapAddMatcherResult = function(assertion, expectedMessage) {
    var addMatcherResult = assertion.spec.addMatcherResult;
    assertion.spec.addMatcherResult = function(result) {
      if (result.message === expectedMessage) {
        result.passed_ = true;
        delete result.message;
      } else {
        result.message = getMessage(result.message, expectedMessage);
      }

      addMatcherResult.call(assertion.spec, result);
    };
  };

  var wrapExpect = function(expect, expectedMessage, customMessage) {
    return function(actual) {
      if (isPromise(actual)) {
        return wrapMatchers(customMessage, actual, expectedMessage);
      }

      var assertion = expect(actual);
      wrapAddMatcherResult(assertion, expectedMessage.toString());
      return assertion;
    };
  };

  var match = function(assertion, matcher, not, expected) {
    if (not) {
      assertion.not[matcher](expected);
    } else {
      assertion[matcher](expected);
    }
  };

  var wrapMatcher = function(matcher, promiseActual, not, customMessage, expectedMessage) {
    return function(expected) {
      promiseActual.then(function(actual) {
        var assertion = global.expectMessageToEqual(expectedMessage).since(customMessage).expect(actual);

        if (isPromise(expected)) {
          expected.then(function(expectedValue) {
            match(assertion, matcher, not, expectedValue);
          }, function(expectedError) {
            match(assertion, matcher, not, expectedError);
          });
        } else {
          match(assertion, matcher, not, expected);
        }
      }, function(actualError) {
        var assertion = global.expectMessageToEqual(expectedMessage).since(customMessage).expect(actualError);

        if (isPromise(expected)) {
          expected.then(function(expectedValue) {
            match(assertion, matcher, not, expectedValue);
          }, function(expectedError) {
            match(assertion, matcher, not, expectedError);
          });
        } else {
          match(assertion, matcher, not, expected);
        }
      });
    };
  };

  // slightly modified code from https://github.com/angular/jasminewd
  var wrapMatchers = function(customMessage, promiseActual, expectedMessage) {
    var promises = {not: {}};
    var env = jasmine.getEnv();
    var matchersClass = env.currentSpec.matchersClass || env.matchersClass;

    for (var matcher in matchersClass.prototype) {
      promises[matcher] = wrapMatcher(matcher, promiseActual, false, customMessage, expectedMessage);
      promises.not[matcher] = wrapMatcher(matcher, promiseActual, true, customMessage, expectedMessage);
    }

    return promises;
  };

  var wrapSince = function(since, expectedMessage) {
    return function(customMessage) {
      var sinceObj = since(customMessage);
      sinceObj.expect = wrapExpect(sinceObj.expect, expectedMessage, customMessage);
      return sinceObj;
    };
  };

  var defineExpectMessageToEqual = function() {
    global.expectMessageToEqual = function(expectedMessage) {
      return {
        since: wrapSince(global.since, expectedMessage),
        expect: wrapExpect(global.expect, expectedMessage)
      };
    };
  };


  if (isBrowserEnv) {
    defineExpectMessageToEqual();
  } else {
    if (isCommonJS) {
      module.exports = defineExpectMessageToEqual();
    }
  }
})();
