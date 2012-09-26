module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		test: {
			files: ['test/**/*.js']
		},
		simplemocha: {
			all: {
				src: 'test/**/*.js',
				options: {
					globals: ['describe', 'it', 'before'],
					timeout: 3000,
					ignoreLeaks: false
					// ui: 'bdd',
					// reporter: 'tap'
				}
			}
		},
		lint: {
			files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				node: true
			},
			globals: {
				describe: true,
				it: true,
				before: true,
				exports: true
			}
		}
	});

	// Import custom tasks (and override the default test with mocha test).
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.registerTask('test', 'simplemocha');

	// Default task.
	grunt.registerTask('default', 'lint test');

};