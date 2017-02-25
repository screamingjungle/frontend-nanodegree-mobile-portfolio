'use strict'

var ngrok = require('ngrok');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.initConfig({

    clean: {
      css: ['docs/**/*.css'],
      js: ['docs/**/*.js'],
      html: ['docs/**/*.html']
    },

    copy: {
      dist: {
        cwd: 'src/', 
        expand: true, 
        src: '**', dest: 'docs/'
      }
    },

    uncss: {
      dist: {
        files: [
          { src: 'src/*.html', dest: 'docs/css/compiled.min.css'}
        ]
      },
      options: {
        compress:true
      }
    },
    
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'docs/css',
          src: ['*.css', '!*.min.css', '!_*.css'],
          dest: 'docs/css',
          ext: '.min.css'
        },{
          expand: true,
          cwd: 'docs/views/css',
          src: ['*.css', '!*.min.css', '!_*.css'],
          dest: 'docs/views/css',
          ext: '.min.css'
        },
        
        ]
      },
      critical: {
        files: [{
          expand: true,
          cwd: 'docs/css',
          src: ['_critical.css', '!*.min.css'],
          dest: 'docs/css',
          ext: '.min.css'
        }]
      }
    },

    processhtml: {
      dist: {
        files: { 
          'docs/index.html': ['docs/index.html'], 
          'docs/views/pizza.html': ['docs/views/pizza.html'],
        }
      },
    },

    uglify: {
      dist: {
        files: {
          'docs/js/perfmatters.js': ['docs/js/perfmatters.js'],
          //'docs/js/fontfaceobserver_include.js': ['src/js/fontfaceobserver_include.js'],
          //'docs/js/loadcss_include.js': ['src/js/loadCSS.js', 'src/js/cssrelpreload.js'],
        }
      }
    },


    csslint: {

      options: {
        csslintrc: '.csslintrc'
      },
      strict: {
        options: {
          import: 2
        },
        src: ['docs/css/style.css']
      },
    },

      
    criticalcss: {
        custom: {
            options: {
                url: "http://localhost:8181",
                width: 1200,
                height: 900,
                outputfile: "docs/css/_critical.css",
                filename: "docs/css/style.css", // Using path.resolve( path.join( ... ) ) is a good idea here
                buffer: 800*1024,
                ignoreConsole: false
            }
        }
    },

    critical: {
      extract: {
          options: {
              base: './',
              css: [
                  'docs/css/style.css',
                  'docs/css/print.css'
              ],
              width: 1024,
              height: 768,
              minify: true,
              extract: true,
              ignore: ['@font-face',/url\(/]
          },
          src: 'docs/index.html',
          dest: 'docs/css/_critical.css',
      }
    },

    minifyHtml: {
        dist: {
            files: {
                'docs/index.html': 'docs/index.html',
                'docs/project-2048.html': 'docs/project-2048.html',
                'docs/project-webperf.html': 'docs/project-webperf.html',
                'docs/project-mobile.html': 'docs/project-mobile.html',
                'docs/views/pizza.html': 'docs/views/pizza.html',
            }
        }
    },
    
    imagemin: {
       dist: {
          options: {
            optimizationLevel: 5
          },
          files: [{
             expand: true,
             cwd: 'src/img/',
             src: ['*.{png,jpg,gif}'],
             dest: 'docs/img/'
          }, {
             expand: true,
             cwd: 'src/views/images/',
             src: ['*.{png,jpg,gif}'],
             dest: 'docs/views/images/'
          }]
       }
    },

    pagespeed: {
      options: {
        nokey: true
      },
      local: {
        options: {
          locale: "en_GB",
          strategy: "desktop",
          threshold: 90
        }
      },
      mobile: {
        options: {
          locale: "en_GB",
          strategy: "mobile",
          threshold: 90
        }
      }
    }
  });

  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 9292;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url + '/docs');
      grunt.task.run('pagespeed');
      
//      grunt.config.set('criticalcss.custom.options.url', url + '/docs');
//      grunt.task.run('criticalcss');

      done();
    });
  });

  grunt.registerTask('default', [ 
    'clean', 
    'newer:copy',

    'uglify',

//    'critical', 
//    'criticalcss',
    'cssmin',
    //'uncss',

    'processhtml', 
    'minifyHtml',

//    'newer:csslint',
    'newer:imagemin:dist', 
    //'psi-ngrok'
  ]);
}


