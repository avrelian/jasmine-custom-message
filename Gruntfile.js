'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      all: [
        'jasmine-custom-message.js',
        'Gruntfile.js',
        'specs/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jasmine_node: {
      // options have no effect in `grunt-jasmine-node`#v0.1.0
      test: {}
    },

    protractor: {
      options: {
      },
      jasmine_custom_message: {
        options: {
          configFile: 'specs/protractor/conf.js',
          args: {
            verbose: true
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('test', ['jshint', 'jasmine_node','protractor']);
  grunt.registerTask('default', ['test']);

};
