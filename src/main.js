import steward, { types, send, stew } from './module';

Object.assign(steward, {
	types,
	send,
	stew
});

if (typeof window === 'object') {
	window.steward = steward;
} else if (typeof module === 'object') {
	module.exports = steward;
}

export default steward;
