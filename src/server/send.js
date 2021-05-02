import { types } from '.';
import { file } from './file';

export function send (res, content, type, status = 200) {
	if (typeof content !== 'string') {
		if (type === types.html) {
			file.bind(this)('404.html').then(it => send(res, it, type, 404));
			return;
		}

		content = JSON.stringify(content);
		if (!type) type = types.json;
	}

	if (content === undefined) {
		status = 404;
		content = 'Not found';
		type = types.txt;
	}

	const utf8 = !/^image\/(?!svg)/.test(type);

	res.writeHead(status, {
		'Content-Length': Buffer.byteLength(content),
		'Content-Type': `${type}${utf8 ? '; charset=utf-8' : ''}`
	});

	res.end(content);
}
