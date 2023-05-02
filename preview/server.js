const { randomUUID } = require('crypto');
const steward = require('../dist/steward.min.js');
const { send, stew } = steward;

async function getLayout (type, params) {
	const { fetch, render } = require(`./${type}.js`);
	const json = await fetch(params);
	const html = render(json);
	const id = `${type}-${randomUUID()}`;

	return [
		`<div id="${id}">${stew('', html)}</div>`,
		`<script id="${id}-data" type="application/json">${JSON.stringify(json)}</script>`,
		`<script src="/static/${type}.min.js"></script>`,
		`<script>steward('${id}', '${type}');</script>`,
	].join('');
}

const { read } = steward(__dirname, 8080, async (err, req, res) => {
	console.log(err);
	const content = await read('404.html');
	send(res, content, 'html', 404);
}, ({ type, params = [], options = {} }, vars) => {
	const names = new Set([...params, Object.keys(options)]);
	const values = { ...vars, ...options };
	const entries = [...names].sort((a, b) => a - b).map(name => [name, values[name]]);
	const compositeParams = Object.fromEntries(entries);
	return getLayout(type, compositeParams);
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
