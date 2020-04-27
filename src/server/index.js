import http from 'http';
import { fetch } from './fetch';

export function server (port, directory) {
	http.createServer(({ url }, res) => {
		return fetch(`${directory}${url}`, res);
	}).listen(port);
}
