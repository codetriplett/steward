import { append } from '../append';

describe('append', () => {
	describe('text', () => {
		let expression;

		beforeEach(() => {
			expression = [];
		});

		it('first value', () => {
			const actual = append(expression, '\n\t  value  \t\n', false);

			expect(expression).toEqual(['value ']);
			expect(actual).toBe(expression);
		});

		it('second value', () => {
			expression = ['value'];
			const actual = append(expression, '\n\t  other\nvalue  \t\n', false);

			expect(expression).toEqual(['value', ' other value ']);
			expect(actual).toBe(expression);
		});

		it('last value', () => {
			expression = ['value'];
			const actual = append(expression, '\n\t  other  \t\n', true);

			expect(expression).toEqual(['value', ' other']);
			expect(actual).toBe(expression);
		});

		it('only value', () => {
			const actual = append(expression, '\n\t  value  \t\n', true);

			expect(expression).toEqual(['value']);
			expect(actual).toBe(expression);
		});

		it('does not modify value', () => {
			const actual = append(expression, '\n\t  value  \t\n');

			expect(expression).toEqual(['\n\t  value  \t\n']);
			expect(actual).toBe(expression);
		});
	});

	describe('element', () => {
		let expression;
		let element;

		beforeEach(() => {
			expression = [[]];
			element = [{}];
		});

		it('does not modify value even with element', () => {
			const actual = append(expression, '  value  ', undefined, element);
	
			expect(expression).toEqual([['  value  ']]);
			expect(actual).toBe(expression);
		});
	
		it('sets tag', () => {
			const actual = append(expression, 'tag', true, element);
	
			expect(expression).toEqual([[]]);
			expect(element).toEqual([{}, 'tag']);
			expect(actual).toBe(expression);
		});
	
		it('sets tag at the end if not yet set', () => {
			const actual = append(expression, 'tag', false, element);
	
			expect(expression).toEqual([[]]);
			expect(element).toEqual([{}, 'tag']);
			expect(actual).toBe(expression);
		});
	
		it('sets attribute', () => {
			const actual = append(expression, 'name=', true, element);
	
			expect(expression).toEqual([[]]);
			expect(element).toEqual([{ name: [[]] }, '']);
			expect(actual).toBe(element[0].name);
			expect(actual).not.toBe(expression);
		});
	
		it('sets flag', () => {
			const actual = append(expression, 'tag flag', false, element);
	
			expect(expression).toEqual([[]]);
			expect(element).toEqual([{ flag: [[]] }, 'tag']);
			expect(actual).not.toBe(element[0].flag);
			expect(actual).not.toBe(expression);
		});
	
		it('sets second tag', () => {
			const actual = append(expression, 'tag flag alt', true, element);
	
			expect(expression).toEqual([[]]);
			expect(element).toEqual([{ flag: [[]] }, 'tag', {}, 'alt']);
			expect(actual).not.toBe(element[0].flag);
			expect(actual).not.toBe(expression);
		});
	});
});
