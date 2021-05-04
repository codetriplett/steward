module.exports = function (grunt) {
	function merge (path, files, resolve) {
		const regex = /(^|[ \r\n]*)(import[^;]*;[ \r\n]*|export (default )?)/g;

		grunt.file.write(path, files.map(path => {
			const file = grunt.file.read(path).replace(regex, '');
			if (!resolve) return file;
			return resolve(file, path);
		}).join('\n'));
	}

	function direct (name) {
		if (typeof name !== 'object') {
			return `if (typeof define === 'function' && define.amd) {
				define(function () { return ${name}; });
			} else if (typeof module !== 'undefined' && module.exports) {
				module.exports = ${name};
			} else if (typeof window === 'object' && window.document) {
				window.${name} = ${name};
			}`;
		}

		return Object.entries(name).map(([name, imports]) => `
			var ${imports.join(', ')};
			if (typeof module !== 'undefined' && module.exports) {
				var library = require('${name}');
				${imports.map(it => `${it} = library.${it};`).join('')}
			}
		`).join('\n');
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			main: {
				files: {
					'dist/steward.min.js': 'dist/steward.min.js'
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
			'./src/server/file.js',
			'./src/server/index.js',
			'./src/server/parse.js',
			'./src/server/receive.js',
			'./src/server/render.js',
			'./src/server/send.js',
			'./src/server/types.js',
			'./src/index.js'
		]);
	});

	grunt.registerTask('after', function () {
		const path = './dist/steward.min.js';

		grunt.file.write(path, `(function () {
			${direct({
				http: ['createServer'],
				fs: ['readdir', 'readFile', 'writeFile']
			})}
			${grunt.file.read(path)}
			${direct('steward')}
		})();`);
	});

	grunt.registerTask('default', [
		'before',
		'babel',
		'after',
		'uglify'
	]);
};
