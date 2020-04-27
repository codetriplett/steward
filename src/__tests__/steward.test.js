import { server } from '../server';
import steward from '../steward';

jest.mock('../server');

describe('steward', () => {
	beforeEach(() => {
		server.mockClear().mockReturnValue('server');
	});

	it('uses server when first parameter is a number', () => {
		const actual = steward(123, 'first', 'second');

		expect(server).toHaveBeenCalledWith(123, 'first', 'second');
		expect(actual).toBe('server');
	});

	it('returns undefined when first parameter is undefined', () => {
		const actual = steward();

		expect(server).not.toHaveBeenCalled();
		expect(actual).toBeUndefined();
	});
});
