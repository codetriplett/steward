import { readdir, readFile, writeFile } from 'fs';
import { types } from '.';
import { parse } from './parse';

export function file (url, ...params) {
	const { '': directory } = this;
	let [path, extension] = parse(url);
	path = `${directory}/${path}`;
	let fn = readdir;

	if (extension !== undefined) {
		const utf8 = !/^image\/(?!svg)/.test(types[extension]);
		path += `.${extension}`;
		fn = params.length ? writeFile : readFile;
		params.splice(1, params.length, utf8 ? 'utf8' : '');
	}

	return new Promise((resolve, reject) => {
		fn(path, ...params, (err, data) => err ? reject(err) : resolve(data));
	});
}
