function renderPage (title, ...content) {
	return render => `<!doctype html>
<html lang="en">
	<head>
		<title>${title}</title>
	</head>
	<body>
		${content.map(it => render(it)).join('')}
	</body>
</html>`;
}

require('../dist/steward.min.js')(8080, [
	__dirname,
	'directory.js',
	'accordion.js'
], () => {
	return renderPage('Directory', {
		'': 'directory.js#Directory',
		links: [
			{
				href: '/accordion?items=one,two,three,four,five,six',
				text: 'Accordion'
			}
		]
	});
})(/^accordion$/, ({ items }) => {
	return renderPage('Accordion', {
		'': 'accordion.js#Accordion',
		items: items.split(',')
	});
})(/^api\/v1\/data$/, () => {
	return { key: 'value' };
});
