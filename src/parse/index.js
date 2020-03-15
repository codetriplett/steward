import { append } from './append';
import { traverse } from './traverse';

const patterns = {
	'{': /[}]|$/,
	'"': /["]|$/,
	'\'': /[']|$/,
	'<': /["{/>]|$/,
	'/': /["{>]|$/,
	'>': /[{<]|$/
};

export function parse (markup) {
	let stage = '>';
	let previous = stage;
	let expression = [];
	let closing = false;
	let element;

	const stack = [[expression]];

	while (markup) {
		const index = markup.search(patterns[previous]);
		let value = markup.slice(0, index);
		let symbol = markup[index];
		let complete;

		switch (symbol) {
			case '}':
				value = value.trim().split(/\s+/);
				break;
			case '"':
			case '\'':
				if (previous !== symbol) {
					complete = false;
				}

				break;
			case '<':
			case '/':
			case '>':
			case undefined:
				stage = symbol;
				complete = true;

				break;
			default:
				complete = false;
				break;
		}

		if (complete === undefined) {
			expression.push(value);
			previous = stage;
		} else {
			expression = append(expression, value, complete, element, closing);
			previous = symbol;
		}

		switch (symbol) {
			case '<':
			case '/':
			case '>':
				expression = [];
				closing = symbol === '/';

				if (!closing) {
					element = traverse(stack, element);

					if (!element) {
						stack[0].push(expression);
					}
				}

				break;
		}

		markup = markup.slice(index + 1);
	}

	const children = stack.pop();

	if (!children[children.length - 1].length) {
		children.pop();
	}

	return children;
}
