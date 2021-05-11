import { createServer } from 'http';
import { file } from './file';
import { parse } from './parse';
import { receive } from './receive';
import { render } from './render';
import { send } from './send';
import { types } from './types';

export function server (port, url, callback) {
	let resources = [], stew = '@triplett/stew';

	if (Array.isArray(url)) {
		[url = '', ...resources] = url;
		resources = resources.map(it => it.replace(/^\/+/, ''));
	}

	let [, dir, _$, _] = url.match(/^(.*?)[\\/]*?([^/\\#]+.js)?(?:#(.*))?$/);

	if (!dir) dir = __dirname;
	if (_$) stew = `${dir}/${_$}`;
	else _$ = 'stew.min.js';
	if (!_) _ = '$';

	resources.unshift(_$, 'favicon.ico', 'index.css', 'index.js');
	const $ = require(stew);
	const $_ = new Set();
	const routes = [];

	if (typeof callback === 'function') routes.push([/^$/, callback]);

	const context = { '': dir, _, $_, $, _$ };
	const filer = file.bind(context);
	const renderer = render.bind(context);
	const sender = send.bind(context);

	createServer((req, res) => {
		const { url, method } = req;
		let promise;
		if (method === 'DELETE') return;
		else if (method !== 'GET') promise = receive(req).then(body => [body]);

		Promise.resolve(promise || []).then(params => {
			let [path, extension, props] = parse(url, ...params), type;

			if (extension !== undefined) {
				path += `.${extension}`;
				type = types[extension];

				if (resources.includes(path)) {
					if (path === _$ && stew === '@triplett/stew') path = stew;
					filer(path).catch(() => {}).then(it => sender(res, it, type));
					return;
				}
			}

			const route = routes.find(([regex]) => regex.test(path));
			if (!route) return sender(res, undefined, type);
			const [regex, callback] = route;
			const matches = (path.match(regex) || []).slice(1);
			try { promise = callback(props, ...matches, filer); } catch (err) {}

			Promise.resolve(promise, filer).catch(() => {}).then(it => {
				if (typeof it !== 'function') {
					if (!type) type = types.json;
					return it;
				} else if (type) {
					return;
				}

				let promise;
				$_.clear();
				try { promise = it(renderer); } catch (err) {}

				return Promise.resolve(promise).catch(() => {}).then(it => {
					if (typeof it !== 'string') return;
					else if (!$_.size) return it;

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
		}).catch(() => {
			sender(res, undefined, types.json);
		});
	}).listen(port, err => console.log(`server is listening on ${port}`));

	return function router (regex, callback) {
		if (regex instanceof RegExp && typeof callback === 'function') {
			routes.unshift([regex, callback]);
		}

		return router;
	};
}
