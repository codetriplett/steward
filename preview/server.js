const { randomUUID } = require('crypto');
const steward = require('../dist/steward.min.js');
const { send, parse, stew } = steward;

function translatePath (path, params) {
	return path.replace(/\:\w+/, match => params[match.slice(1)]);
}

async function getLayout (url) {
	const regex = /^\/*(.*?)\/*(?:\?(.*?))?$/;
	const [, path = '', query] = url.match(regex);
	const [name] = path.split('/');
	const params = parse(query);
	const { fetch, render } = require(`./${name}.js`);
	const json = await fetch(params);
	const html = render(json);
	const id = `${name}-${randomUUID()}`;

	return [
		`<div id="${id}">${stew('', html)}</div>`,
		`<script id="${id}-data" type="application/json">${JSON.stringify(json)}</script>`,
		`<script src="/static/${name}.min.js"></script>`,
		`<script>steward('${id}', '${name}');</script>`,
	].join('');
}

const { read } = steward(__dirname, 8080, async (err, req, res) => {
	const content = await read('404.html');
	send(res, content, 'html');
}, ({ url }, params) => {
	const translateUrl = translatePath(url, params);
	return getLayout(translateUrl);
},
	[/^(?:favicon.ico$|static\/)/], // return asset according to its extension
	[/^$/, 'home.json'], // treat as stew layout
	[/^data\/(.*?)\/(.*)/, ['first', 'rest'], params => {
		return params; // return JSON
	}],
	[/^alternate\/(.*)/, ['value'], (params, req, res) => {
		// custom treatment (use res instead of returning JSON)
	}],
	// POST with max payload size
	[/^post\/(.*)/, 1024, ['value'], (body, req, res) => {
		// custom treatment (use res instead of returning JSON)
	}],
);
