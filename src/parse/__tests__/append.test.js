import { append } from '../append';

describe('append', () => {
	let expression;
	let complete;
	let element;
	let closing;
	let test;

	beforeEach(() => {
		expression = [];
		complete = undefined;
		element = undefined;
		closing = undefined;

		test = (value, expected, expectedElement, callback) => {
			const copy = JSON.parse(JSON.stringify(expression));
			const actual = append(expression, value, complete, element, closing);

			if (complete === undefined) {
				expect(actual).toEqual([...copy, value]);
			} else {
				expect(actual).toEqual(expected);
				expect(element).toEqual(expectedElement);
			}

			if (callback) {
				callback(actual);
			} else {
				expect(actual).toBe(expression);
			}
		};
	});

	describe('value', () => {
		describe('beginning', () => {
			beforeEach(() => {
				complete = false;
			});

			it('empty', () => {
				test(' \n ', []);
			});

			it('value', () => {
				test(' \n one \n ', ['one ']);
			});
		});

		describe('middle', () => {
			beforeEach(() => {
				expression = ['one'];
				complete = false;
			});

			it('empty', () => {
				test(' \n ', ['one', ' ']);
			});

			it('value', () => {
				test(' \n two \n ', ['one', ' two ']);
			});
		});

		describe('end', () => {
			beforeEach(() => {
				expression = ['one'];
				complete = true;
			});

			it('empty', () => {
				test(' \n ', ['one']);
			});

			it('value', () => {
				test(' \n two \n ', ['one', ' two']);
			});
		});

		describe('only', () => {
			beforeEach(() => {
				complete = true;
			});

			it('empty', () => {
				test(' \n ', []);
			});

			it('value', () => {
				test(' \n one \n ', ['one']);
			});
		});
	});
	
	describe('open', () => {
		beforeEach(() => {
			element = [];
			closing = false;
		});

		describe('beginning', () => {
			beforeEach(() => {
				complete = false;
			});

			it('empty', () => {
				test(' \n ', [], [{
					'': []
				}, ''], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[0]['']);
				});
			});

			it('one', () => {
				test('one', [], [{
					'': []
				}, 'one'], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[0]['']);
				});
			});

			it('one=', () => {
				test('one=', [], [{
					'': [],
					one: []
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].one);
				});
			});

			it('=', () => {
				test('=', [null], [{
					'': [null]
				}, ''], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[0]['']);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': []
				}, 'one', {
					'': []
				}, 'two'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[2]['']);
				});
			});
			
			it('one two=', () => {
				test('one \n two=', [], [{
					'': [],
					two: []
				}, 'one'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].two);
				});
			});
			
			it('one =', () => {
				test('one \n =', [], [{
					'': [],
					one: []
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].one);
				});
			});
			
			it('one= two', () => {
				test('one= \n two', [], [{
					'': [],
					one: []
				}, '', {
					'': []
				}, 'two'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[2]['']);
				});
			});
			
			it('one= two=', () => {
				test('one= \n two=', [], [{
					'': [],
					one: [],
					two: []
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].two);
				});
			});
			
			it('one= =', () => {
				test('one= \n =', [null], [{
					'': [],
					one: [null]
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].one);
				});
			});
			
			it('= two', () => {
				test('= \n two', [], [{
					'': [null]
				}, '', {
					'': []
				}, 'two'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[2]['']);
				});
			});
			
			it('= two=', () => {
				test('= \n two=', [], [{
					'': [null],
					two: []
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].two);
				});
			});
			
			it('= =', () => {
				test('= \n =', [null, null], [{
					'': [null, null]
				}, ''], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[0]['']);
				});
			});
		});

		describe('middle', () => {
			beforeEach(() => {
				complete = false;
				element = [{ '': expression }, 'tag'];
			});

			it('empty', () => {
				test(' \n ', [], [{
					'': []
				}, 'tag'], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[0]['']);
				});
			});

			it('one', () => {
				test('one', [], [{
					'': []
				}, 'tag', {
					'': []
				}, 'one'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[2]['']);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': [],
					one: true
				}, 'tag', {
					'': []
				}, 'two'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[2]['']);
				});
			});
			
			it('one two=', () => {
				test('one \n two=', [], [{
					'': [],
					one: true,
					two: []
				}, 'tag'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[0].two);
				});
			});
		});

		describe('end', () => {
			beforeEach(() => {
				complete = true;
				element = [{ '': expression }, 'tag'];
			});

			it('one', () => {
				test('one', [], [{
					'': [],
					one: true
				}, 'tag'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].one);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': [],
					one: true,
					two: true
				}, 'tag'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});
			
			it('one= two', () => {
				test('one= \n two', [], [{
					'': [],
					one: [],
					two: true
				}, 'tag'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});
			
			it('= two', () => {
				test('= \n two', [], [{
					'': [null],
					two: true
				}, 'tag'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});
		});

		describe('only', () => {
			beforeEach(() => {
				complete = true;
			});

			it('one two', () => {
				test('one \n two', [], [{
					'': [],
					two: true
				}, 'one'], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});

			it('one= two', () => {
				test('one= \n two', [], [{
					'': [],
					one: [],
					two: true
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});

			it('= two', () => {
				test('= \n two', [], [{
					'': [null],
					two: true
				}, ''], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[0].two);
				});
			});
		});
	});

	describe('close', () => {
		beforeEach(() => {
			element = [];
			closing = true;
		});

		describe('beginning', () => {
			beforeEach(() => {
				complete = false;
				element = [{ '': [] }, 'tag'];
			});

			it('empty', () => {
				test(' \n ', [], [{
					'': []
				}, 'tag', '', {
					'': []
				}], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[3]['']);
				});
			});

			it('one', () => {
				test('one', [], [{
					'': []
				}, 'tag', 'one', {
					'': []
				}], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[3]['']);
				});
			});

			it('one=', () => {
				test('one=', [], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].one);
				});
			});

			it('=', () => {
				test('=', [null], [{
					'': []
				}, 'tag', '', {
					'': [null]
				}], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[3]['']);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': []
				}, 'tag', 'one', {
					'': []
				}, 'two', {
					'': []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[5]['']);
				});
			});
			
			it('one two=', () => {
				test('one \n two=', [], [{
					'': []
				}, 'tag', 'one', {
					'': [],
					two: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].two);
				});
			});
			
			it('one =', () => {
				test('one \n =', [], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].one);
				});
			});
			
			it('one= two', () => {
				test('one= \n two', [], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: []
				}, 'two', {
					'': []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[5]['']);
				});
			});
			
			it('one= two=', () => {
				test('one= \n two=', [], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: [],
					two: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].two);
				});
			});
			
			it('one= =', () => {
				test('one= \n =', [null], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: [null]
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].one);
				});
			});
			
			it('= two', () => {
				test('= \n two', [], [{
					'': []
				}, 'tag', '', {
					'': [null]
				}, 'two', {
					'': []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[5]['']);
				});
			});
			
			it('= two=', () => {
				test('= \n two=', [], [{
					'': []
				}, 'tag', '', {
					'': [null],
					two: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].two);
				});
			});
			
			it('= =', () => {
				test('= \n =', [null, null], [{
					'': []
				}, 'tag', '', {
					'': [null, null]
				}], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[3]['']);
				});
			});
		});

		describe('middle', () => {
			beforeEach(() => {
				complete = false;
				element = [{ '': [] }, 'tag', 'path', { '': expression }];
			});

			it('empty', () => {
				test(' \n ', [], [{
					'': []
				}, 'tag', 'path', {
					'': []
				}], actual => {
					expect(actual).toBe(expression);
					expect(actual).toBe(element[3]['']);
				});
			});

			it('one', () => {
				test('one', [], [{
					'': []
				}, 'tag', 'path', {
					'': []
				}, 'one', {
					'': []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[5]['']);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': []
				}, 'tag', 'path', {
					'': [],
					one: true
				}, 'two', {
					'': []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[5]['']);
				});
			});
			
			it('one two=', () => {
				test('one \n two=', [], [{
					'': []
				}, 'tag', 'path', {
					'': [],
					one: true,
					two: []
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).toBe(element[3].two);
				});
			});
		});

		describe('end', () => {
			beforeEach(() => {
				complete = true;
				element = [{ '': [] }, 'tag', 'path', { '': expression }];
			});

			it('one', () => {
				test('one', [], [{
					'': []
				}, 'tag', 'path', {
					'': [],
					one: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].one);
				});
			});
			
			it('one two', () => {
				test('one \n two', [], [{
					'': []
				}, 'tag', 'path', {
					'': [],
					one: true,
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});
			
			it('one= two', () => {
				test('one= \n two', [], [{
					'': []
				}, 'tag', 'path', {
					'': [],
					one: [],
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});
			
			it('= two', () => {
				test('= \n two', [], [{
					'': []
				}, 'tag', 'path', {
					'': [null],
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});
		});

		describe('only', () => {
			beforeEach(() => {
				complete = true;
				element = [{ '': [] }, 'tag'];
			});

			it('one two', () => {
				test('one \n two', [], [{
					'': []
				}, 'tag', 'one', {
					'': [],
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});

			it('one= two', () => {
				test('one= \n two', [], [{
					'': []
				}, 'tag', '', {
					'': [],
					one: [],
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});

			it('= two', () => {
				test('= \n two', [], [{
					'': []
				}, 'tag', '', {
					'': [null],
					two: true
				}], actual => {
					expect(actual).not.toBe(expression);
					expect(actual).not.toBe(element[3].two);
				});
			});
		});
	});
});
