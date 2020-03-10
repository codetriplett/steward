const patterns = {
	'"': /["]|$/,
	'{': /[}]|$/,
	'<': /["{/>]|$/,
	'/': /[>]|$/,
	'>': /[{<]|$/
};

export function parse (markup) {
	let previous = '>';
	let expression = [];
	let element;

	const stack = [[expression]];

	while (markup) {
		const index = markup.search(patterns[previous]);
		let value = markup.slice(0, index);
		let symbol = markup[index];
		let interpret;

		switch (symbol) {
			case '}':
				value = value.trim().split(/\s+/);
				break;
			case '"':
				interpret = previous !== symbol || interpret;
				break;
			default:
				interpret = symbol === '<';
				break;
		}

		expression = append(expression, value, interpret, element);

		// put this behind traverse function
		switch (symbol) {
			case '<':
				element = [{}];
				break;
			case '/':
				if (previous !== '<') {
					const children = stack.shift();

					if (stack.length) {
						stack.push();
					}
				}
				
				break;
			case '>':
				if (previous === '/') {
					value = value.trim();

					if (value) {
						element[1] += `/${value.split(' ')[0]}`;
					}
				} else {
					stack[0].push(element);
					stack.unshift([expression]);
				}

				element = undefined;
				break;
		}

		if (closed) {
			previous = element ? '<' : '>';
		} else {
			previous = symbol;
		}

		markup = markup.slice(index + 1);
	}

	return stack.pop();
}
