import { parse } from '..';

describe('parse', () => {
	it('expression', () => {
		const actual = parse('before{value}after');
		expect(actual).toEqual([['before', ['value'], 'after']]);
	});

	it('component', () => {
		const actual = parse('<component /data>');

		expect(actual).toEqual([
			[{}, 'component', 'data', {}]
		]);
	});

	it('container', () => {
		const actual = parse('<container>before<component />after</data>');

		expect(actual).toEqual([
			[{}, 'container',
				['before'],
				[{}, 'component', '', {}],
				['after'],
			'data', {}]
		]);
	});
	
	it('compound', () => {
		const actual = parse('<abc xyz {flag} / cba zyx {flag}>');

		expect(actual).toEqual([
			[
				{}, 'abc', { '': [['flag']] }, 'xyz',
				'cba', {}, 'zyx', { '': [['flag']] }
			]
		]);
	});

	it('complex', () => {
		const actual = parse(`
			before
			<tag container {flag true} flag>
				first
				<name="lmno"={value}>content</>
				<component "("{value}")" /data>
				<>content</>
				last
			</container/data other {flag false}>
			after
		`);

		expect(actual).toEqual([
			['before'],
			[{}, 'tag', { '': [['flag', 'true']], flag: true }, 'container',
				['first'],
				[{ name: ['lmno', null, ['value']] }, '', ['content'], '', {}],
				[{ '': ['(', ['value'], ')'] }, 'component', 'data', {}],
				[{}, '', ['content'], '', {}],
				['last'],
			'container/data', {}, 'other', { '': [['flag', 'false']] }],
			['after']
		]);
	});
});
