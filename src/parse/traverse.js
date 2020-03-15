export function traverse (stack, element) {
	const [children] = stack;

	if (!element) {
		if (!children[children.length - 1].length) {
			children.pop();
		}

		return [];
	}

	const length = Math.max(2, element.length);
	let opens = false;
	let closer;

	for (let i = 0; i < length; i++) {
		const item = element[i];

		if (i % 2 ^ closer > 0) {
			opens = opens || !closer && !!item;
			item = item || '';
		} else if (typeof item === 'object') {
			const { '': scope = [], ...attributes } = item;

			if (!closer && (scope.length || Object.keys(attributes).length)) {
				opens = true;
			}

			if (!scope.length) {
				item = attributes; 
			}
		} else if (!closer) {
			closer = i;
		}
		
		if (item === undefined) {
			item = {};
		}

		element[i] = item;
	}

	if (closer && !opens) {
		const children = stack.shift();
		const closers = element.slice(closer);
		const [siblings] = stack;

		siblings[siblings.length - 1].push(...children, ...closers);
		return;
	}

	stack[0].push(element);

	if (!closer) {
		stack.unshift([]);
	}
}
