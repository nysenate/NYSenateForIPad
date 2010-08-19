Ti.include("../../inc/globals.js");

//
// SETUP WINDOW STYLES
//
Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;
var win = Ti.UI.currentWindow;

	
var homeWebView = Ti.UI.createWebView();
homeWebView.scalesPageToFit = true;
		
win.add(homeWebView);

		var toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Loading...';
		
		homeWebView.addEventListener('beforeload',function(e)
		{
			Ti.API.debug("webview beforeload: "+e.url);
			
			win.setToolbar([toolActInd],{animated:true});
			toolActInd.show();

		});
			
		homeWebView.addEventListener('load',function(e)
		{
			Ti.API.debug("webview loaded: "+e.url);
			
			toolActInd.hide();
			win.setToolbar(null,{animated:true});

		});
		
homeWebView.url = "http://nysenate.gov";