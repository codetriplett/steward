export function send (res, content, type = 'txt', status = 200) {
	const utf8 = !/^image\/(?!svg)/.test(type);

	if (!(content instanceof Buffer) && typeof content !== 'string') {
		status = 404;
		content = 'Not found';
	}

	res.writeHead(status, {
		'Content-Length': Buffer.byteLength(content),
		'Content-Type': `${types[type]}${utf8 ? '; charset=utf-8' : ''}`
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

export function file (path, extension, callback, ...rest) {
	if (!extension) return Promise.reject(`Missing extension: ${path}`);
	const type = types[extension];
	const options = !/^image\/(?!svg)/.test(type) ? ['utf8'] : [];
	if (rest.length) options.unshift(rest[0]);

	return new Promise((resolve, reject) => {
		callback(`${path}.${extension}`, ...params, (err, data = {}) => err ? reject(err) : resolve(data));
	});
}
