import fs from 'fs';

const types = {
	txt: 'text/plain; charset=utf-8',
	json: 'application/json; charset=utf-8'
};

export function fetch (path, res) {
	if (typeof window === 'object') {
		return window.fetch(path).then(data => data.json);
	}

	const extension = path.match(/(\.[a-z]+)?$/)[0].slice(1);
	const type = types[extension] || types.txt;
	const encoding = type.split('; charset=')[1];
	
	return fs.readFile(path, encoding, (err, content) => {
		if (!res) {
			return JSON.parse(err ? {} : content);
		}

		let status = 200;
	
		if (content === undefined) {
			content = 'File not found';
			status = 404;
		} else if (!(content instanceof Buffer)) {
			content = String(content);
		}
	
		res.writeHead(status, {
			'Content-Length': Buffer.byteLength(content),
			'Content-Type': type
		});
	
		res.end(content);
	});
}
