module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      core: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/core.js' ]
      },
      bonus: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/bonus.js' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask( 'default', [ 'mochaTest' ] );
};
