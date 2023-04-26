import steward, { types, send, parse, stew } from './module';

Object.assign(steward, {
	types,
	send,
	parse,
	stew
});

if (typeof window === 'object') {
	window.steward = steward;
} else if (typeof module === 'object') {
	module.exports = steward;
}

export default steward;
