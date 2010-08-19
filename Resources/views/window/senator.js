Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;

win.backgroundImage = "../../img/bg/wood.jpg";

var senatorName = win.senatorName;
var senatorImage = win.senatorImage;
var senatorKey = win.senatorKey;
var senatorDistrict = win.senatorDistrict;
var twitter = win.twitter;
var facebook = win.facebook;
var youtube = win.youtube;

var senatorTitleText = "Senator " + senatorName + "\n" + "District " + senatorDistrict;


var senSearchKey = senatorName;

senSearchKey = senSearchKey.replace("Jr.","");
senSearchKey = senSearchKey.replace("Jr","");
senSearchKey = senSearchKey.replace("Sr.","");
senSearchKey = senSearchKey.replace("Sr","");
senSearchKey = senSearchKey.replace(".","");

var legSearchKey = senatorKey;
legSearchKey = legSearchKey.replace("-jr","");
legSearchKey = legSearchKey.replace("-sr","");
legSearchKey = legSearchKey.substring(legSearchKey.lastIndexOf("-")+1);


var imgSenator = Titanium.UI.createImageView({
	image:senatorImage,
	width:125,
	height:185,
	top:10,
	left:10,
	visible:true,
	backgroundColor:"#ffffff",
	borderColor:"#ffffff",
	borderWidth:5
});

win.add(imgSenator);

var messageLabel = Titanium.UI.createLabel({
	color:'#fff',
	text:senatorTitleText,
	left:150,
	width:'auto',
	top:20,
	height:'auto',
        font:{fontSize:36}	
});

win.add(messageLabel);

// create table view data object
var tdata = [
	{title:'Contact Information',hasChild:true,link:"http://www.nysenate.gov/senator/" + senatorKey + "/contact"},
	{title:'District Map',hasChild:true,link:"http://www.nysenate.gov/district/" + senatorDistrict},
	{title:"Latest News & Updates",hasChild:true, rss:"http://www.nysenate.gov/senator/" + senatorKey + "/content/feed"},
	{title:'Sponsored Bills',hasChild:true,olterm:"sponsor:"+legSearchKey + " AND otype:bill AND (oid:S* or oid:A*)"},
	{title:'Chaired Meetings',hasChild:true,olterm:"chair:"+legSearchKey + " AND otype:meeting"},
	{title:'Legislative Activity',hasChild:true,olterm:legSearchKey},
	{title:'Biography',hasChild:true,link:"http://www.nysenate.gov/senator/" + senatorKey + "/bio"},
	{title:'View Senator Website',hasChild:true,olink:"http://www.nysenate.gov/senator/" + senatorKey}
	
	/*
	{title:'Senate YouTube Clips',hasChild:true,vsearch:senSearchKey}
	*/
];

if (twitter && twitter != "null")
{
var row = new Object();
row.title = "Twitter Feed";
row.hasChild = true;
row.link = twitter;
tdata[tdata.length] = row;

	
}


if (facebook && facebook != "null")
{

var row = new Object();
row.title = "Facebook Page";
row.hasChild = true;
row.link = facebook;
tdata[tdata.length] = row;



}


// create table view
var tableViewOptions = {
		data:tdata,
	top:250,
	left:0,
	borderSize:0
	};




var tableview = Titanium.UI.createTableView(tableViewOptions);

var subWin;

// create table view event listener
tableview.addEventListener('click', function(e)
{
	
	if (e.rowData.ilink)
	{
			subWin = Titanium.UI.createWindow({
				url:e.rowData.ilink,
				title:e.rowData.title
			});

			subWin.barColor = DEFAULT_BAR_COLOR;
			win.detailView.open(subWin,{animated:true});
	}
	else if (e.rowData.elink)
	{
		showWebModal(e.rowData.title,e.rowData.elink,win.detailView);
	}
	else if (e.rowData.link)
	{
		showNYSenateContent(e.rowData.title,e.rowData.link,win.detailView);
	}
	else if (e.rowData.olink)
		{
			Ti.API.debug("opening olink: " + tdata[e.index].olink);

			Titanium.Platform.openURL(tdata[e.index].olink);
		}
	else if (e.rowData.olterm)
	{
		subWin = Titanium.UI.createWindow({
			url:'olsearch-json.js',
			title:e.rowData.title,
			olterm:e.rowData.olterm,
			detailView:win.detailView
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		win.detailView.open(subWin,{animated:true});
	}
	else if (e.rowData.vsearch)
	{
		subWin = Titanium.UI.createWindow({
			url:'videos-boxes.js',
			title:e.rowData.title,
			search:e.rowData.vsearch,
			detail:win.detailView
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	
		win.detailView.open(subWin,{animated:true});
	}
	else if (e.rowData.rss)
	{
		subWin = Titanium.UI.createWindow({
			url:'rss.js',
			title:e.rowData.title,
			rss:e.rowData.rss,
			detailView:win.detailView
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		win.detailView.open(subWin,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
