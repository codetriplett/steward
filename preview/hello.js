module.exports = {
	fetch: ({ sentiment, region }) => ({ sentiment: sentiment || 'Hello', region }),
	render: require('./static/hello.min.js'),
};
