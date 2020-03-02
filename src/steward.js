import { server } from './server';
import { gather } from './gather';
import { render } from './render';

export default function steward (...parameters) {
	switch (typeof parameters[0]) {
		case 'number': return server(...parameters);
		case 'string': return gather(...parameters);
		case 'object': return render(...parameters);
	}
}
