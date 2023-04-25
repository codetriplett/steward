require('../dist/steward.min.js')(8080, __dirname, ({ url }) => {
	console.log(url);
	return () => '';
},
	[/^static\//], // return asset according to its extension
	[/^$/, 'home.json'], // treat as stew layout
	[/^data\/(.*?)\/(.*?)\/?/, ['first', 'second'], params => {
		return params; // return JSON
	}],
	[/^alternate\/(.*?)\/?/, ['value'], (params, req, res) => {
		// custom treatment (use res instead of returning JSON)
	}],

	// POST with max payload size
	[/^post\/(.*?)\/?/, 1024, ['value'], (body, req, res) => {
		// custom treatment (use res instead of returning JSON)
	}],
);
