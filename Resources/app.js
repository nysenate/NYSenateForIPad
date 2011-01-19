Ti.include("globals.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#fff');



// create table view data object
var tdata = [
	{title:'Senate Home',ilink:'views/home-ipad.js',leftImage:'img/tabs/bank.png',navBarHidden:true, className:'menuRow'},
	{title:'Senate Calendar',ilink:'views/today.js',leftImage:'img/tabs/clock.png',navBarHidden:false, className:'menuRow'},
	{title:'Senators',hasChild:true,mlink:'views/senators.js',leftImage:'img/tabs/man.png',navBarHidden:false, className:'menuRow'},
	{title:'Open Legislation',ilink:'views/legislation.js',leftImage:'img/tabs/database.png',navBarHidden:false, className:'menuRow'},
	{title:'Committee Activity',ilink:'views/committees.js',leftImage:'img/tabs/connections.png',navBarHidden:false, className:'menuRow'},
//	{title:'Newsroom',hasDetail:false, ilink:'views/homeslider.js',navBarHidden:false, leftImage:'img/tabs/newspaper.png', className:'menuRow'},

//	{title:'Official Blog',hasDetail:false, rss:'http://www.nysenate.gov/blog/feed',navBarHidden:false, leftImage:'img/tabs/newspaper.png', className:'menuRow'},

	/*{title:'Open Data Search',elink:'http://www.nysenate.gov/opendata',leftImage:'img/tabs/search.png',navBarHidden:false},*/
	{title:'Video Gallery',ilink:'views/videos-boxes.js',leftImage:'img/tabs/star.png',navBarHidden:false, className:'menuRow'},
	{title:'Issues & Initiatives',link:'http://www.nysenate.gov/issues-initiatives',leftImage:'img/tabs/newspaper.png',navBarHidden:false, className:'menuRow'},
/*	{title:'Daily Newsclips (Beta)', elink:'http://newsclips.senate.state.ny.us/names.jsp',navBarHidden:false, leftImage:'img/tabs/newspaper.png', className:'menuRow'},
*/
	{title:'@NYSenate', elink:'http://m.twitter.com/nysenate',leftImage:'img/tabs/speechbubble.png',navBarHidden:false, className:'menuRow'},
//	{title:'Senate Reports', link:'http://www.nysenate.gov/reports',navBarHidden:false,leftImage:'img/tabs/folder.png', className:'menuRow'},
	{title:'Contact the Senate', elink:'http://www.nysenate.gov/contact_form',leftImage:'img/tabs/newspaper.png',navBarHidden:false, className:'menuRow'},	
	{title:'---------------', className:'menuRow'},
	{title:'About the Senate', hasDetail:true, link:'http://www.nysenate.gov/about-us',navBarHidden:false, className:'menuRow'},
	{title:'Frequently Asked Questions', hasDetail:true, link:'http://www.nysenate.gov/frequently-asked-questions',navBarHidden:false, className:'menuRow'},
	{title:'FOIL Request', hasDetail:true, elink:'http://www.nysenate.gov/foil_request',navBarHidden:false, className:'menuRow'},
	{title:'Visiting the Capitol', hasDetail:true, link:'http://www.nysenate.gov/node/76',navBarHidden:false, className:'menuRow'},
/*	{title:'Capitol Map', hasDetail:true, elink:'http://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=ny+state+capitol&sll=37.0625,-95.677068&sspn=34.534108,75.498047&ie=UTF8&hq=ny+state+capitol&hnear=&ll=42.653783,-73.756628&spn=0.03131,0.10643&z=14&iwloc=A',navBarHidden:false},*/
	{title:'Senate Rules', hasDetail:true, link:'http://www.nysenate.gov/rules',navBarHidden:false, className:'menuRow'},
	{title:'Constitution', hasDetail:true, link:'http://www.nysenate.gov/constitution',navBarHidden:false, className:'menuRow'},
	{title:'State Seal', hasDetail:true, link:'http://www.nysenate.gov/state-seal',navBarHidden:false, className:'menuRow'},
	{title:'State History Timeline', hasDetail:true, link:'http://www.nysenate.gov/timeline',navBarHidden:false, className:'menuRow'},
	{title:'Office of the CIO', hasDetail:true, rss:'http://www.nysenate.gov/department/cio/content/feed',navBarHidden:false, className:'menuRow'},
	{title:'Visit NYSenate.gov', hasDetail:true, olink:'http://www.nysenate.gov/',navBarHidden:false, className:'menuRow'}		

];

// create table view
var tableViewOptions = {
	data:tdata
	};


var mvLabel = Titanium.UI.createLabel({
	text:'NYSenate Menu',
	height:50,
	width:'auto',
	textAlign:'center'
});

var masterViewToolbar = Titanium.UI.createToolbar({
left:0,
top:0,
height:45,
width:320,
items:[mvLabel],
	
});

var masterViewTable = Titanium.UI.createTableView(tableViewOptions);

var winMasterView;

winMasterView = Titanium.UI.createWindow({  
	title:'Senate Menu',
	barColor:DEFAULT_BAR_COLOR,
});

winMasterView.add(masterViewTable);

var masterView = Ti.UI.iPhone.createNavigationGroup({
window:winMasterView
});

var lastClickedIndex = -1;
var lastClickedRow;

// create table view event listener
masterViewTable.addEventListener('click', function(e)
{

/*
	if (lastClickedIndex == e.index)
		return;
	else
		lastClickedIndex = e.index;
*/	
		
	
	if (lastClickedRow)
	{
		//lastClickedRow.backgroundColor = "transparent";
				e.row.backgroundImage = "";
		lastClickedRow.backgroundColor = "#ffffff";
		lastClickedRow.backgroundImage = "";
		lastClickedRow.color = "#000000";
	
	}		
	
	lastClickedRow = e.row;
	
	e.row.backgroundColor = "transparent";
	e.row.backgroundImage = "img/listonbg.jpg";
	e.row.color = "#ffffff";

	
	if (tdata[e.index].ilink)
	{
		//Ti.API.debug("opening ilink: " + tdata[e.index].ilink);
		
		var subWin = Titanium.UI.createWindow({
				url:e.rowData.ilink,
				title:e.rowData.title,
				barColor:DEFAULT_BAR_COLOR,
				detailView:nav
		});

		nav.open(subWin,{animated:true});
		
	}
	else if (tdata[e.index].plink)
	{
		//Ti.API.debug("opening plink: " + tdata[e.index].plink);
	
			var subWin = Titanium.UI.createWindow({
				url:e.rowData.plink,
				title:e.rowData.title,
				barColor:DEFAULT_BAR_COLOR,
				detailView:nav
			});
		
			showPopup(subWin,600,400);
		
	
	}
	else if (tdata[e.index].mlink)
	{
	
		//Ti.API.debug("opening mlink: " + tdata[e.index].mlink);

		var subWin = Titanium.UI.createWindow({
				url:e.rowData.mlink,
				title:e.rowData.title,
				barColor:DEFAULT_BAR_COLOR,
				detailView:nav
			});
			
		masterView.open(subWin,{animated:true});
	}
	else if (tdata[e.index].elink)
	{
	
		//Ti.API.debug("opening elink: " + tdata[e.index].elink);

		showWebModal(tdata[e.index].title,tdata[e.index].elink, nav);
	}
	else if (tdata[e.index].link)
	{
	
	//Ti.API.debug("opening link: " + tdata[e.index].link);

		showNYSenateContent(tdata[e.index].title,tdata[e.index].link, nav);
	}
	else if (tdata[e.index].olink)
	{
	//	Ti.API.debug("opening olink: " + tdata[e.index].olink);

		Titanium.Platform.openURL(tdata[e.index].olink);
	}
	else if (tdata[e.index].rss)
	{
	
	//	Ti.API.debug("opening rss: " + tdata[e.index].rss);


		var subWin = Titanium.UI.createWindow({
				url:'inc/rss.js',
				title:tdata[e.index].title,
				barColor:DEFAULT_BAR_COLOR,
				rss:tdata[e.index].rss,
				detailView:nav
			});
		
		
		nav.open(subWin,{animated:true});
	}
	
	
	
});


//
// create base UI tab and root window
//
var winHome;

winHome = Titanium.UI.createWindow({  
	title:'Home',
	url:'views/home-ipad.js',
 	navBarHidden:false,
 	barColor:DEFAULT_BAR_COLOR
});

var nav = Ti.UI.iPhone.createNavigationGroup({
   window: winHome,
   backgroundColor: '#ffffff'
});

winHome.detailView = nav;

var splitwin = Ti.UI.iPad.createSplitWindow({
    detailView:nav,
    masterView:masterView
});

splitwin.open();
 
splitwin.addEventListener('visible',function(e)
{
	
	
    if (e.view == 'detail')
    {
    
    	
        e.button.title = "NYSenate Menu";
        winHome.leftNavButton = e.button;
        
      
    }
    else if (e.view == 'master')
    {
		
        winHome.leftNavButton = null;
        
        Titanium.API.info("MASTER: " +e.popover);

      
    }
    
    
});



