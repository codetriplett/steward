import { pack } from '../pack';

describe('pack', () => {
	it('siblings', () => {
		const actual = pack(['first', 'second', 'third']);
		expect(actual).toEqual('/first-second-third/');
	});

	it('children', () => {
		const actual = pack(['first', ['second', ['third']]]);
		expect(actual).toEqual('/first/second/third///');
	});

	it('complex', () => {
		const actual = pack([
			'parent', [
				'child', ['first', 'second'],
				'inner',
			],
			'outer'
		]);

		expect(actual).toEqual('/parent/child/first-second//inner//outer/');
	});
});
