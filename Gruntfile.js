'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Rewrite middleware to get pushstate working in dev mode
  var modRewrite = require('connect-modrewrite');

  var target = grunt.option('target') || 'dev';

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require(require('path').resolve(__dirname, 'bower.json')).appPath || 'public',
      dist: target
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma:serve']
      },
      less: {
        files: ['<%= yeoman.app %>/styles/**/*.less'],
        tasks: ['less']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/data/**/*.json'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: '*'
      },
      livereload: {
        options: {
          open: 'http://127.0.0.1:9000',
          base: [
            '.tmp',
            '<%= yeoman.app %>',
            'views'
          ],
          middleware: function(connect, options) {
            var middlewares = [];
            middlewares.push(modRewrite([
              // Matches everything that does not contain a dot
              '^[^\\.]*$ /index.html [L]'
            ]));
            options.base.forEach(function(base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          port: 9001,
          open: 'http://127.0.0.1:9001',
          base: '<%= yeoman.dist %>',
          middleware: function(connect, options) {
            var middlewares = [];
            middlewares.push(modRewrite([
              // Matches everything that does not contain a dot
              '^[^\\.]*$ /index.html [L]'
            ]));
            middlewares.push(connect.static(options.base));
            return middlewares;
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: {
        files: [{
          dot: true,
          src: [
            '.tmp'
          ]
        }]
      },
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app, i.e. fill
    // the bower:js tags inside index.html
    wiredep: {
      app: {
        src: [
          '<%= yeoman.app %>/index.html'
        ],
        ignorePath: '<%= yeoman.app %>',
        cwd: '.',
        exclude: [
          '/bower_components/bootstrap/dist/js/bootstrap.js',
          '/bower_components/jquery/dist/jquery.js'
        ],
        fileTypes: {
          html: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"]([^'"]+)/gi,
              css: /<link.*href=['"]([^'"]+)/gi
            },
            replace: {
              js: '<script src="/{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="/{{filePath}}" />'
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/*.ico',
          '<%= yeoman.dist %>/styles/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/scripts/{,*/}*.js'
        ],
      }
    },

    filerev_assets: {
      dist: {
        options: {
          dest: '<%= yeoman.dist %>/assets.json',
          cwd: '<%= yeoman.dist %>/',
          prefix: '<%= yeoman.static_prefix %>'
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    // Default flow: 'js': ['concat', 'uglifyjs'], 'css': ['concat', 'cssmin']
    useminPrepare: {
      dist: {
        src: ['<%= yeoman.app %>/index.html', '<%= yeoman.app %>/ads.html', '<%= yeoman.app %>/homepage.html', '<%= yeoman.app %>/postthread.html']
      },
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

  // Generate source maps
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: ['images/**/*.{png,jpg,jpeg,gif}', 'styles/images/**/*.{png,jpg,jpeg,gif}'],
          dest: '<%= yeoman.dist %>/'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: 'styles/icons/**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.app %>/'
        },{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: ['images/icons.sprite.png'],
          dest: '<%= yeoman.app %>/'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: ['images/**/*.svg', 'fonts/**/*.svg'],
          dest: '<%= yeoman.dist %>/'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: ['icons/**/*.svg'],
          dest: '<%= yeoman.app %>/'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Show compression report after CSS minification by usemin
    cssmin: {
      options: {
        report: 'gzip'
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'bower_components/ZeroClipboard/index.swf',
            'views/**/*.html',
            'images/**/*.{webp}', // not minified
            'data/**/*.json',
            'fonts/**/*.{eot,ttf,woff}',
            'styles/**/*.{eot,ttf,woff}'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp/concat',
          src: 'styles/**/*.css'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'less:server'
      ],
      test: [
        'less:dist'
      ],
      dist: [
        'less:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Compiles Less files to CSS
    less: {
      server: {
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/base.less'
        }
      },
      dist: {
        options: {
          cleancss: true,
          report: 'gzip'
        },
        files: {
          '.tmp/styles/main.css': '<%= yeoman.app %>/styles/base.less'
        }
      }
    },

    // Inject production configs
    replace: {
      staticfiles: {
        options: {
          usePrefix: false,
          patterns: [{
            match: '\\(\/styles\/',
            replacement: '(<%= yeoman.static_prefix_rewrites %>styles/',
            expression: false,
          },
          {
            match: '\\(\/images\/',
            replacement: '(<%= yeoman.static_prefix_rewrites %>images/',
            expression: false,
          }
          // ,
          // {
          //   match: '\/fonts\/',
          //   replacement: '/static/fonts/',
          //   expression: false,
          // }
          ]
        },
        files: [
          {
            expand: true,
            src: [
              '<%= yeoman.dist %>/styles/*.css',
              '<%= yeoman.dist %>/styles/*.css',
              '<%= yeoman.dist %>/scripts/*.js'
            ],
            dest: ''
          }
        ]
      },
      fixjs: {
        options: {
          usePrefix: false,
          patterns: [{
            match: '\/bower_components\/ZeroClipboard\/index.swf',
            replacement: '<%= yeoman.static_abs_prefix_rewrites %>bower_components\/ZeroClipboard\/index.swf',
            expression: false,
          }
          ]
        },
        files: [
          {
            expand: true,
            src: [
              '<%= yeoman.dist %>/scripts/*.js'
            ],
            dest: ''
          }
        ]
      },
    },

    // Karma Test Runner. Run the Unit and Intergration (e2e) tests.
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        singleRun: false,
        autoWatch: true
      },
      serve: {
        singleRun: true
      },
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      }
    },

    grunticon: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['icons/*.svg', 'icons/*.png'],
          dest: '<%= yeoman.app %>/styles/icons'
        }],
        options: {
          customselectors: {
            '*': ['.icon-$1:before']
          }
        }
      }
    },

    sprite:{
      all: {
        src: '<%= yeoman.app %>/styles/icons/png/*.png',
        destImg: '<%= yeoman.app %>/images/icons.sprite.png',
        imgPath: '/images/icons.sprite.png',
        destCSS: '<%= yeoman.app %>/styles/icons/icons.fallback.sprite.css'
      },
      toolbar: {
        src: '<%= yeoman.app %>/images/toolbar/*.gif',
        destImg: '<%= yeoman.app %>/images/toolbar.sprite.png',
        imgPath: '/images/toolbar.sprite.png',
        destCSS: '<%= yeoman.app %>/styles/images/toolbar-sprite.css'
      }
    },

  });


  // Run the app in a local environement, i.e. spawn a web serve
  // and use grunt-livereload to automatically refresh the browser
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);


  grunt.registerTask('icons', [
    'svgmin:icons',
    'grunticon',
    'sprite',
    'imagemin:icons'
  ]);

  // Define browsertest & unittest
  // Add JSHint to the build task!!
  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant',
    'bower-install-simple',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat', // usemin flow
    'ngmin',
    'copy:dist',
    'uglify', // usemin flow
    'cssmin', // usemin flow
    'filerev',
    'filerev_assets',
    'usemin',
    'htmlmin',
    'replace'
  ]);
  grunt.registerTask('default', [
    'newer:jshint',
    'build',
    'karma:serve'
  ]);
};
