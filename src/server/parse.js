export function parse (url, ...params) {
	const regex = /^(?:\/+)?(.*?)(?:\.([^/.?#]*)|\/*)?(?:\?(.*?))?$/;
	const [, path = '', extension, query] = url.match(regex);
	const props = params.length ? { '': params.shift() } : {};

	if (query) {
		for (const it of query.split('&')) {
			const index = it.indexOf('=');
			if (index < 1) continue;
			else if (!~index) props[it] = true;
			else props[it.slice(0, index)] = it.slice(index + 1);
		}
	}

	return [path, extension, props];
}
