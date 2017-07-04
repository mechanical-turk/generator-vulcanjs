module.exports = (grunt) => {
  grunt.initConfig({
    babel: {
      options: {
        plugins: [
          'transform-object-rest-spread',
          'transform-es2015-modules-commonjs',
          'transform-es2015-shorthand-properties',
        ],
      },
      dist: {
        files: [{
          expand: true,
          cwd: './src/',
          src: ['**/*.js', '!**/templates/**'],
          dest: './',
        }],
      },
    },
    copy: {
      templates: {
        files: [{
          expand: true,
          cwd: './src/',
          src: ['**/templates/**'],
          dest: './',
        }],
      },
    },
    // watch: {
    //   src: {
    //     files: [{
    //       expand: true,
    //       cwd: './src/',
    //       src: ['**/templates/**'],
    //       dest: './',
    //     }],
    //     tasks: ['babel', 'copy'],
    //   },
    // },
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask(
    'default',
    [
      'babel',
      'copy',
      // 'watch',
    ]
  );
};
