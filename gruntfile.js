module.exports = function (grunt) {
    grunt.initConfig({
        // define source files and their destinations
        uglify: {
            dev: {
                files: [
                    {
                        expand: true,
                        src: [
                            'dist/*.js',
                            'dist/components/*.js',
                            'dist/logic/*.js',
                            'dist/static/*.js',
                        ],
                        dest: 'dist',
                        cwd: '.',
                        rename: (dst, src) => src,
                    },
                ],
            },
        },
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // register at least this one task
    grunt.registerTask('default', ['uglify']);
};
