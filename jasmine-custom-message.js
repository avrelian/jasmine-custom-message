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
  var isCommonJS = typeof module !== 'undefined' && module.exports;


  var ofType = function(val) {
    var types = [].slice.call(arguments, 1);
    var valType = val === null ? 'null' : typeof val;
    return types.indexOf(valType) > -1;
  };

  var getMessage = function(assertion, message, args) {
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

    return message.toString();
  };

  var wrapExpect = function(expect, customMessage) {
    return function(actual) {
      var assertion = expect(actual);
      if (! ofType(customMessage, 'undefined', 'null')) {
        assertion.message = assertion.not.message = function() {
          return getMessage(assertion, customMessage, arguments);
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