module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        assert = require('assert');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: {
                src: [
                    'conkitty.js',
                    'parser.js',
                    'generator.js',
                    'types.js',
                    'errors.js',
                    'utils.js',
                    'bin/conkitty',
                    'Gruntfile.js'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },

        clean: {
            tmp: ['tmp']
        },

        conkitty: {
            test: {
                files: {
                    'tmp/test.ctpl.js': [
                        'test/basic.ctpl',
                        'test/selectors.ctpl',
                        'test/nodes.ctpl',
                        'test/ret.ctpl',
                        'test/namespaces.ctpl'
                    ]
                }
            }
        },

        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: {
                    'tmp/test.ctpl.min.js': 'tmp/test.ctpl.js',
                    'tmp/test.common.min.js': 'tmp/test.common.js'
                }
            }
        },

        qunit: {
            all: ['test/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerMultiTask('conkitty', function() {
        var Conkitty = require(__dirname + '/conkitty.js');

        this.files.forEach(function(f) {
            var conkitty = new Conkitty();

            f.src.map(function(filename) {
                conkitty.push(grunt.file.read(filename), path.resolve(path.dirname(filename)));
            });

            conkitty.generate();

            assert.deepEqual(
                conkitty.getIncludes(),
                [
                    'test/includes/ns1_file1.css',
                    'test/includes/ns1_file1.js',
                    'test/includes/logo-img.png',
                    'test/includes/logo.png',
                    'test/includes/logo.css',
                    'test/includes/ns2_file1.css',
                    'test/includes/ns2_file1.js',
                    'test/includes/button.css',
                    'test/includes/textarea.css',
                    'test/includes/c.css'
                ].map(function(filename) { return path.normalize(path.join(__dirname, filename)); }),
                'Incorrect test includes'
            );

            var common = f.dest.replace(/ctpl\.js$/, 'common.js');

            grunt.file.write(common, conkitty.getCommonCode());
            grunt.log.writeln('File "' + common + '" created.');

            grunt.file.write(f.dest, conkitty.getTemplatesCode());
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

    grunt.registerTask('default', ['jshint', 'clean', 'conkitty', 'uglify', 'qunit']);
};
