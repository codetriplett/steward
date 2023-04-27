export const types = {
	txt: 'text/plain',
	html: 'text/html',
	css: 'text/css',
	js: 'application/javascript',
	mjs: 'application/javascript',
	json: 'application/json',
	bmp: 'image/bmp',
	gif: 'image/gif',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	svg: 'image/svg+xml',
	ico: 'image/x-icon',
};

export function send (res, content, type = 'txt', status = 200) {
	const utf8 = !/^image\/(?!svg)/.test(type);

	res.writeHead(status, {
		'Content-Length': Buffer.byteLength(content),
		'Content-Type': `${types[type]}${utf8 ? '; charset=utf-8' : ''}`,
	});

	res.end(content);
}

export function receive (req, limit = 1e6) {
	return new Promise((resolve, reject) => {
		let body = '';
				
		req.on('data', (data) => {
			body += data;
			if (body.length > limit) req.connection.destroy();
		});

		req.on('end', () => {
			try {
				resolve(JSON.parse(body));
			} catch (err) {
				reject();
			}
		});
	});
}

export function file (path, callback, ...rest) {
	const [, extension] = path.match(/^.*?(?:\.([^./]*))?$/);
	if (!extension) return Promise.reject(`Missing extension: ${path}`);
	const type = types[extension];
	const options = !/^image\/(?!svg)/.test(type) ? ['utf8'] : [];
	if (rest.length) options.unshift(rest[0]);

	return new Promise((resolve, reject) => {
		callback(path, ...options, (err, data = {}) => err ? reject(err) : resolve(data));
	});
}

export function parse (query = '', outerSep = '&', innerSep = '=') {
	const object = {};

	if (query) {
		for (const string of query.split(outerSep)) {
			const [name, ...values] = string.split(innerSep);
			object[name] = values.join(innerSep);
		}
	}

	return object;
}
