import { traverse } from '../traverse';

describe('traverse', () => {
	let stack;

	beforeEach(() => {
		stack = [[]];
	});

	describe('expression', () => {
		let expression;

		beforeEach(() => {
			expression = [];
			stack[0].push(expression);
		});

		it('empty', () => {
			const actual = traverse(stack);

			expect(stack).toEqual([[]]);
			expect(actual).toEqual([]);
		});

		it('populated', () => {
			expression.push('value');
			const actual = traverse(stack);

			expect(stack).toEqual([[['value']]]);
			expect(actual).toEqual([]);
		});
	});

	describe('open', () => {
		it('empty', () => {
			const actual = traverse(stack, []);

			expect(stack).toEqual([[], [[{}, '']]]);
			expect(actual).toBeUndefined();
		});

		it('blank', () => {
			const actual = traverse(stack, [{}, '']);

			expect(stack).toEqual([[], [[{}, '']]]);
			expect(actual).toBeUndefined();
		});

		it('single', () => {
			const actual = traverse(stack, [{ name: 'value' }, 'tag']);

			expect(stack).toEqual([[], [[{ name: 'value' }, 'tag']]]);
			expect(actual).toBeUndefined();
		});

		it('double', () => {
			const actual = traverse(stack, [
				{ name: 'abc' }, 'one',
				{ name: 'xyz' }, 'two'
			]);

			expect(stack).toEqual([[], [[
				{ name: 'abc' }, 'one',
				{ name: 'xyz' }, 'two'
			]]]);

			expect(actual).toBeUndefined();
		});
	});

	describe('close', () => {
		beforeEach(() => {
			stack = [[['first'], ['last']], [[{ name: 'abc' }, 'tag']]];
		});

		it('blank', () => {
			const actual = traverse(stack, [{}, '', '', {}]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, 'tag',
				['first'], ['last'],
				'', {}
			]]]);

			expect(actual).toBeUndefined();
		});

		it('single', () => {
			const actual = traverse(stack, [{}, '', 'data', { name: 'xyz' }]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, 'tag',
				['first'], ['last'],
				'data', { name: 'xyz' }
			]]]);

			expect(actual).toBeUndefined();
		});

		it('double', () => {
			const actual = traverse(stack, [
				{}, '',
				'one', { name: 'lmno' },
				'two', { name: 'xyz' }
			]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, 'tag',
				['first'], ['last'],
				'one', { name: 'lmno' },
				'two', { name: 'xyz' }
			]]]);

			expect(actual).toBeUndefined();
		});
	});

	describe('leaf', () => {
		it('tag', () => {
			const actual = traverse(stack, [
				{}, 'tag',
				'data', { name: 'xyz' }
			]);

			expect(stack).toEqual([[[
				{}, 'tag',
				'data', { name: 'xyz' }
			]]]);

			expect(actual).toBeUndefined();
		});

		it('attributes', () => {
			const actual = traverse(stack, [
				{ name: 'abc' }, '',
				'data', { name: 'xyz' }
			]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, '',
				'data', { name: 'xyz' }
			]]]);

			expect(actual).toBeUndefined();
		});

		it('empty', () => {
			const actual = traverse(stack, [
				{ name: 'abc' }, 'tag',
				'', {}
			]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, 'tag',
				'', {}
			]]]);

			expect(actual).toBeUndefined();
		});

		it('full', () => {
			const actual = traverse(stack, [
				{ name: 'abc' }, 'tag',
				'data', { name: 'xyz' }
			]);

			expect(stack).toEqual([[[
				{ name: 'abc' }, 'tag',
				'data', { name: 'xyz' }
			]]]);

			expect(actual).toBeUndefined();
		});
	});
});
