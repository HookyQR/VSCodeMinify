# minify for VS Code 

[![Build Status](https://api.travis-ci.org/HookyQR/VSCodeMinify.svg?branch=master)](https://travis-ci.org/HookyQR/VSCodeMinify)

Minify your js, css and html files to save transmit bandwidth. Calls each of the minifiers directly, allowing settings to be passed:
* **JS:** [uglify-js](http://lisperator.net/uglifyjs) v2.6.1
* **CSS:** [clean-css](https://github.com/jakubpawlowicz/clean-css) v3.4.8
* **HTML:** [html-minifier](http://kangax.github.io/html-minifier/) v1.0.1

Run the file minifier with **F1** `Minify`.

Folders containing Javascript and CSS file can be minified to a single file (to `{dirname}.min.[css|js]`) with **F1** `Minify Directory`. It is acceptable to have a single directory minified for both Javascript and CSS.

Optionally runs minify on save when a matching minified file (and/or directory) already exists. Enalbe in your user or workspace settings. The setting defaults are shown below:

```json
"minify.minifyExistingOnSave": false,

"minify.js": {
	"sequences": true,
	"properties": true,
	"dead_code": true,
	"drop_debugger": true,
	"unsafe": false,
	"conditionals": true,
	"comparisons": true,
	"evaluate": true,
	"booleans": true,
	"loops": true,
	"unused": true,
	"hoist_funs": true,
	"hoist_vars": false,
	"if_return": true,
	"join_vars": true,
	"cascade": true,
	"warnings": true,
	"negate_iife": false,
	"pure_getter": false,
	"pure_funcs": null,
	"drop_console": false,
	"keep_fargs": true,
	"keep_fnames": false,
	"global_defs": {}
},
"minify.css": {
	"advanced": true,
	"aggressiveMerging": true,
	"compatibility": "*",
	"inliner": {},
	"keepBreaks": false,
	"keepSpecialComments": "*",
	"mediaMerging": true,
	"processImport": true,
	"processImportFrom": ["all"],
	"rebase": true,
	"restructuring": true,
	"root": "${workspaceRoot}",
	"roundingPrecision": 2,
	"semanticMerging": false,
	"shorthandCompacting": true
},
"minify.html": {
	"removeComments": true,
	"removeCommentsFromCDATA": true,
	"removeCDATASectionsFromCDATA": true,
	"collapseWhitespace": true,
	"conservativeCollapse": false,
	"preserveLineBreaks": false,
	"collapseBooleanAttributes": true,
	"removeAttributeQuotes": false,
	"removeRedundantAttributes": true,
	"preventAttributesEscaping": false,
	"useShortDoctype": true,
	"removeEmptyAttributes": true,
	"removeScriptTypeAttributes": true,
	"removeStyleLinkTypeAttributes": true,
	"removeOptionalTags": true,
	"removeIgnored": false,
	"removeEmptyElements": false,
	"lint": false,
	"keepClosingSlash": false,
	"caseSensitive": false,
	"minifyJS": true, //uses minify.js settings if true
	"minifyCSS": true, //uses minify.css settings if true
	"minifyURLs": false,
	"ignoreCustomComments": [],
	"ignoreCustomFragments": [],
	"processScripts": [],
	"maxLineLength": false,
	"customAttrAssign": [],
	"customAttrSurround": [],
	"customAttrCollapse": "",
	"quoteCharacter": "\""
}
```

`minifiy.css.root` accepts "`${workspaceRoot}`/some/path" to define the internal `@import` absolute root.

Since `html-minifier` also uses `clean-css` and `uglify-js`, setting `minifyJS` or `minifyCSS` to **`true`** will embed the settings you have supplied for those minifiers automatically. You can provide your own settings as an object if you want some different methods to be used.

Like [beautify for VS Code](), minify accepts an array for file extension that you will accept minification of under `minify.JSfiles`, `minify.CSSfiles`, and `minify.HTMLfiles`.

## Changes:
### 0.1.1: 01 Jan 2015
* Fixed use of and enforcement of defaults.

### 0.1.0: 01 Jan 2015
* Now includes the inner components of minify directly.
* Allow preferences for all three minifiers.
* Allow minifiying whole directories for css and js.


### 0.0.3: 24 Dec 2015
* Removed suborinate module tests from package output
* Added icon

### 0.0.2: 17 Dec 2015
* Remove `json` from valid types.
* Indicate fail on empty file.
* Change report line to percentage.

