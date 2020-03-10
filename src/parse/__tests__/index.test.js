import { parse } from '..';

describe('parse', () => {
	it('expression', () => {
		const actual = parse('before{value}after');
		expect(actual).toEqual([['before', ['value'], 'after']]);
	});

	it('element', () => {
		const actual = parse('<tag>content</data>');

		expect(actual).toEqual([
			[''],
			[{}, 'tag/data', [['content']]]
		]);
	});
});
