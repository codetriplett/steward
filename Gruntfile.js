module.exports = function (grunt) {
	function merge (path, files, resolve) {
		const lib = path.startsWith('./lib/');
		const regex = lib ? /^/ : /(^|[ \r\n]*)(import[^;]*;[ \r\n]*|export (default )?|module.exports = )/g;

		grunt.file.write(path, files.map(path => {
			let file = grunt.file.read(path).replace(regex, '');

			if (!resolve) {
				return file;
			}

			return resolve(file, path.match(/[^.\/]+(?=\.[^\/]+$)/)[0]);
		}).join('\n'));
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			main: {
				files: {
					'dist/steward.min.js': 'dist/steward.min.js',
					'lib/render/locate.js': 'src/render/locate.js',
					'lib/render/modify.js': 'src/render/modify.js',
					'lib/render/index.js': 'src/render/index.js',
					'lib/server/fetch.js': 'src/server/fetch.js',
					'lib/server/index.js': 'src/server/index.js',
					'lib/steward.js': 'src/steward.js'
				}
			}
		},
		uglify: {
			main: {
				options: {
					banner: [
						'/*',
						' <%= pkg.name %>',
						' v<%= pkg.version %>',
						' */'
					].join('')
				},
				files: {
					'dist/steward.min.js': 'dist/steward.min.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('before', () => {
		merge('./dist/steward.min.js', [
			'./src/steward.js'
		]);
	});

	grunt.registerTask('after', function () {
		const path = './dist/steward.min.js';

		grunt.file.write(path, `(function () {
			${grunt.file.read(path)}
			window.steward = steward;
		})();`);
	});

	grunt.registerTask('default', ['before', 'babel', 'after', 'uglify']);
};
