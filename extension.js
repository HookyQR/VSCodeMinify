"use strict";
const vscode = require('vscode');
const minjs = require('terser');
const mincss = require('clean-css');
const minhtml = require('html-minifier');
const fs = require('fs');
const path = require('path');

const quotedStyles = ["best", "single", "double", "original"]
//register on activation
function activate(context) {
	let cleanSettings = function (opts) {
		if (opts.js && opts.js.output && opts.js.output.quote_style) {
			opts.js.output.quote_style = quotedStyles.indexOf(opts.js.output.quote_style);
			if (opts.js.output.quote_style < 0) opts.js.output.quote_style = 0;
		}
		if (opts.js) {
			delete opts.js.spidermonkey;
			delete opts.js.outSourceMap;
			delete opts.js.inSourceMap;
			delete opts.js.sourceMapUrl;
			delete opts.js.sourceMapInline;
			delete opts.js.fromString;
			delete opts.js.warnings;
			delete opts.js.mangleProperties;
			delete opts.js.nameCache;
			delete opts.js.parse;
			if (opts.js.output) {
				delete opts.js.output.beatify;
				delete opts.js.output.source_map;
				// options changed with move to terser
				if ('bracketize' in opts.js.output) {
					if (!('braces' in opts.js.output)) {
						opts.js.output.braces = opts.js.output.bracketize;
					}
					delete opts.js.output.bracketize;
				}
			}
			if (opts.js.compress) {
				delete opts.js.compress.warnings;
				delete opts.js.compress.cascade; // option removed with move to terser
			}
		}
		//drop these settings:
		if (opts.css) {
			delete opts.css.sourceMap;
			delete opts.css.sourceMapInlineSources;
			delete opts.css.benchmark;
			delete opts.css.debug;
		}
		//switch settings for html:
		if (opts.css && opts.html && opts.html.minifyCSS === true) opts.html.minifyCSS = opts.css;
		if (opts.js && opts.html && opts.html.minifyJS === true) opts.html.minifyJS = opts.js;
		return opts;
	};
	let settings = cleanSettings(vscode.workspace.getConfiguration()
		.get("minify"));
	let sendFileOut = function (fileName, data, stats) {
		fs.writeFile(fileName, data, "utf8", () => {
			let status = "Minified: " + stats.files + " files";
			if (stats.length) status = "Minified: " + (((data.length / stats.length) * 10000) | 0) / 100 +
				"% of original" + (stats.errors ? " but with errors." : (stats.warnings ? " but with warnings." : "."));
			vscode.window.setStatusBarMessage(status, 5000);
		});
	};
	let doMinify = function (document) {
		let outName = document.fileName.split('.');
		const ext = outName.pop();
		outName.push("min");
		outName.push(ext);
		outName = outName.join('.');
		let data = document.getText();
		//if the document is empty here, we output an empty file to the min point
		if (!data.length) return sendFileOut(outName, "", {
			length: 1
		});
		//what are we minifying?
		const isJS = ext.toLocaleLowerCase() === 'js';
		const isCSS = ext.toLocaleLowerCase() === 'css';
		const isHTML = ext.toLocaleLowerCase() === 'html' || ext.toLocaleLowerCase() === 'htm';
		if (isJS) {
			let opts = settings.js;
			try {
				let results = minjs.minify(data, opts);
				if(results.error) {
					throw results.error;
				}
				sendFileOut(outName, results.code, {
					length: data.length
				});
			} catch (e) {
				vscode.window.setStatusBarMessage("Minify failed: " + e.message, 5000);
			}
		} else if (isCSS) {
			let base = settings.css.root.slice();
			settings.css.root = settings.css.root.replace("${workspaceRoot}", vscode.workspace.rootPath || "");
			let cleanCSS = new mincss(settings.css);
			cleanCSS.minify(data, (error, results) => {
				settings.css.root = base;
				if (results && results.styles) sendFileOut(outName, results.styles, {
					length: data.length,
					warnings: results.warnings.length,
					errors: results.errors.length
				});
				else if (error) vscode.window.setStatusBarMessage("Minify failed: " + error.length + " error(s).", 5000);

			});
		} else if (isHTML) {
			// convert regex strings
			let t = settings.html.minifyCSS;
			let results;
			if (typeof t === "object") {
				if (t.root) {
					t = t.root.slice();
					settings.html.minifyCSS.root = "";
				} else t = false;
			} else t = false;
			try {
				settings.html.ignoreCustomFragments = settings.html.ignoreCustomFragments || [];
				['customAttrAssign', 'customAttrSurround', 'customEventAttributes', 'ignoreCustomComments', 'ignoreCustomFragments']
				.forEach(n => {
					let e = settings.html[n];
					if (Array.isArray(e)) {
						settings.html[n] = e.map(ee => (typeof ee === 'string') ? new RegExp(ee.replace(/^\/(.*)\/$/, '$1')) : ee);
					}
				});
				if (typeof settings.html.customAttrCollapse === 'string')
					settings.html.customAttrCollapse = new RegExp(settings.html.customAttrCollapse.replace(/^\/(.*)\/$/, '$1'));
				results = minhtml.minify(data, settings.html);
			} catch (e) {
				return vscode.window.setStatusBarMessage("Minify failed. (exception)", 5000);
			}
			if (t) settings.html.minifyCSS.root = t;
			if (results) sendFileOut(outName, results, {
				length: data.length
			});
			else vscode.window.setStatusBarMessage("Minify failed.", 5000);
		}
		//otherwise, we don't care ...
	};
	let doMinifyDir = function (folder, ext) {
		fs.readdir(folder, (err, files) => {
			//keep just our extension, drop all pre min'ed
			files = files.sort()
				.filter(f => path.extname(f)
					.slice(1) === ext)
				.filter(f => !f.endsWith(".min." + ext))
				.map(f => path.join(folder, f));
			if (files.length === 0) return vscode.window.setStatusBarMessage(`No files for directory minify (${ext})`,
				5000);
			let outName = folder + ".min." + ext;
			if (ext === 'js') {
				let opts = settings.js;
				Promise.all(files.map(
					file => new Promise(res => fs.readFile(file, 'utf8', (e, data) => {
						res(data || "");
					})))).then(data => {
					let results = minjs.minify(data, opts);
					if ( results.error) { throw results.error; }
					sendFileOut(outName, results.code, {
						files: files.length
					});
				}).catch(e => vscode.window.setStatusBarMessage("Minify failed with error: " + e.message, 5000));
			} else {
				let base = settings.css.root.slice();
				settings.css.root = settings.css.root.replace("${workspaceRoot}", vscode.workspace.rootPath || "");
				//strip the root dir from the whole file set
				files = files.map(f => f.replace(settings.css.root, ""));
				let cleanCSS = new mincss(settings.css);

				cleanCSS.minify(files, (error, results) => {
					settings.css.root = base;
					if (results && results.styles && results.styles.length) sendFileOut(outName, results.styles, {
						files: files.length,
						warnings: results.warnings.length,
						errors: results.errors.length
					});
					else if (error) vscode.window.setStatusBarMessage("Minify failed: " + error.length + " error(s).",
						5000);
				});
			}
		});
	};
	let disposable = vscode.commands.registerCommand('HookyQR.minify', function () {
		const active = vscode.window.activeTextEditor;
		if (!active || !active.document) return;
		if (active.document.isUntitled) return vscode.window.setStatusBarMessage(
			"File must be saved before minify can run",
			5000);
		return doMinify(active.document);
	});
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('HookyQR.minifyDir', function () {
		const active = vscode.window.activeTextEditor;
		if (!active || !active.document) return;
		if (active.document.isUntitled) return vscode.window.setStatusBarMessage(
			"File must be saved before minify can run",
			5000);

		let ext = active.document.fileName.split('.')
			.pop()
			.toLowerCase();
		if (ext === 'js' || ext === 'css') doMinifyDir(path.dirname(active.document.fileName), ext);
		else vscode.window.setStatusBarMessage("Active file must be .css or .js to minify parent directory.",
			5000);
	});
	context.subscriptions.push(disposable);
	disposable = vscode.workspace.onDidChangeConfiguration(() => {
		settings = cleanSettings(vscode.workspace.getConfiguration()
			.get("minify"));
	});
	context.subscriptions.push(disposable);

	disposable = vscode.workspace.onDidSaveTextDocument(function (doc) {
		//check if the user wants to do a minify here
		if (!vscode.workspace.getConfiguration('minify')
			.minifyExistingOnSave) return;
		//check if there is a *.min.* file
		let n = doc.fileName.split('.');
		const ext = n.pop();
		n.push("min");
		n.push(ext);
		n = n.join(".");
		//see if there is a file, if there is, run min
		fs.exists(n, exists => exists ? doMinify(doc) : false);
		const isJS = (ext.toLowerCase() === "js");
		const isCSS = (ext.toLowerCase() === "css");
		if (isJS || isCSS) {
			//check if the directory has a min
			n = path.dirname(doc.fileName);
			n += ".min." + (isJS ? "js" : "css");
			fs.exists(n, exists => exists ? doMinifyDir(path.dirname(doc.fileName), isJS ? "js" : "css") : false);
		}
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;