module.exports = {
	fetch: ({ region }) => ({ sentiment: 'Hello', region }),
	render: ({ sentiment, region }) => ['p', null, `${sentiment} ${region}`],
};
