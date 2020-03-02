/**
 * @jest-environment jsdom
 */

import $ from './helpers';
import { render } from '..';
import { locate } from '../locate';

jest.mock('..');

describe('locate', () => {
	beforeEach(() => {
		render.mockClear().mockImplementation((template, element) => element);
	});

	it('returns static input element if it was expected', () => {
		const element = $('span', {});
		const container = $('div', {}, element);
		const actual = locate(['span', {}], container);

		expect([...container.childNodes]).toEqual([actual]);
		expect(actual).toBe(element);
	});

	it('replaces static input element if its type is different', () => {
		const container = $('div', {}, $('span', {}));
		const actual = locate(['p', {}], container);

		expect([...container.childNodes]).toEqual([actual]);
		expect(actual).toEqual($('p', {}));
	});

	it('returns dynamic input element if it matches the id', () => {
		const element = $('span', { 'data--': '1' });
		const container = $('div', {}, element);
		const actual = locate(['span', { '': '1' }], container);

		expect([...container.childNodes]).toEqual([actual]);
		expect(actual).toBe(element);
	});

	it('returns new element if container is empty', () => {
		const container = $('div', {});
		const actual = locate(['span', {}], container);

		expect([...container.childNodes]).toEqual([actual]);
		expect(actual).toEqual($('span', {}));
	});

	it('returns new element if id is greater than input element', () => {
		const sibling = $('span', { 'data--': '1' });
		const container = $('div', {}, sibling);
		const actual = locate(['span', { '': '2' }], container);

		expect([...container.childNodes]).toEqual([sibling, actual]);
		expect(actual).toEqual($('span', { 'data--': '2' }));
	});

	it('removes input element if it is greather than id', () => {
		const sibling = $('span', { 'data--': '2' });
		const container = $('div', {}, sibling);
		const actual = locate(['span', { '': '1' }], container);

		expect([...container.childNodes]).toEqual([actual]);
		expect(actual).toEqual($('span', { 'data--': '1' }));
	});
});
