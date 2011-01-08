Ti.include("../globals.js");

// create table view data object
var tdata = [
	{title:'Current Initiatives',hasDetail:true, link:'http://www.nysenate.gov/issues-initiatives'},
	{title:'Official Senate Blog',hasDetail:true, rss:'http://www.nysenate.gov/blog/feed'},
	{title:'Daily Newsclips (Beta)',hasDetail:true, elink:'http://newsclips.senate.state.ny.us/names.jsp'},
	{title:'About the Senate', hasDetail:true, link:'http://www.nysenate.gov/about-us'},
	{title:'Frequently Asked Questions', hasDetail:true, link:'http://www.nysenate.gov/frequently-asked-questions'},
	{title:'FOIL Request', hasDetail:true, link:'http://www.nysenate.gov/foil_request'},
	{title:'Senate Reports', hasDetail:true, link:'http://www.nysenate.gov/reports'},
	{title:'Visiting the Capitol', hasDetail:true, link:'http://www.nysenate.gov/node/76'},
	{title:'Senate Rules', hasDetail:true, link:'http://www.nysenate.gov/rules'},
	{title:'Constitution', hasDetail:true, link:'http://www.nysenate.gov/constitution'},
	{title:'State Seal', hasDetail:true, link:'http://www.nysenate.gov/state-seal'},
	{title:'State History Timeline', hasDetail:true, link:'http://www.nysenate.gov/timeline'},
	{title:'Office of the CIO', hasDetail:true, rss:'http://www.nysenate.gov/department/cio/content/feed'}	
];

// create table view
var tableViewOptions = {
		data:tdata
	};


var tableview = Titanium.UI.createTableView(tableViewOptions);

var subWin;
var lastClickedRow;

// create table view event listener
tableview.addEventListener('click', function(e)
{
	
		if (lastClickedRow)
			lastClickedRow.backgroundColor = "transparent";
			
		
		e.row.backgroundColor = "#aaaaaa";
		lastClickedRow = e.row;
			
			
	if (e.rowData.ilink)
	{
			subWin = Titanium.UI.createWindow({
				url:e.rowData.ilink,
				title:e.rowData.title
			});

			subWin.barColor = DEFAULT_BAR_COLOR;
			win.open(subWin,{animated:true});
	}
	if (e.rowData.elink)
	{
		showWebModal(e.rowData.title,e.rowData.elink);
	}
	else if (e.rowData.link)
	{
		showNYSenateContent(e.rowData.title,e.rowData.link);
	}
	else if (e.rowData.rss)
	{
		subWin = Titanium.UI.createWindow({
			url:'rss.js',
			title:e.rowData.title
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.rss = e.rowData.rss;

		Titanium.UI.detailView.open(subWin,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
