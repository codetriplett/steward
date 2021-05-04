const $ = typeof window === 'object' ? window.$ : require('@triplett/stew');

function Accordion ({
	'': { '': hook, expanded },
	items
}) {
	return $`
		${() => expanded && hook('3').focus()}
		<ul>
			${items.slice(0, expanded ? undefined : 3).map((item, i) => $`
				<li ${{ '': i }} tabindex="-1">${item}</>
			`)}
		</>
		<button type="button" onclick=${() => hook({ expanded: !expanded })}>
			Show ${expanded ? 'Less' : 'More'}
		</>
	`;
}

if (typeof window !== 'object') module.exports = Accordion;
