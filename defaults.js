"use strict";

const defaults = {
	"js": {
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
	"css": {
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
	"html": {
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
};
module.exports = function(settings) {
	let result = {};
	//the provided setting overrides everything from level 2.
	for (let a in defaults) {
		result[a] = {};
		for (let b in defaults[a]) {
			if (settings[a] && b in settings[a]) result[a][b] = settings[a][b];
			else result[a][b] = defaults[a][b];
		}
		//if there's something we missed:
		for (let b in settings[a]) {
			if (!(b in result[a])) result[a][b] = settings[a][b];
		}
	}
	return result;
};
