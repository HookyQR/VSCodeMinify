# minify for VS Code 

[![Build Status](https://api.travis-ci.org/HookyQR/VSCodeMinify.svg?branch=master)](https://travis-ci.org/HookyQR/VSCodeMinify)

Minify your js, css and html (or htm) files to save transmit bandwidth. Runs [minify](http://coderaiser.github.io/minify) on the open file: **F1** `Minify`.

Optionally runs minify on save when a matching minified file already exists. Enalbe in your user or workspace settings with:
```json
"minify.minifyExistingOnSave": true```

Embeded version of minify is v2.0.2.

## Changes:
### 0.0.3: 24 Dec 2015
* Removed suborinate module tests from package output
* Added icon

### 0.0.2: 17 Dec 2015
* Remove `json` from valid types.
* Indicate fail on empty file.
* Change report line to percentage.

