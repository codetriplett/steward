import { createServer } from 'http';
import { fetch } from './fetch';
import { render } from '../render';

export function server (port, directory) {
	createServer(({ url }, res) => {
		fetch(`${directory}${url}`, res, data => data);
	}).listen(port);
}
