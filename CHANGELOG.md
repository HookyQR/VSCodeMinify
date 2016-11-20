### 0.3.0: 20 Nov 2016
* Update dependencies
  * [uglify-js](http://lisperator.net/uglifyjs) v2.7.4
  * [clean-css](https://github.com/jakubpawlowicz/clean-css) v3.4.21
  * [html-minifier](http://kangax.github.io/html-minifier/) v3.2.2
* Correct handling of min.js settings. This includes passing them to html-minifier correctly.
* Fix default settings.
* Add change log.


### 0.1.1 >> 0.2.5: 14 Oct 2016
* Update dependencies.
  * [uglify-js](http://lisperator.net/uglifyjs) v2.7.3
  * [clean-css](https://github.com/jakubpawlowicz/clean-css) v3.4.20
  * [html-minifier](http://kangax.github.io/html-minifier/) v3.1.0
* force ignoreCustomFragments existance so html-minifier works.
* Fix dependencies tree failure.
* Fixed use of and enforcement of defaults.
* Now includes the inner components of minify directly.
* Allow preferences for all three minifiers.
* Allow minifiying whole directories for css and js.

### 0.0.1 >> 0.0.3: 24 Dec 2015
* Removed suborinate module tests from package output
* Added icon
* Remove `json` from valid types.
* Indicate fail on empty file.
* Change report line to percentage.