import { createServer } from 'http';
import { fetch } from '../fetch';
import { render } from '../../render';
import { server } from '..';

jest.mock('http');
jest.mock('../../render');
jest.mock('../fetch');

describe('server', () => {
	const res = jest.fn();
	const listen = jest.fn();
	let callback;

	beforeEach(() => {
		res.mockClear();
		listen.mockClear();
		fetch.mockClear();

		createServer.mockImplementation(c => {
			callback = url => c({ url }, res);
			return { listen };
		});
	});

	it('processes request', () => {
		server(8080, '/directory');
		expect(listen).toHaveBeenCalledWith(8080);
		callback('/url');
		expect(fetch).toHaveBeenCalledWith('/directory/url', res, expect.any(Function));
	});
});
