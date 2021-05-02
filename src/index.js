import { server } from './server';

export default function steward (first, ...rest) {
	if (typeof first === 'number') return server(first, ...rest);
}
