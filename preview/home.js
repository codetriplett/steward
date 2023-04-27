module.exports = {
	component: ({ sentiment = 'Hello' }) => ["", null,
		["!DOCTYPE", { "html": true }],
		["head", null,
			["title", null, "Home"]
		],
		["body", { "lang": "en" },
			['p', null, `${sentiment} World`]
		]
	]
};
