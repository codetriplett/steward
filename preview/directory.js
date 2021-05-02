const $ = typeof window === 'object' ? window.$ : require('@triplett/stew');

function Directory ({ links }) {
	return $`
		<ul>
			${links.map(({ href, text }) => (
				$`<li><a href=${href}>${text}</></>`
			))}
		</>
	`;
}

if (typeof window !== 'object') module.exports = Directory;
