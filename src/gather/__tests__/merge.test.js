import { merge } from '../merge';

describe('merge', () => {
	it('sets new value', () => {
		const actual = merge('abc', undefined);
		expect(actual).toEqual('abc');
	});
	
	it('keeps old value', () => {
		const actual = merge('xyz', 'abc');
		expect(actual).toEqual('abc');
	});
	
	it('sets new object', () => {
		const actual = merge({ one: 'abc', two: 'xyz' }, undefined);
		expect(actual).toEqual({ one: 'abc', two: 'xyz' });
	});
	
	it('sets array as an object', () => {
		const actual = merge(['abc', 'xyz'], undefined);
		expect(actual).toEqual({ 0: 'abc', 1: 'xyz' });
	});
	
	it('upates existing object', () => {
		const actual = merge({ zero: { one: 'abc' }}, { zero: { two: 'xyz' }});
		expect(actual).toEqual({ zero: { one: 'abc', two: 'xyz' } });
	});
});
