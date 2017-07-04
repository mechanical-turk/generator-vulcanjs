module.exports = (grunt) => {
  grunt.initConfig({
    babel: {
      options: {
        plugins: [
          'transform-object-rest-spread',
          'transform-es2015-modules-commonjs',
        ],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js', '!**/templates/**'],
          dest: './',
          ext: '.js',
        }],
      },
    },
  });
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['babel']);
};
