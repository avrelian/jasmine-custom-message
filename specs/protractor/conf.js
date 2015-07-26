var colors = require('colors');
colors.enabled = true;

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../nodejs/jasmine-custom-message.spec.js', './test-jasmine-custom-message.js']
};