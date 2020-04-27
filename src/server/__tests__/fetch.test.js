import { readFile } from 'fs';
import { fetch } from '../fetch';

jest.mock('fs');

describe('fetch', () => {
	const writeHead = jest.fn();
	const end = jest.fn();
	let res, err, content;

	beforeEach(() => {
		res = { writeHead, end };
		writeHead.mockClear();
		end.mockClear();
		readFile.mockClear().mockImplementation((a, b, c) => c(err, content));
	});

	it('fetches and parses json', async () => {
		content = '{"key":"value"}';
		const actual = await fetch('data.json');
		expect(readFile).toHaveBeenCalledWith('data.json', 'utf-8', expect.any(Function));
		expect(actual).toEqual({ key: 'value' });
	});

	it('fetches and parses missing json', async () => {
		err = new Error('Missing');
		content = undefined;
		const actual = await fetch('data.json');
		expect(readFile).toHaveBeenCalledWith('data.json', 'utf-8', expect.any(Function));
		expect(actual).toEqual({});
	});

	it('fetches and sends txt file', async () => {
		content = 'Lorem ipsum';
		await fetch('file.txt', res);
		expect(readFile).toHaveBeenCalledWith('file.txt', 'utf-8', expect.any(Function));
		
		expect(writeHead).toHaveBeenCalledWith(200, {
			'Content-Length': 11,
			'Content-Type': 'text/plain; charset=utf-8'
		});

		expect(end).toHaveBeenCalledWith('Lorem ipsum');
	});

	it('fetches and sends json file', async () => {
		content = '{"key":"value"}';
		await fetch('file.json', res);
		expect(readFile).toHaveBeenCalledWith('file.json', 'utf-8', expect.any(Function));
		
		expect(writeHead).toHaveBeenCalledWith(200, {
			'Content-Length': 15,
			'Content-Type': 'application/json; charset=utf-8'
		});

		expect(end).toHaveBeenCalledWith('{"key":"value"}');
	});
	
	it('fetches and sends missing file', async () => {
		err = new Error('Missing');
		content = undefined;
		await fetch('file.txt', res);
		expect(readFile).toHaveBeenCalledWith('file.txt', 'utf-8', expect.any(Function));
		
		expect(writeHead).toHaveBeenCalledWith(404, {
			'Content-Length': 14,
			'Content-Type': 'text/plain; charset=utf-8'
		});

		expect(end).toHaveBeenCalledWith('File not found');
	});
	
	it('fetches, processes and sends json', async () => {
		content = 'data';
		const callback = jest.fn().mockResolvedValue({ key: 'value' });
		await fetch('file.json', res, callback);
		expect(readFile).toHaveBeenCalledWith('file.json', 'utf-8', expect.any(Function));
		expect(callback).toHaveBeenCalledWith('data');

		expect(writeHead).toHaveBeenCalledWith(200, {
			'Content-Length': 15,
			'Content-Type': 'application/json; charset=utf-8'
		});

		expect(end).toHaveBeenCalledWith('{"key":"value"}');
	});
	
	it('fetches, processes and sends html', async () => {
		content = 'markup';
		const callback = jest.fn().mockResolvedValue('html');
		await fetch('file.json', res, callback);
		expect(readFile).toHaveBeenCalledWith('file.json', 'utf-8', expect.any(Function));
		expect(callback).toHaveBeenCalledWith('markup');

		expect(writeHead).toHaveBeenCalledWith(200, {
			'Content-Length': 4,
			'Content-Type': 'text/html; charset=utf-8'
		});

		expect(end).toHaveBeenCalledWith('html');
	});
});
