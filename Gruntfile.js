module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            js: {
                files: {

                    'pixi.min.js': [
                        "lib/external/pixi.js"
                    ],

                    'lib.min.js': [

                        "lib/external/howler.core.js",
                        "lib/external/font.js",
                        "lib/external/sat.js",
                        "lib/external/kibo.js",
                        "lib/external/visibility.core.js",
                        "lib/external/store.js",
                        "lib/external/pixi-extend.js",
                        "lib/external/sat-extend.js",
                        
                        "lib/external/bezier/utils.js",
                        "lib/external/bezier/bezier.js",
                        "lib/external/bezier/poly_bezier.js",

                        "lib/utility/*.js",

                        "lib/tweens/actions.js",
                        "lib/tweens/bezier.js",
                        "lib/tweens/tween.js",
                        "lib/tweens/*.js",

                        "lib/events/*.js",

                        "lib/resources/*.js",

                        "lib/display/h_navigator.js",
                        "lib/display/sprite.js",
                        "lib/display/h_screen.js",

                        "lib/ui/label.js",
                        "lib/ui/popup.js",
                        "lib/ui/scrollview_content.js",
                        "lib/ui/*.js"


                    ],

                    'app.min.js': [
                        
                        "app/system/app.js",
                        "app/system/style.js",
                        "app/system/boot.js",
                        "app/system/loading_screen.js",
                        "app/system/notes.js",
                        "app/system/rotate_layer.js",
                        
                        "assets/assets.js",

                        "app/**/*.js"
                    ]

                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};