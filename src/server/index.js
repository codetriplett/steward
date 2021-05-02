import { createServer } from 'http';
import { file } from './file';
import { parse } from './parse';
import { receive } from './receive';
import { render } from './render';
import { send } from './send';
import { types } from './types';

export function server (port, url, ...callbacks) {
	let resources = [];

	if (Array.isArray(url)) {
		[url, ...resources] = url;
		resources = resources.map(it => it.replace(/^\/+/, ''));
	}

	const [, directory, _$, _] = url.match(/^(.*?)(?:\/|\\)([^/\\#]+)#(.*?)$/);
	resources.unshift(_$);
	const $ = require(`./${_$}`);
	const $_ = new Set();
	const routes = [[/^$/, ...callbacks.slice(0, 2)]];
	const context = { '': directory, _, $_, $, _$ };
	const filer = file.bind(context);
	const renderer = render.bind(context);
	const sender = send.bind(context);

	createServer((req, res) => {
		const { url, method } = req;
		if (method === 'DELETE') return;
		const params = method === 'GET' ? [] : [receive(req)];
		let [path, extension, props] = parse(url, ...params);
		let type, regex, callback, promise;

		if (extension !== undefined) {
			path += `.${extension}`;
			type = types[extension];

			if (resources.includes(path)) {
				return filer(path).then(it => sender(res, it, type));
			}

			const route = routes.find(([regex,, c]) => c && regex.test(path));
			if (!route) return sender(res);
			[regex,, callback] = route;
		} else {
			const route = routes.find(([regex]) => regex.test(path));
			if (!route) return sender(res, undefined, types.html);
			[regex, callback] = route;
		}

		const matches = (path.match(regex) || []).slice(1);
		try { promise = callback(props, ...matches, filer); } catch (err) {}

		Promise.resolve(promise, filer).catch(() => {}).then(it => {
			if (typeof it !== 'function') return it;
			let promise;
			$_.clear();
			type = types.html;
			try { promise = it(renderer); } catch (err) {}

			return Promise.resolve(promise).catch(() => {}).then(it => {
				if (typeof it !== 'string') return;
				else if (type !== types.html || !$_.size) return it;
	
				return it
					.replace(/(\n\t*?)<\/head>/, (match, tab) => {
						return [
							`${tab}\t<script src="/${_$}"></script>`,
							`${tab}\t<script>window.${_}=window.stew</script>`,
							match
						].join('');
					})
					.replace(/(\n\t*?)<body>/, (match, tab) => {
						return `${match}${[...$_].map(path => (
							`${tab}\t<script src="${path}"></script>`
						)).join('')}`;
					});
			});
		}).then(it => sender(res, it, type));
	}).listen(port, err => console.log(`server is listening on ${port}`));

	return function route (...params) {
		routes.unshift(params);
		return route;
	};
}
