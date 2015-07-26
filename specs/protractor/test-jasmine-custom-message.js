'use strict';

require('../common/expect-message-to-equal');
require('../../jasmine-custom-message');

(function(undefined) {
  var global = Function('return this')();
  var isBrowserEnv = global.window && global === global.window;
  var isCommonJS = typeof module !== 'undefined' && module.exports;

  var expectMessageToEqual = global.expectMessageToEqual;

  var test = function() {

    describe('jasmine with jasmine-custom-message', function() {

      describe('should generate custom failure message', function() {

        describe('when actual value is', function() {

          describe('a fulfilled promise', function() {

            describe('and expectation is matching', function() {

              it('positively', function() {
                expectMessageToEqual("2 bla-bla-bla 3").
                since(function(expected) {
                  return expected + ' bla-bla-bla ' + this.actual;
                }).
                expect(protractor.promise.fulfilled(3)).toEqual(2);
              });

              it('negatively', function() {
                expectMessageToEqual("3 bla-bla-bla 3").
                since(function(expected) {
                  return expected + ' bla-bla-bla ' + this.actual;
                }).
                expect(protractor.promise.fulfilled(3)).not.toEqual(3);
              });

            });

            describe('and expected value is', function() {

              describe('a fulfilled promise', function() {

                describe('and expectation is matching', function() {

                  it('positively', function() {
                    expectMessageToEqual("2 bla-bla-bla 3").
                    since(function(expected) {
                      return expected + ' bla-bla-bla ' + this.actual;
                    }).
                    expect(protractor.promise.fulfilled(3)).toEqual(protractor.promise.fulfilled(2));
                  });

                  it('negatively', function() {
                    expectMessageToEqual("3 bla-bla-bla 3").
                    since(function(expected) {
                      return expected + ' bla-bla-bla ' + this.actual;
                    }).
                    expect(protractor.promise.fulfilled(3)).not.toEqual(protractor.promise.fulfilled(3));
                  });

                });

              });

              describe('a rejected promise', function() {

                describe('and expectation is matching', function() {

                  it('positively', function() {
                    expectMessageToEqual("2 bla-bla-bla 3").
                    since(function(expected) {
                      return expected.message + ' bla-bla-bla ' + this.actual;
                    }).
                    expect(protractor.promise.fulfilled(3)).toEqual(protractor.promise.rejected(new Error('2')));
                  });

                  it('negatively', function() {
                    expectMessageToEqual("3 bla-bla-bla 3").
                    since(function(expected) {
                      return expected.message + ' bla-bla-bla ' + this.actual.message;
                    }).
                    expect(protractor.promise.fulfilled(new Error('3'))).not.toEqual(protractor.promise.rejected(new Error('3')));
                  });

                });

              });

            });

          });

          describe('a rejected promise', function() {

            describe('and expectation is matching', function() {

              it('positively', function() {
                expectMessageToEqual('2 bla-bla-bla 3').
                since(function(expected) {
                  return expected.message + ' bla-bla-bla ' + this.actual.message;
                }).
                expect(protractor.promise.rejected(new Error('3'))).toEqual(new Error('2'));
              });

              it('negatively', function() {
                expectMessageToEqual('3 bla-bla-bla 3').
                since(function(expected) {
                  return expected.message + ' bla-bla-bla ' + this.actual.message;
                }).
                expect(protractor.promise.rejected(new Error('3'))).not.toEqual(new Error('3'));
              });

            });

            describe('and expected value is', function() {

              describe('a rejected promise', function() {

                describe('and expectation is matching', function() {

                  it('positively', function() {
                    expectMessageToEqual('2 bla-bla-bla 3').
                    since(function(expected) {
                      return expected.message + ' bla-bla-bla ' + this.actual.message;
                    }).
                    expect(protractor.promise.rejected(new Error('3'))).toEqual(protractor.promise.rejected(new Error('2')));
                  });

                  it('negatively', function() {
                    expectMessageToEqual('3 bla-bla-bla 3').
                    since(function(expected) {
                      return expected.message + ' bla-bla-bla ' + this.actual.message;
                    }).
                    expect(protractor.promise.rejected(new Error('3'))).not.toEqual(protractor.promise.rejected(new Error('3')));
                  });

                });

              });

              describe('a fulfilled promise', function() {

                describe('and expectation is matching', function() {

                  it('positively', function() {
                    expectMessageToEqual("2 bla-bla-bla 3").
                    since(function(expected) {
                      return expected + ' bla-bla-bla ' + this.actual.message;
                    }).
                    expect(protractor.promise.rejected(new Error('3'))).toEqual(protractor.promise.fulfilled(2));
                  });

                  it('negatively', function() {
                    expectMessageToEqual("3 bla-bla-bla 3").
                    since(function(expected) {
                      return expected + ' bla-bla-bla ' + this.actual.message;
                    }).
                    expect(protractor.promise.rejected(new Error('3'))).not.toEqual(protractor.promise.fulfilled(3));
                  });

                });

              });

            });

          });

        });

      });

    });

  };

  if (isBrowserEnv) {
    test();
  } else {
    if (isCommonJS) {
      module.exports = test();
    }
  }
})();