import { fetch } from '../../server/fetch';
import { gather, cache } from '..';

jest.mock('../../server/fetch');

describe('gather', () => {
	let structure;
	let data;

	beforeEach(() => {
		structure = ['first', 'object', ['first', 'last'], 'last'];
		data = { first: 123, last: 789, object: { first: 'abc', last: 'xyz' } };

		fetch.mockClear().mockImplementation(() => Promise.resolve(data));

		for (const key in cache) {
			delete cache[key];
		}

		Object.assign(cache, { second: 456, object: { second: 'lmn' } });
	});

	it('gathers all data', () => {
		return gather(structure).then(actual => {
			expect(fetch).toHaveBeenCalledWith('/first-object/first-last//last/');
			expect(cache).toEqual({ first: 123, second: 456, last: 789, object: { first: 'abc', second: 'lmn', last: 'xyz' } });
			expect(actual).toEqual({ first: 123, last: 789, object: { first: 'abc', last: 'xyz' } });
		});
	});

	it('gathers empty data', () => {
		data = {};

		return gather(structure).then(actual => {
			expect(cache).toEqual({ first: undefined, second: 456, last: undefined, object: { first: undefined, second: 'lmn', last: undefined } });
			expect(actual).toEqual({});
		});
	});

	it('gathers missing data', () => {
		Object.assign(cache, { first: 123 });
		Object.assign(cache.object, { last: 'xyz' });

		return gather(structure).then(actual => {
			expect(fetch).toHaveBeenCalledWith('/object/first//last/');
			expect(cache).toEqual({ first: 123, second: 456, last: 789, object: { first: 'abc', second: 'lmn', last: 'xyz' } });
			expect(actual).toEqual({ first: 123, last: 789, object: { first: 'abc', last: 'xyz' } });
		});
	});

	it('does not fetch for data', () => {
		Object.assign(cache, { first: 123, last: 789 });
		Object.assign(cache.object, { first: 'abc', last: 'xyz' });

		return gather(structure).then(actual => {
			expect(fetch).not.toHaveBeenCalled();
			expect(actual).toEqual({ first: 123, last: 789, object: { first: 'abc', last: 'xyz' } });
		});
	});
});
