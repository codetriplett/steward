export function append (expression, value, interpret, element) {
	if (!element) {
		if (interpret !== undefined) {
			value = value.replace(/\s+/g, ' ');

			if (!expression.length) {
				value = value.replace(/^ /, '');
			}
			
			if (interpret) {
				value = value.replace(/ $/, '');
			}
		}

		expression.push(value);
	} else if (interpret === undefined) {
		expression[expression.length - 1].push(value);
	} else if (/\S/.test(value)) {
		const values = value.trim().split(/\s+(?!=)/);

		if (element.length === 1) {
			element.push(values[0].endsWith('=') ? '' : values.shift());
		}

		if (values.length) {
			const attributes = element[element.length - 2];
			
			if (interpret && !values[values.length - 1].endsWith('=')) {
				element.push({}, values.pop());
			}

			values.forEach(value => {
				expression = [[]];

				if (value.endsWith('=')) {
					attributes[value.slice(0, -1).trim()] = expression;
				} else {
					attributes[value] = [[]];
				}
			});
		}
	}

	return expression;
}
