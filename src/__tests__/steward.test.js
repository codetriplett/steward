import { server } from '../server';
import { gather } from '../gather';
import { render } from '../render';
import steward from '../steward';

jest.mock('../server');
jest.mock('../gather');
jest.mock('../render');

describe('steward', () => {
	beforeEach(() => {
		server.mockClear().mockReturnValue('server');
		gather.mockClear().mockReturnValue('gather');
		render.mockClear().mockReturnValue('render');
	});

	it('uses server when first parameter is a number', () => {
		const actual = steward(123, 'first', 'second');

		expect(server).toHaveBeenCalledWith(123, 'first', 'second');
		expect(actual).toBe('server');
	});

	it('uses gather when first parameter is a string', () => {
		const actual = steward('abc', 'first', 'second');

		expect(gather).toHaveBeenCalledWith('abc', 'first', 'second');
		expect(actual).toBe('gather');
	});

	it('uses render when first parameter is an array', () => {
		const actual = steward([], 'first', 'second');

		expect(render).toHaveBeenCalledWith([], 'first', 'second');
		expect(actual).toBe('render');
	});

	it('returns undefined when first parameter is undefined', () => {
		const actual = steward();

		expect(server).not.toHaveBeenCalled();
		expect(gather).not.toHaveBeenCalled();
		expect(render).not.toHaveBeenCalled();
		expect(actual).toBeUndefined();
	});
});
