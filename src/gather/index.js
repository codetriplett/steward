import { fetch } from './fetch';
import { pack } from './pack';
import { merge } from './merge';
import { recall } from './recall';

export const cache = {};

export async function gather (structure) {
	const memory = recall(structure, cache) || {};
	const path = pack(structure);
	let data;

	if (structure.length) {
		const response = await fetch(path);
		data = recall(structure, response);
		merge(data, cache);
		merge(data, memory);
	}

	return memory;
}
