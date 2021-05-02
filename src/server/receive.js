export function receive (req) {
	return new Promise(resolve => {
		let body = '';
				
		req.on('data', (data) => {
			body += data;
			if (body.length > 1e6) req.connection.destroy();
		});

		req.on('end', () => resolve(body));
	});
}
