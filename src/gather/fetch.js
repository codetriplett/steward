// /path/to/data?str=abc&num=123&*=num*one*two&.=object.*parent.child*other*.*value

export function fetch ([prefix, properties, data]) {
	const flags = [];
	let route = prefix.replace(/^|\.+/g, '/').replace(/\/$/, '');
	let query = '';

	Object.entries(data).forEach(it => {
		const [name, value] = it.map(encodeURIComponent);

		if (!name || value === false) {
			return;
		} else if (value !== true) {
			query += `${name}=${value}`;
		}

		if (value === true || typeof value === 'number') {
			flags.push(name);
		}
	});

	if (flags.length) {
		query += `&*=${flags.join('*')}`;
	}

	// TODO: form properties part or query
	//   - need to check which ones have been cached first

	if (query) {
		route += `?${query}`;
	}
	
	// TODO: make request that based on environment (client side or server side)
	//   - need to merge response back to cache
	//   - need to merge pre cached properties to response before passing it along
}
