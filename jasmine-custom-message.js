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
  var isBrowserEnv = global.window && global === global.window;
  var isCommonJS = typeof module !== 'undefined' && module.exports;

  var ofType = function(val) {
    var types = [].slice.call(arguments, 1);
    var valType = val === null ? 'null' : typeof val;
    return types.indexOf(valType) > -1;
  };

  var CUSTOM_MESSAGES;
  var getCustomMessagesPropertyName = function(spec) {
    var customMessagesPropertyName = 'customMessages';
    while (typeof spec[customMessagesPropertyName] !== 'undefined') {
      customMessagesPropertyName += '_' + Math.random().toString(32).slice(2);
    }
    return customMessagesPropertyName;
  };

  var wrapIt = function() {
    if (global.jasmine && global.it) {
      global.it = (function(it) {
        return function(desc, func, customMessages) {
          var spec = it(desc, func);
          if (typeof CUSTOM_MESSAGES === 'undefined') {
            CUSTOM_MESSAGES = getCustomMessagesPropertyName(spec);
          }
          if (ofType(customMessages, 'function', 'string', 'number', 'boolean')) {
            customMessages = {0: customMessages};
          }
          if (customMessages) {
            spec[CUSTOM_MESSAGES] = customMessages;
          }
          return spec;
        };
      })(global.it);
    }
  };

  var wrapExpect = function() {
    if (global.jasmine && global.expect) {
      global.expect = (function(expect) {
        return function(actual) {
          var assertion = expect(actual);
          var spec = assertion.spec;
          var assertionId = spec.results_.totalCount;
          var message = spec[CUSTOM_MESSAGES] && spec[CUSTOM_MESSAGES][assertionId];
          if (! ofType(message, 'undefined', 'null')) {
            assertion.message = function() {
              while (! ofType(message, 'string', 'number', 'boolean')) {
                switch (true) {
                  case ofType(message, 'undefined', 'null'):
                    message = 'You cannot use `' + message + '` as a custom message';
                    break;
                  case ofType(message, 'function'):
                    message = message.apply(assertion, arguments);
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

              return message;
            };
          }
          return assertion;
        };
      })(global.expect);
    }
  };

  var init = function() {
    wrapIt();
    wrapExpect();
  };

  if (isBrowserEnv) {
    init();
  } else {
    if (isCommonJS) {
      module.exports = init();
    }
  }
})();