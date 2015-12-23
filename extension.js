var vscode = require( 'vscode' );
var minify = require( 'minify' );
var path = require( 'path' );
var fs = require( 'fs' );

//need to register the onSave function here

//register on activation
function activate( context ) {
	var doMinify = function( doc ) {
		if ( doc.isUntitled ) return;
		var better = doc.getText();
		var type = doc.fileName.split( '.' )
			.pop()
			.toLowerCase();
		var run = 'js';

		if ( type === 'htm' || type === 'html' ) run = 'html';
		else if ( type === 'css' ) run = 'css';
		else if ( type === 'js' ) run = 'js';
		else return;
		vscode.window.setStatusBarMessage( "Starting minify", 5000 );
		minify[ run ]( better, ( e, d ) => {
			if ( e ) {
				return vscode.window.setStatusBarMessage( "Minify failed (convert):" + e.message, 5000 );
			}
			//we save to the same name with the .min insert
			var outName = doc.fileName.slice( 0, -type.length ) + "min." + type;
			fs.writeFile( outName, d, "utf8", e => {
				if ( e ) {
					return vscode.window.setStatusBarMessage( "Minify failed (output):" + e.message, 5000 );
					//set a error here?
				}
				vscode.window.setStatusBarMessage( "Minified to " + ( ( d.length / better.length * 10000 ) | 0 ) / 100 +
					"% of original", 10000 );

			} );
		} );
	};

	var disposable = vscode.commands.registerCommand( 'HookyQR.minify', function() {
		var active = vscode.window.activeTextEditor;
		if ( active ) {
			var doc = active.document;
			if ( doc ) {
				if ( doc.length === 0 ) {
					return vscode.window.setStatusBarMessage( "Can't minify empty file", 5000 );
				}
				return doMinify( doc );
			}
		}
		vscode.window.setStatusBarMessage( "File must be saved before minify can run", 5000 );
	} );
	context.subscriptions.push( disposable );

	vscode.workspace.onDidSaveTextDocument( function( doc ) {
		//check if the user wants to do a minify here
		if ( !vscode.workspace.getConfiguration( 'minify' )
			.minifyExistingOnSave ) return;
		//check if there is a *.min.* file
		var n = doc.fileName.split( '.' );
		var ext = "min." + n.pop();
		n.push( ext );
		n = n.join( "." );
		//see if there is a file, if there is, run min
		if ( fs.existsSync( n ) ) doMinify( doc );
	} );
}
exports.activate = activate;
