module.exports = function(grunt) {

    var timestamp = Date.now();

    var env = grunt.option('env') || "dev";

    var assetsPath = (env == 'dev') ? './' : '/player/';

    console.log(" ");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            default: ['dist/*']
        },

        copy: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**', '**/*', '!css/scss/**', '!css/scss/**/*'],
                    dest: 'dist'
                },
                {
                    expand: true,
                    cwd: 'bower_components/susy/sass',
                    src: ['**', '**/*'],
                    dest: 'src/css/scss/vendors/susy'
                }]
            }
        },

        sass: {
            options: {
                style: "compressed",
                sourcemap: "inline"
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/css/scss',
                    src: ['*.scss', '**/*.scss'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                diff: true,
                map: false
            },
            default: {
                src: 'dist/css/style.min.css'
            }           
        },

        concat: {
            options: {
                separator: ";\n"
            },
            default: {
                files: [{
                    src: ['bower_components/angular/angular.min.js', 'bower_components/angular-*/angular-*.min.js', 'bower_components/angular-*/**/angular-*.min.js', 'bower_components/jquery/dist/jquery.min.js'],
                    dest: 'dist/js/vendors.min.js'
                }]
            }
        },

        processhtml: {
            default: {
                options: {
                    data: {
                        assetsPath: assetsPath,
                        timestamp: timestamp,
                        env: env
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.html'],
                    dest: 'dist'
                }]
            }
        },

        watch: {
            options: {
                livereload: false,
            },
            css: {
                files: ['src/css/scss/**/*.scss'],
                tasks: ['css']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['html']
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['html']
            },
            img: {
                files: ['src/**/*.(jpg|png|gif)'],
                tasks: ['html']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'dist/**/*.css',
                        'dist/**/*.js',
                        'dist/**/*.html',
                        'dist/**/*.json',
                        'dist/**/*.(jpg|png|gif)'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist'
                }
            }
        },

        'ftp-deploy': {
            default: {
                auth: {
                    host: 'ftp.thebackpackerz.com',
                    port: 21,
                    authKey: env
                },
                src: 'dist/',
                dest: 'www/player/',
                forceVerbose: true
            }
        },

        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        },

        htmlhint: {
            default: {
                options: {
                    force: false,
                    htmlhintrc: '.htmlhintrc'
                },
                src: ['src/**/*.html']
            }
        },

        csslint: {
            default: {
                options: {
                    csslintrc: '.csslintrc'
                },
                src: ['dist/css/**/*.css']
            }
        },

        jshint: {
            default: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['src/js/**/*.js', '!src/js/ext.js']
            }
        },

        lintspaces: {
            default: {
                options: {
                    newline: false,
                    newlineMaximum: 2,
                    trailingspaces: true,
                    indentation: 'spaces',
                    spaces: 4
                },
                src: ['src/**/*.html', 'src/css/**/*.scss', '!src/css/scss/base/_normalize.scss', 'src/js/**/*.js', '!src/js/ext.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-lintspaces');

    grunt.registerTask('html', ['copy', 'processhtml']);
    grunt.registerTask('css', ['sass', 'autoprefixer']);
    grunt.registerTask('js', ['concat']);

    grunt.registerTask('test', ['htmlhint', 'csslint', 'jshint', 'lintspaces']);
    grunt.registerTask('deploy', ['publish', /*'ftp-deploy', */ 'gh-pages']);
    grunt.registerTask('publish', ['clean', 'html', 'css', 'js', 'test']);
    grunt.registerTask('serve', ['browserSync', 'watch']);
    grunt.registerTask('default', ['publish', 'serve']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
