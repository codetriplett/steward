import $, { updateText, updateAttribute } from './helpers';
import { render } from '..';

describe('render', () => {
	beforeEach(() => {
		updateText.mockClear();
		updateAttribute.mockClear();
	});

	describe('server', () => {
		it('text', () => {
			const actual = render(['abc']);
			expect(actual).toBe('abc');
		});

		it('leaf element', () => {
			const actual = render(['abc', { string: 'xyz', boolean: true }]);
			expect(actual).toBe('<abc string="xyz" true>');
		});

		it('complex', () => {
			const actual = render(['div', {}, [
				['abc'],
				['h1', {}, [
					['def']
				]],
				['img', { '': '2', src: 'image.jpg', alt: '' }],
				['ul', {}, [
					['li', { '': '0-0' }, [
						['123']
					]],
					['li', { '': '0-1' }, [
						['456']
					]],
					['li', { '': '0-2' }, [
						['789']
					]]
				]],
				['xyz']
			]]);

			expect(actual).toBe([
				'<div>',
					'abc',
					'<h1>def</h1>',
					'<img data--="2" src="image.jpg" alt="">',
					'<ul>',
						'<li data--="0-0">123</li>',
						'<li data--="0-1">456</li>',
						'<li data--="0-2">789</li>',
					'</ul>',
					'xyz',
				'</div>'
			].join(''));
		});
	});

	describe('client', () => {
		it('update text', () => {
			render(['xyz'], $('abc'));
			expect(updateText).toHaveBeenCalledWith('xyz');
		});

		it('keep text', () => {
			render(['abc'], $('abc'));
			expect(updateText).not.toHaveBeenCalled();
		});

		it('modifies attributes', () => {
			render(['abc', { string: 'xyz' }], $('abc', {}));
			expect(updateAttribute).toHaveBeenCalledWith('set', 'string', 'xyz');
		});
	});
});
