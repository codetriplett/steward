import { fetch } from '../fetch';
import { gather } from '..';

jest.mock('../fetch');

describe('gather', () => {
	let array;
	let object;
	let request;

	beforeEach(() => {
		fetch.mockClear().mockResolvedValue('data');

		array = ['property'];
		object = { key: 'value' };
		request = ['route', array, object];
	});

	it('makes single request', () => {
		return gather(...request).then(data => {
			expect(fetch).toHaveBeenCalledWith(request);
			expect(data).toBe('data');
		});
	});

	it('makes multiple requests', () => {
		return gather(...request, 'other').then(data => {
			expect(fetch.mock.calls).toEqual([
				[request],
				[['other', [], {}]]
			]);

			expect(data).toEqual(['data', 'data']);
		});
	});

	it('ignores missing array', () => {
		return gather('other', object, ...request).then(data => {
			expect(fetch.mock.calls).toEqual([
				[['other', [], object]],
				[request]
			]);

			expect(data).toEqual(['data', 'data']);
		});
	});

	it('ignores missing object', () => {
		return gather('other', array, ...request).then(data => {
			expect(fetch.mock.calls).toEqual([
				[['other', array, {}]],
				[request]
			]);

			expect(data).toEqual(['data', 'data']);
		});
	});

	it('ignores missing array and object', () => {
		return gather('other', ...request).then(data => {
			expect(fetch.mock.calls).toEqual([
				[['other', [], {}]],
				[request]
			]);

			expect(data).toEqual(['data', 'data']);
		});
	});
});
