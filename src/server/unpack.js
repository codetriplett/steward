export function unpack (string) {
	return string.slice(1, -1).split('/').reduce((all, it, i, array) => {
		if (it) {
			if (array[i - 1]) {
				all.unshift([]);
			}

			all[0].push(...it.split('-'));
		} else {
			all[1].push(all.shift());
		}

		return all;
	}, [[]]).pop();
}
