# Steward
A companion library for @triplett/stew. It takes care of all the work needed to set up a basic node server. Features such as routing, request types, response headers and file management are greatly simplified.

## Server

```js
import $$ from '@triplett/steward';

$$(8080, [
	// must include an absolute path to the local file that contains the stew library
	// the value after # serves as an alias for the stew library on the client
	`${__dirname}/stew.min.js#$`,
	// any additional resources you want to allow access to can be included here
	// all paths are relative to the folder that contains the stew library above
	// a custom route can be created to return resources as well
	'component.js'
], (props, file) => {
	// this function will be used to resolve requests to the home page of your site
	// the first parameter holds the values of query params in the url
	// the body of any POST or PUT requests will be included on the '' key of the first parameter
	// the file function can be used to read the contents of any files in your project

	// if a function is returned it will be used to generate HTML
	// a render function will be passed to that function help set up stew components
	// pass in the path to the file to have it server side render
	// you can also (or instead) include a value after # to have it client side render
	// the scripts for the stew library and the rendered components will be included automatically
	return render => `<!doctype html>
		<html lang="en">
			<head>
				<title>${title}</title>
			</head>
			<body>
				${render({ '': 'component.js#Component', ...props })}
			</body>
		</html>
	`;
})(/^(page|api)\/(.*?)$/, (props, mode, path, file) => {
	// additional routes can be defined in a chain off the original call
	// custom regex will be used to match the incoming url starting from the bottom of the list
	// grouped matches will be included as params between props and the file function

	// returning undefined will result in a 404
	// if no extension was included, it will return the 404.html file (if found) relative to your root directory

	// returning anything other than a function will be returned with the proper type based on its extension
	// if no extension was included in the url, it will be returned as JSON
	return { key: 'value' };
});
```
