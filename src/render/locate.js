import { render } from '../render';

export function locate (template, container, sibling) {
	const [tag, attributes] = template;
	const id = attributes && attributes[''] || '';
	const [index] = id.split('-');
	const children = [];
	let element;

	while (container.lastChild) {
		let attribute = '';
		element = sibling ? sibling.previousSibling : container.lastChild;

		if (element && !element.getAttribute === !attributes) {
			if (attributes) {
				attribute = element.getAttribute('data--') || '';
			}

			if (attribute === id) {
				if (tag.toLowerCase() === element.tagName.toLowerCase()) {
					return render(template, element);
				}

				children.push(...element.childNodes);
				container.removeChild(element);

				break;
			}
		}

		if (!element || attribute.match(/^\d*(?=-?)/)[0] <= index) {
			break;
		}

		container.removeChild(element);
	}
	
	if (attributes) {
		element = document.createElement(tag);
		children.forEach(child => element.appendChild(child));

		if (id) {
			element.setAttribute('data--', id);
		}
	} else {
		element = document.createTextNode(tag);
	}

	if (sibling) {
		sibling.parentNode.insertBefore(element, sibling);
	} else {
		container.appendChild(element);
	}

	return render(template, element);
}
