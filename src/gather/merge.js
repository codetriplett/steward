export function merge (data, cache) {
	if (typeof data !== 'object') {
		return cache === undefined ? data : cache;
	} else if (cache === undefined) {
		cache = {};
	}
	
	const { hasOwnProperty } = Object.prototype;

	Object.entries(data).forEach(([key, value]) => {
		const reference = cache[key];

		if (hasOwnProperty.call(cache, key) && typeof reference !== 'object') {
			return;
		}

		cache[key] = merge(value, reference);
	});

	return cache;
}
