// create table view data object

function makeLegTabs ()
{

var win = Titanium.UI.currentWindow;

var newWin;
var newTab;

var olTabGroup = Titanium.UI.createTabGroup({});
	
	


newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'bill',
 	navBarHidden:true,
 	detailView:win.detailView
});

newTab = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_document.png',
    title:'Bills',
    window:newWin
});

olTabGroup.addTab(newTab);

newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'meeting',
 	navBarHidden:true,
 	detailView:win.detailView
});
newTab  = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_users.png',
    title:'Meetings',
    window:newWin
});
olTabGroup.addTab(newTab);

newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'calendar',
 	navBarHidden:true,
 	detailView:win.detailView
});
newTab  = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_time.png',
    title:'Calendars',
    window:newWin
});
olTabGroup.addTab(newTab);

newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'transcript',
 	navBarHidden:true,
 	detailView:win.detailView
});
newTab  = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_comment_ok.png',
    title:'Transcripts',
    window:newWin
});
olTabGroup.addTab(newTab);

newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'action',
 	navBarHidden:true,
 	detailView:win.detailView
});
newTab  = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_auction.png',
    title:'Actions',
    window:newWin
    });

olTabGroup.addTab(newTab);

newWin = Titanium.UI.createWindow({  
	url:'olsearch-json.js',
 	oltype:'vote',
 	navBarHidden:true,
 	detailView:win.detailView
});
newTab  = Titanium.UI.createTab({  
    icon:'../../img/toolbar/icon_checkmark.png',
    title:'Votes',
    window:newWin
});
olTabGroup.addTab(newTab);


	// add table view to the window
win.add(olTabGroup);
	olTabGroup.open();

	var search = Titanium.UI.createSearchBar({
		barColor:'#000', 
		showCancel:true,
		height:43,
		top:0
	});



	
	var btnSearch = Titanium.UI.createButton({
		title:'Search',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	
	
	win.rightNavButton = btnSearch;
	
	btnSearch.addEventListener('click',function()
	{
		search.visible = true;
		tableview.top = 45;
	});



//
// SEARCH BAR EVENTS
//
search.addEventListener('change', function(e)
{
//	Titanium.API.info('search bar: you type ' + e.value + ' act val ' + search.value);
	
});
search.addEventListener('cancel', function(e)
{
	Titanium.API.info('search bar cancel fired');
    search.blur();
	search.visible = false;
	tableview.top = 0;
});
search.addEventListener('return', function(e)
{
//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
	
	var subWin = Titanium.UI.createWindow({
		url:'olsearch-json.js',
		title:'Search: ' + e.value,
 		detailView:win.detailView
	});
	
	subWin.barColor = DEFAULT_BAR_COLOR;
	subWin.olterm = e.value;

	win.detailView.open(subWin,{animated:true});
	
	
});

win.add(search);
search.visible = false;


}

makeLegTabs();
