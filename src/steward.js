import { server } from './server';

export default function steward (...parameters) {
	switch (typeof parameters[0]) {
		case 'number': return server(...parameters);
	}
}
