require('./steward.min.js')(8080, [
	`${__dirname}/stew.min.js#$`,
	'directory.js',
	'accordion.js',
	'favicon.ico'
], () => {
	return render => `
		<!doctype html>
		<html lang="en">
			<head>
				<title>Directory</title>
			</head>
			<body>
				${render({ '': 'directory.js#Directory', links: [
					{
						href: '/accordion?items=one,two,three,four,five',
						text: 'Accordion'
					}
				] })}
			</body>
		</html>
	`;
})(/^accordion$/, ({ items }) => {
	return render => `
		<!doctype html>
		<html lang="en">
			<head>
				<title>Accordion</title>
			</head>
			<body>
				${render({ '': 'accordion.js#Accordion', items: items.split(',') })}
			</body>
		</html>
	`;
});
