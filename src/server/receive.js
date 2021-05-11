export function receive (req) {
	return new Promise((resolve, reject) => {
		let body = '';
				
		req.on('data', (data) => {
			body += data;
			if (body.length > 1e6) req.connection.destroy();
		});

		req.on('end', () => {
			try {
				resolve(JSON.parse(body));
			} catch (err) {
				reject();
			}
		});
	});
}
