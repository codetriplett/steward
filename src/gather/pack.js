export function pack (structure) {
	return `/${structure.reduce((all, it) => {
		if (Array.isArray(it)) {
			it = pack(it);
		} else if (all) {
			it = `${all.endsWith('/') ? '/' : '-'}${it}`;
		}

		return `${all}${it}`;
	}, '')}/`;
}
