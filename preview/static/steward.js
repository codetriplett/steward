window.components = {};

function steward (id, type) {
	const render = window.components[type];
	const data = JSON.parse(document.querySelector(`#${id}-data`).textContent);
	const layout = render(data);
	stew(`#${id}`, layout);
}
