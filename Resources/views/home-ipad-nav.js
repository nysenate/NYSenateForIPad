Ti.include("../globals.js");


var wins = [];
var tabs = [];

// create tab group
var tabGroup = Titanium.UI.createTabGroup({
		backgroundColor:DEFAULT_BAR_COLOR
	});
	
	
wins[0] = Titanium.UI.createWindow({  
	url:'home-ipad.js',
 	navBarHidden:true
});

tabs[0] = Titanium.UI.createTab({  
    icon:'../img/toolbar/icon_document.png',
    title:'News',
    window:wins[0]
});


wins[1] = Titanium.UI.createWindow({  
	url:'today.js',
 	navBarHidden:false
});
tabs[1]  = Titanium.UI.createTab({  
    icon:'../img/toolbar/icon_time.png',
    title:'This Month',
    window:wins[1]
});

wins[2] = Titanium.UI.createWindow({  
	url:'videos-boxes.js',
 	navBarHidden:false
});
tabs[2]  = Titanium.UI.createTab({  
    icon:'../img/tabs/star.png',
    title:'Recent Video',
    window:wins[2]
});



for (i = 0; i < tabs.length; i++)
	tabGroup.addTab(tabs[i]);



	// add table view to the window
	Titanium.UI.currentWindow.add(tabGroup);
	
	
// open tab group with a transition animation
tabGroup.open();

	

