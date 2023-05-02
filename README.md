# Steward
A companion library for @triplett/stew that simplifies setting up a view server.

## Routes
Routes are defined with regex to match the incoming url, and can be followed by a chain of middleware to handle the request. There are a few shortcuts for handling things like static assets and POST requests, but you can also set your own middleware functions for full control over the request.

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
		// receive incoming data, but close connection if it exceeds the set limit (number after regex)
		// data will be passed along as a string if limit is negative, otherwise it will be converted to JSON
, 		// props from body will overwrite any props of the same name from query params
	}],
);
```

The first leading and trailing slash will be removed from the URL, along with the query params. The query params are automatically parsed and passed to the next middleware function that follows the regex. Multiple middleware functions can be set and each will wait for the return value of the previous one to resolve before being called, but only if the resolved value is not undefined. Those returned values are passed to the next as the new params object, but could be any data type.

## Page Layouts
Layouts follow the structure expected by @triplett/stew except, since they are written in JSON, functions aren't allowed. Custom logic can be implemented through the use of a custom converter function that will act on any non-array object it finds. This is an optional function that can be set after your error handling function, and should return a string that represents that portion of your layout. These strings will be inserted into your layout when it renders as-is, instead of escaping the characters it normally would.

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
	// the function above is just an example of how this could be used to implement caching
},
	...
);
```

## Helpers
The API for this library is very light. Besides the call to set up the server, there are just a few helper functions available. Here is how to access them.

### send
Accessed directly off steward function, this simplifies how you respond to the request. It needs the res object from the request, which is passed as a param in your middleware functions. 'type' will default to 'txt' if not provided, and 'status' will default to 200. This helper is not necessary if your middleware returns an object or string, which would be treated as JSON and HTML respectively.

```js
steward.send(res, content, type, status);
```

### receieve
Accessed directly off steward function, this simplifies how you receive request data. It needs the req object from the request, which is passed as a param in your middleware functions. 'limit' sets when the connection should be closed due to too much incoming data. This is only necessary if you wish to handle this action within your middleware instead of using the natural method of putting the limit after the regex in your route.

```js
const data = await steward.receive(req, limit);
```

### render
Accessed directly off steward function, this allows you to render a layout within your middleware. The effect is similar to how layouts are rendered when set directly as strings in your route, but also allows you to pass a custom converter to override the common one for your server.

```js
const html = await steward.render(layout, params); // use common converter
const html = await steward.render(layout, params, converter); // use custom converter
```

### render
Accessed directly off steward function, this simply splits a string using two delimiters. These delimiters default to '&' and '=' to parse query strings. The result will be an object.

```js
const props = await steward.parse(string); // parse query string
const props = await steward.parse(string, ' ', ':'); // parse custom format
```

### types
Accessed directly off steward function, this is the mapping of extensions to their MIME types. You can add your own to this if they are missing and they will be processed by the static asset routes or your own calls to send(). The key of each entry should match the file extension, without the dot.

### read, write
Accessed from the object returned by your steward call. Pass in a relative file path (and content for write), to return a Promise that resolves when the operation has finished. The promise will only return the file's contents when using the read helper. Paths are relative to the directory you provided when setting up the server.

### get, post, put, del
Accessed from the object returned by your steward call. Allows you to simulate a GET, POST, PUT, or DELETE request to your server. The result will be returned as a promise.
