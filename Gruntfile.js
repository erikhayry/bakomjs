module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //uglifyjs bakom.js -o bakom.min.js -m --comments --source-map bakom.sourcemap --screw-ie8 --lint
        uglify: {
            options: {
                preserveComments: 'some',
                mangle: true,
                sourceMap : 'bakom.source-map.js'
            },
            build: {
                src: 'bakom.js',
                dest: 'bakom.min.js'
            }
        },
        watch: {
          scripts: {
            files: ['*.js'],
            tasks: ['uglify'],
            options: {
                spawn: false
            },
          },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['uglify']);


};