module.exports = {
	fetch: ({ sentiment, region }) => ({ sentiment: sentiment || 'Hello', region }),
	render: ({ sentiment, region }) => ['p', null, `${sentiment} ${region}`],
};
