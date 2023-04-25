/**
 * @license MIT
 * Copyright (c) 2023 Jeff Triplett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import stew from '@triplett/stew';
import { send, receive, file } from './transfer';

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
	ico: 'image/x-icon'
};

export async function hydrateLayout (layout, params, converter) {
	const promises = [];

	for (const child of layout.slice(2)) {
		if (typeof child !== 'object') continue;

		if (Array.isArray(child)) {
			const promise = hydrateLayout(child, params, converter);
			promises.push(promise);
			continue;
		}

		const promise = converter(child, params);
		promises.push(promise);
		child.toString = await promise;
	}

	if (promises.length) return Promise.all(promises);
}

export default function (port, folder, ...routes) {
	if (typeof port !== 'number' || typeof folder !== 'string') return;
	const converter = typeof routes[0] === 'function' ? routes.shift() : () => () => '';
	folder = folder.replace(/\/+$/, '');

	function read (path, extension) {
		return file(path.replace(/^\/+/, ''), extension, readFile);
	}

	function write (path, extension, content) {
		return file(path.replace(/^\/+/, ''), extension, writeFile, content);
	}

	createServer(async ({ url }, res) => {
		url = url.replace(/^\/+/, '');
		const route = routes.find(([regex]) => regex.test(url));

		if (!route) {
			send(res, `Route not found: ${url}`);
			return;
		}

		const [regex, ...resolvers] = route;

		if (resolvers.length) {
			// return static asset
			try {
				const regex = /^.*?(?:\.([^/.?#]*))?/;
				const [, extension] = path.match(regex);
				const content = await read(url, extension);
				send(res, content, extension);
			} catch (e) {
				send(res, 'File not found');
			}

			return;
		}

		const matches = url.match(regex).slice(1);
		let result = {};
		// TODO: have result start out as parsed params
		
		if (typeof resolvers[0] === 'number') {
			if (req.method === 'GET') {
				// TODO: test this
				send(res, `Invalid get: ${url}`);
				return;
			}

			// read incoming post
			const limit = resolvers.shift();
			const body = await receive(req, limit);
			result = Object.assign(result, body);
		} else if (req.method === 'POST') {
			// TODO: test this
			send(res, `Invalid post: ${url}`);
			return;
		}

		for (const resolver of resolvers) {
			if (Array.isArray(resolver)) {
				// give names to matches
				const entries = resolver.map((name, i) => [name, matches[i]]);
				result = Object.fromEntries(entries);
				continue;
			}

			switch (typeof resolver) {
				case 'function': {
					// process custom callback
					result = resolver(result, req, res);
					continue
				}
				case 'string': {
					// load and hydrate stew layout
					const [, filename, hash] = resolver.match(/^(.*?)#(.*)$/);
					let layout = require(`./${filename}`);
					if (hash) layout = layout[hash];
					layout = await hydrateLayout(layout, params, converter);
					continue;
				}
			}
			
			// unrecognized resolver type
			send(res, `Invalid route resolver: ${url}`);
			return;
		}

		switch (typeof result) {
			case 'string': {
				const fragment = stew('', layout);
				send(res, String(fragment), 'html');
				return;
			}
			case 'object': {
				try {
					result = JSON.stringify(result);
					send(res, result, 'json');
				} catch (e) {
					send(res, `Invalid data format: ${url}`);
				}

				return;
			}
		}
	}).listen(port, err => console.log(`server is listening on ${port}`));

	return { read, write };
}
