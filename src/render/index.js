import { locate } from './locate';
import { modify } from './modify';

export function render ([tag, attributes, content = ''], element) {
	if (attributes) {
		attributes = Object.entries(attributes).map(it => modify(it, element));

		if (!element) {
			if (content) {
				content = `${content.map(it => render(it)).join('')}</${tag}>`;
			}

			return `<${tag}${attributes.join('')}>${content}`;
		} else if (content) {
			content.reduceRight((all, it) => locate(it, element, all), null);
		}
	} else if (!element) {
		return tag;
	} else if (element.nodeValue !== tag) {
		element.nodeValue = tag;
	}
}
