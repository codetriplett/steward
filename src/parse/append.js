export function append (expression, value, complete, element, closing) {
	if (!element) {
		value = value.replace(/\s+/g, ' ');

		if (!expression.length) {
			value = value.replace(/^ /, '');
		}
		
		if (complete) {
			value = value.replace(/ $/, '');
		}

		if (value) {
			expression.push(value);
		}

		return expression;
	}

	const values = value.replace(/\s*=\s*/g, '= ').trim().split(/\s+/);
	const entries = [];
	let attributes = element[element.length - (closing ? 1 : 2)];

	if (typeof attributes !== 'object') {
		const tag = values[0].endsWith('=') ? '' : values.shift();

		attributes = { '': expression };
		entries.push(attributes, tag);
	}

	if (values.length && values[0]) {
		let tag;
		
		if (!complete && !values[values.length - 1].endsWith('=')) {
			tag = values.pop();
		}

		values.forEach(value => {
			const key = value.replace('=', '');

			if (key) {
				attributes[key] = expression = [];
			} else {
				expression.push(null);
			}
		});

		if (tag) {
			expression = [];
			entries.push({ '': expression }, tag);
		}
	}

	if (entries.length) {
		if (closing) {
			entries.push(...entries.reverse().splice(0, 2));
		}

		element.push(...entries);
	}

	return expression;
}
