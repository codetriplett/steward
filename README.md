# Steward
A companion library for @triplett/stew that simplifies setting up a view server.

## Routes
In addition to rendering pages from layouts written in JSON, it can handle data requests, POST requests, or any other custom handling of the request you need. Routes are defined with regex patterns with a chain of middleware options after each one.

```js
import steward from '@triplett/steward';
const { send } = steward;

const { read } = steward(__dirname, 8080, (err, req, res) => {
	// handles errors
	const content = read('404.html'); // read 404.html from __dirname (current folder)
	send(res, content, 'html'); // send back as HTML
}
	[/^static\//], // treat anything starting with /static/ as a static asset
	[/^$/, 'home.json'], // render layout in home.json for home page
	[/^custom\//, (params, req, res) => {
		// params is an object of the parsed query params
		return data; // returns as HTML if a string or JSON if an object
		// can also use send() in place of return to customize what you return
	}],
	[/^article\/(.*)\//, ['name'], (params, req, res) => {
		// capture groups can be used to use a part of the url as a param
		const { name } = params;
		// props from body will overwrite any props of the same name from query params
	}],
	[/^post\//, 1024, (body, req, res) => {
		// props from body will overwrite any props of the same name from query params
	}],
);
```

The first leading and trailing slash will be removed from the URL, along with the query params. The query params are automatically parsed and passed to the next function that follows the regex.

## Page Layouts
Layouts follow the structure expected by @triplett/stew, except since they are written in JSON, functions aren't allowed. However, another function can be included after your error handling function in the example above to customize how you convert objects into HTML. For example, you can include objects in your layout that reference another component. This is also where you would set up caching for fragments of your layout.

```js

// example of JSON used for page layout
/*
["html", null,
	["head", null,
		["title", null, "Page Title"]
	],
	["body", null,
		{ "type": "example", "props": { "key": "value" } }
	]
]
*/

steward(__dirname, 8080, (err, req, res) => {
	// handles errors
	...
}, (object, params) => {
	// an example of a custom converter of objects
	const { type, props } = object;
	return retrieveOrRender(type, props);
	// 
},
	...
);
```

## Helpers
The API for this library is very light. Besides the call to set up the server, there are just a few helper functions available. Here is how to access them.

### send
Accessed directly off steward function, this simplifies how you respond to the request. It needs the res object from the request, which is passed as a param in your route functions. 'type' will default to 'txt' if not provided, and 'status' will default to 200;

```js
steward.send(res, content, type, status);
```

### types
Accessed directly off steward function, this is the mapping of extensions to their MIME types. You can add your own to this if they are missing and they will be processed by the static asset routes or your own calls to send() if you pass the new type string. The key of each entry matches the file extension.

### read
Accessed from the object returned by your steward call. Pass in a file path to return a Promise that resolves with the content of that file. Paths are relative to the directory you provided when setting up the server.

### write
Accessed from the object returned by your steward call. Pass in a file path and content to return a Promise that resolves once the files has been created or updated. Paths are relative to the directory you provided when setting up the server.
