export function recall (structure, cache) {
	if (!cache) {
		return;
	}

	const { hasOwnProperty } = Object.prototype;
	const memory = {};
	let value;

	structure.reduceRight((previous, it, i) => {
		if (Array.isArray(it)) {
			return it;
		} else if (!hasOwnProperty.call(cache, it)) {
			return;
		} else if (previous) {
			value = recall(previous, cache[it]);
			
			if (!previous.length) {
				structure.splice(i, 2);
			}
		} else {
			value = cache[it];
			structure.splice(i, 1);

			if (typeof value === 'object') {
				value = undefined;
			}
		}

		if (value) {
			memory[it] = value;
		}
	}, undefined);

	if (Object.keys(memory).length) {
		return memory;
	}
}
