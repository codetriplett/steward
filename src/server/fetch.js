import { readFile } from 'fs';

const types = {
	txt: 'text/plain; charset=utf-8',
	json: 'application/json; charset=utf-8',
	html: 'text/html; charset=utf-8'
};

export async function fetch (path, res, callback) {
	if (typeof window === 'object') {
		return window.fetch(path).then(data => data.json);
	}

	const extension = path.match(/(\.[a-z]+)?$/)[0].slice(1);	
	let type = types[extension] || types.txt;
	const encoding = type.split('; charset=')[1];

	return readFile(path, encoding, async (err, content) => {
		if (!res) {
			return err ? {} : JSON.parse(content);
		}

		let status = 200;
	
		if (content === undefined) {
			content = 'File not found';
			status = 404;
		} else if (!(content instanceof Buffer)) {
			content = String(content);
			
			if (callback) {
				content = await callback(content);

				if (typeof content === 'object') {
					content = JSON.stringify(content);
					type = types.json;
				} else {
					type = types.html;
				}
			}
		}
	
		res.writeHead(status, {
			'Content-Length': Buffer.byteLength(content),
			'Content-Type': type
		});
	
		res.end(content);
	});
}
