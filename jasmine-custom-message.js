/*
 * jasmine-custom-message
 * https://github.com/avrelian/jasmine-custom-message
 *
 * Copyright (c) 2014 Sergey Radchenko
 * Licensed under the MIT license.
 */

'use strict';

(function() {
  var global = Function('return this')();
  if (! (global.jasmine && global.expect)) {
    return;
  }

  var isBrowserEnv = global.window && global === global.window;
  var isCommonJS = typeof module !== 'undefined' && typeof module.exports === 'object';

  var isPromise = function(val) {
    return val && typeof val.then === 'function';
  };

  var ofType = function(val) {
    var types = [].slice.call(arguments, 1);
    var valType = val === null ? 'null' : typeof val;
    return types.indexOf(valType) > -1;
  };

  var formatString = function(data, message) {
    message = message.replace(/#\{actual\}/g, data.actual);
    message = message.replace(/#\{expected\}/g, data.expected);
    return message;
  };

  var getMessage = function(assertion, message, data, args) {
    while (! ofType(message, 'string', 'number', 'boolean')) {
      switch (true) {
        case ofType(message, 'undefined', 'null'):
          message = 'You cannot use `' + message + '` as a custom message';
          break;
        case ofType(message, 'function'):
          message = message.apply(assertion, args);
          break;
        case message && ofType(message.toString, 'function') && message.toString().indexOf('[object ') !== 0:
          message = message.toString();
          break;
        case JSON && ofType(JSON.stringify, 'function'):
          message = JSON.stringify(message);
          break;
        default:
          message = 'N/A';
      }
    }

    if (ofType(message, 'string')) {
      return formatString(data, message);
    }

    return message.toString();
  };

  var match = function(assertion, matcher, not, expected) {
    if (not) {
      assertion.not[matcher](expected);
    } else {
      assertion[matcher](expected);
    }
  };

  var wrapMatcher = function(matcher, promiseActual, not, customMessage) {
    return function(expected) {
      promiseActual.then(function(actual) {
        var assertion = global.since(customMessage).expect(actual);

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
        var assertion = global.since(customMessage).expect(actualError);

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
  var wrapMatchers = function(customMessage, promiseActual) {
    var promises = {not: {}};
    var env = jasmine.getEnv();
    var matchersClass = env.currentSpec.matchersClass || env.matchersClass;

    for (var matcher in matchersClass.prototype) {
      promises[matcher] = wrapMatcher(matcher, promiseActual, false, customMessage);
      promises.not[matcher] = wrapMatcher(matcher, promiseActual, true, customMessage);
    }

    return promises;
  };

  var wrapExpect = function(expect, customMessage) {
    return function(actual) {
      if (isPromise(actual)) {
        return wrapMatchers(customMessage, actual);
      }

      var assertion = expect(actual);
      if (! ofType(customMessage, 'undefined', 'null')) {
        assertion.message = assertion.not.message = function() {
          var data = {
            actual: actual,
            expected: arguments[0]
          };
          return getMessage(assertion, customMessage, data, arguments);
        };
      }
      return assertion;
    };
  };

  var defineSince = function() {
    global.since = function(customMessage) {
      return {
        expect: wrapExpect(global.expect, customMessage)
      };
    };
  };

  if (isBrowserEnv) {
    defineSince();
  } else {
    if (isCommonJS) {
      module.exports = defineSince();
    }
  }
})();
