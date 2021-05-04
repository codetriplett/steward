import { types } from '.';
import { file } from './file';

export function send (res, content, type, status = 200) {
	if (!(content instanceof Buffer) && typeof content !== 'string') {
		if (!type) {
			file.bind(this)('404.html').then(it => send(res, it, type, 404));
			return;
		}

		if (content === undefined) {
			status = 404;
			content = 'Not found';
		} else {
			content = JSON.stringify(content);
		}
	} else if (!type) {
		type = types.html;
	}

	const utf8 = !/^image\/(?!svg)/.test(type);

	res.writeHead(status, {
		'Content-Length': Buffer.byteLength(content),
		'Content-Type': `${type}${utf8 ? '; charset=utf-8' : ''}`
	});

	res.end(content);
}
