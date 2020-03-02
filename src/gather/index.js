import { fetch } from './fetch';

export const cache = {};

export function gather (...parameters) {
	const requests = [];
	let request;

	for (const item of parameters) {
		if (typeof item === 'string') {
			requests.push(request = [item, [], {}]);
		} else if (!requests.length) {
			continue;
		} else if (Array.isArray(item)) {
			request[1].push(...item);
		} else {
			Object.assign(request[2], item);
		}
	}

	if (requests.length < 2) {
		return fetch(request);
	}

	return Promise.all(requests.map(it => fetch(it)));
}
