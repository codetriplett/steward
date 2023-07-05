const { randomUUID } = require('crypto');
const steward = require('../dist/steward.min.js');
const { send, stew } = steward;

async function convertComponent (type, params, container) {
	const { fetch, render } = require(`./${type}.js`);
	const json = await fetch(params);
	const layout = render(json);
	const id = `${type}-${randomUUID()}`;

	stew(container, ['', null,
		['div', { id }, layout],
		['script', { id: `${id}-data`, type: 'application/json' }, JSON.stringify(json)],
		['script', { src: `/static/${type}.min.js` }],
		['script', null, `steward('${id}', '${type}');`],
	], convertComponent, params);
}

const { read } = steward(__dirname, 8080, async (err, req, res) => {
	console.log(err);
	const content = await read('404.html');
	send(res, content, 'html', 404);
}, ({ type, params = [], options = {} }, vars, container) => {
	const names = new Set([...params, Object.keys(options)]);
	const values = { ...vars, ...options };
	const entries = [...names].sort((a, b) => a - b).map(name => [name, values[name]]);
	const compositeParams = Object.fromEntries(entries);
	convertComponent(type, compositeParams, container);
},
	[/^(?:favicon.ico$|static\/)/], // return asset according to its extension
	[/^$/, 'home.json'], // treat as stew layout
	[/^data\/(.*?)\/(.*)/, ['first', 'rest'], params => {
		return params; // return JSON
	}],
	[/^alternate\/?(.+)?/, ['region'], (params, req, res) => {
		// custom treatment (use res instead of returning JSON)
		const { region = 'Earth' } = params;
		send(res, `Greetings ${region}`);
	}],
	[/^post\/?(.*)/, 1024, ['value'], (body, req, res) => {
		// custom treatment (use res instead of returning JSON)
		return body;
	}],
);
