import { readdir, readFile, writeFile } from 'fs';
import { types } from '.';
import { parse } from './parse';

export function file (url, ...params) {
	let fn = readdir, path, extension;

	if (url.startsWith('@')) {
		path = require.resolve(url).slice(0, -3);
		extension = 'js';
	} else {
		const { '': dir } = this;
		[path, extension] = parse(url);
		path = `${dir}/${path}`;
	}

	if (extension !== undefined) {
		const utf8 = !/^image\/(?!svg)/.test(types[extension]);
		path += `.${extension}`;

		if (params.length) {
			const [body] = params;
			if (typeof body === 'object') params[0] = JSON.stringify(body);
			fn = writeFile;
		} else {
			fn = readFile;
		}

		params.splice(1, params.length, utf8 ? 'utf8' : '');
	}

	return new Promise((resolve, reject) => {
		fn(path, ...params, (err, data = {}) => err ? reject(err) : resolve(data));
	});
}
