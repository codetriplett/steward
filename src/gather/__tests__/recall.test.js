import { recall } from '../recall';

describe('recall', () => {
	let structure;

	describe('shallow', () => {
		beforeEach(() => {
			structure = ['one', 'two'];
		});

		it('does not recall anything', () => {
			const actual = recall(structure, {});

			expect(structure).toEqual(['one', 'two']);
			expect(actual).toBeUndefined();
		});

		it('recalls undefined', () => {
			const actual = recall(structure, { one: undefined });

			expect(structure).toEqual(['two']);
			expect(actual).toBeUndefined();
		});

		it('recalls object', () => {
			const actual = recall(structure, { one: {} });

			expect(structure).toEqual(['two']);
			expect(actual).toBeUndefined();
		});

		it('recalls something', () => {
			const actual = recall(structure, { one: 1 });

			expect(structure).toEqual(['two']);
			expect(actual).toEqual({ one: 1 });
		});

		it('recalls everything', () => {
			const actual = recall(structure, { one: 1, two: 2 });

			expect(structure).toEqual([]);
			expect(actual).toEqual({ one: 1, two: 2 });
		});
	});
	
	describe('deep', () => {
		beforeEach(() => {
			structure = ['object', ['one', 'two']];
		});

		it('does not recall anything from object', () => {
			const actual = recall(structure, {});

			expect(structure).toEqual(['object', ['one', 'two']]);
			expect(actual).toBeUndefined();
		});

		it('recalls undefined from object', () => {
			const actual = recall(structure, { object: { one: undefined } });

			expect(structure).toEqual(['object', ['two']]);
			expect(actual).toBeUndefined();
		});

		it('recalls object from object', () => {
			const actual = recall(structure, { object: { one: {} } });

			expect(structure).toEqual(['object', ['two']]);
			expect(actual).toBeUndefined();
		});

		it('recalls something from object', () => {
			const actual = recall(structure, { object: { one: 1 } });

			expect(structure).toEqual(['object', ['two']]);
			expect(actual).toEqual({ object: { one: 1 } });
		});

		it('recalls everything from object', () => {
			const actual = recall(structure, { object: { one: 1, two: 2 } });

			expect(structure).toEqual([]);
			expect(actual).toEqual({ object: { one: 1, two: 2 } });
		});
	});
});
