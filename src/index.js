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

import { createServer } from 'http';
import { readFile, writeFile } from 'fs';
import stew from '@triplett/stew';
import { send, receive, file, parse } from './transfer';

export function hydrateLayout (layout, params, converter, promises) {
	// process non-object types
	if (typeof layout !== 'object') {
		return layout;
	} else if (Array.isArray(layout)) {
		return [...layout.slice(0, 2), ...layout.slice(2).map(child => {
			return hydrateLayout(child, params, converter, promises);
		})];
	}

	// create new object to set toString to
	const object = {};

	// convert object and set its result as string
	const promise = Promise.resolve(converter(layout, params)).then(string => {
		object.toString = () => typeof string === 'string' ? string : '';
	});

	// add promise to list to await and return object
	promises.push(promise);
	return object;
}

export default function (folder, port, onerror, ...routes) {
	if (typeof folder !== 'string' || !port || isNaN(port)) {
		throw new Error('Invalid folder or port');
	}

	const defaultConverter = typeof routes[0] === 'function' ? routes.shift() : () => () => '';
	folder = folder.replace(/\/+$/, '');

	function read (path) {
		const fullPath = `${folder}/${path.replace(/^\/+/, '')}`;
		return file(fullPath, readFile);
	}

	function write (path, content) {
		const fullPath = `${folder}/${path.replace(/^\/+/, '')}`;
		return file(fullPath, writeFile, content);
	}

	async function render (template, params = {}, converter = defaultConverter) {
		// load and hydrate stew layout
		const [, path, hash] = template.match(/^\/?(.*?)(?:#(.*))?$/);
		let layout = require(`${folder}/${path}`);
		if (hash) layout = layout[hash];

		if (typeof layout === 'function') {
			// call custom layout creator
			layout = layout(params);
		} else {
			// call basic layout creator
			const promises = [];
			layout = hydrateLayout(layout, params, converter, promises);
			await Promise.all(promises);
		}

		// add doctype if html tag stands alone
		if (Array.isArray(layout) && layout[0].toLowerCase() === 'html') {
			layout = ['', null, ['!DOCTYPE', { html: true }], layout];
		}

		// render layout
		const fragment = stew('', layout);
		return String(fragment);
	}

	// add route for stew files
	routes.unshift([/^stew\.min\.m?js(\.LEGAL\.txt)?/, async (params, req, res) => {
		const path = require.resolve('@triplett/stew').replace(/stew\.min\.js$/, req.url);
		const [, extension] = path.match(/^.*?(?:\.([^./]*))?$/);
		const content = await file(path, readFile);
		send(res, content, extension);
	}]);

	async function resolve (req, res) {
		try {
			const { url, method } = req;
			const [, path, query] = url.match(/^\/?(.*?)\/?(?:\?(.*))?$/);
			const route = routes.find(([regex]) => regex.test(path));
			if (!route) throw new Error(`Route not found: ${path}`);
			const [regex, ...resolvers] = route;

			if (!resolvers.length) {
				// return static asset
				const [, extension] = path.match(/^.*?(?:\.([^./]*))?$/);

				try {
					const content = await read(path);
					send(res, content, extension);
				} catch (e) {
					send(res, 'File not found', extension, 404);
				}

				return;
			}

			const matches = path.match(regex).slice(1);
			let result = parse(query);

			if (typeof resolvers[0] === 'number') {
				// TODO: test this
				if (method !== 'POST') {
					throw new Error(`Invalid method: [${method}] ${path}`);
				}

				// read incoming post
				const limit = resolvers.shift();
				const body = await receive(req, limit);
				result = Object.assign(result, body);
			} else if (method === 'POST') {
				// TODO: test this
				throw new Error(`Invalid method: [${method}] ${path}`);
			}

			if (Array.isArray(resolvers[0])) {
				// give names to matches
				const names = resolvers.shift();
				const entries = names.map((name, i) => [name, matches[i]]);
				result = Object.assign(result, Object.fromEntries(entries));
			}

			for (const [i, resolver] of resolvers.entries()) {
				switch (typeof resolver) {
					case 'function': {
						// process custom callback
						result = await resolver(result, req, res);
						if (result === undefined) break;
						continue;
					}
					case 'string': {
						result = await render(resolver, result);
						continue;
					}
				}

				// unrecognized resolver type
				throw new Error(`Invalid resolver: [${i}] ${path}`);
			}

			switch (typeof result) {
				case 'string': {
					// send back HTML
					send(res, result, 'html');
					return;
				}
				case 'object': {
					// send back JSON
					result = JSON.stringify(result);
					send(res, result, 'json');
					return;
				}
			}

			if (result !== undefined) {
				// send back value as text
				send(res, String(result), 'txt');
			}
		} catch (err) {
			onerror?.(err, req, res);
		}
	}

	function simulate (url, method, content) {
		return new Promise(resolve => {
			function on (event, callback) {
				if (event === 'data') callback(content);
				else if (event === 'end') callback();
			}

			const connection = { destroy: () => isError = true };
			const req = { url, method, connection, on };
			let isError = false;

			const res = {
				writeHead: status => isError = status >= 400,
				end: resolve,
			};

			resolve(req, res);
		});
	}

	function get (url) {
		return simulate(url, 'GET');
	}

	function post (url, content) {
		return simulate(url, 'POST', content);
	}

	function put (url, content) {
		return simulate(url, 'PUT', content);
	}

	function del (url, content) {
		return simulate(url, 'DELETE', content);
	}

	createServer(resolve).listen(port, err => console.log(`server is listening on ${port}`));
	return { read, write, render, get, post, put, del };
}
