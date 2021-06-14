export function render (object) {
	if (typeof object !== 'object') return '';
	const { '': dir, $_, $, _ } = this;
	const { '': string, ...props } = object;
	if (typeof string !== 'string') return '';
	let [, path = '', name = ''] = string.match(/^(.*?)(?:#(.*?))?$/);
	let tag;

	try {
		path = path.replace(/^\/*/, '');
		tag = path && require(`${dir}/${path}`);
		if (name) $_.add(path);
	} catch (err) {}

	return [
		$({ '': 'div' }, tag && $`<${tag} ${props} />`),
		name && [
			$({ '': 'script', type: 'application/json' }, JSON.stringify(props)),
			$({ '': 'script' },
				'(function(){',
				'var s,p,c;',
				's=document.querySelectorAll(\'script\');',
				's=s[s.length-1];',
				'p=s.previousSibling;',
				'c=p.previousSibling;',
				'p=JSON.parse(p.innerHTML);',
				`${_}(${tag ? 'c' : '{\'\':c}'},${_}(window.${name},p));`,
				'})();'
			)
		].join('')
	].join('');
}
