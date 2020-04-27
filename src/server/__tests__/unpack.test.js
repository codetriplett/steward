import { unpack } from '../unpack';

describe('unpack', () => {
	it('siblings', () => {
		const actual = unpack('/one-two-three/');
		expect(actual).toEqual(['one', 'two', 'three']);
	});

	it('children', () => {
		const actual = unpack('/one/two/three///');
		expect(actual).toEqual(['one', ['two', ['three']]]);
	});

	it('complex', () => {
		const actual = unpack('/parent/child/first-second//inner//outer/');

		expect(actual).toEqual([
			'parent', [
				'child', ['first', 'second'],
				'inner',
			],
			'outer'
		]);
	});
});
