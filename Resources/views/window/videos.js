
Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;
var tableview;
// create table view data object

var currentChannel = 'nysenate';

var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading videos...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

var xhr = Ti.Network.createHTTPClient();


function doYouTubeSearch (channel, searchTerm)
{
	
	if (searchTerm != '')
	{
		win.title = 'Videos: ' + searchTerm;
	}
	
	var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?alt=rss&author=' + escape(channel) + '&q=' + escape(searchTerm) + "&orderby=published&max-results=50&v=2";
	win.setToolbar([toolActInd],{animated:true});
	toolActInd.show();
	
	xhr.open("GET",searchUrl);
	xhr.send();
}

xhr.onload = function()
{
	try
	{
	var data = [];
	
			var doc;
	
	Titanium.API.debug("got youtube video response");
	
		if (!this.responseXML)
		{
			Titanium.API.debug("got plaintext");
	
			doc = Titanium.XML.parseString(this.responseText).documentElement;
		}
		else
		{
		
			Titanium.API.debug("got XML");
			doc = this.responseXML.documentElement;
		}

		var items = doc.getElementsByTagName("item");
		var x = 0;
		var c;
		
		if (items.length == 0)
		{
			var row = Ti.UI.createTableViewRow({height:80});
			row.hasDetail = false;
			row.title = "No matching results";
			row.text = "No matching results";
			data[x++] = row;
		}
		
		
		for (c=0;c<items.length;c++)
		{
			var item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			
			var summary = "";
			if (item.getElementsByTagName("pubDate"))
			{
				summary = item.getElementsByTagName("pubDate").item(0).text;
				}
				
			var link = "";
			
			if (item.getElementsByTagName("link"))
			{
				link = item.getElementsByTagName("link").item(0).text;	
			}
			
			var guid = link.substring(link.indexOf("?v=")+3);
			guid = guid.substring(0,guid.indexOf("&"));
			
			var thumbnail = "http://i.ytimg.com/vi/" + guid + "/2.jpg";
			
			var row = Ti.UI.createTableViewRow({height:160});
		
			row.url = link;
			row.guid = guid;
			row.videotitle = title;
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:205,
				top:10,
				height:100,
				font:{fontSize:22}
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:205,
				top:45,
				font:{fontSize:14}
			});
			row.add(labelSummary);
		
			var img = Ti.UI.createImageView({
				image:thumbnail,
				left:0,
				height:160,
				width:200
			});
			row.add(img);
			
			data[x++] = row;
			
		}
		
		if (tableview)
		{
			tableview.setData(data);
		}
		else
		{
			tableview = Titanium.UI.createTableView({
			data:data
			});
			
			Titanium.UI.currentWindow.add(tableview);
			
			tableview.addEventListener('click',function(e)
			{
				
					playYouTube(e.row.videotitle,e.row.guid);
			
			});
			
			
			var buttonObjects = [
				{title:'Short Clips', enabled:false},
				{title:'Full Sessions & Events', enabled:true}
			];
			
				
			var bb1 = Titanium.UI.createButtonBar({
				labels:buttonObjects,
				style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
				height:35,
				width:'auto'
			});
			
			bb1.addEventListener('click', function(e)
			{
				if (e.index == 0)
				{
					win.title = 'YouTube: Short Clips';
					currentChannel = 'nysenate';		
					doYouTubeSearch (currentChannel, '');
				
					buttonObjects[0].enabled = false;
					buttonObjects[1].enabled = true;
					
				}
				else if (e.index == 1)
				{
					win.title = 'YouTube: Full Sessions & Events';
					currentChannel = 'nysenateuncut';
					doYouTubeSearch (currentChannel, '');
				
				
					buttonObjects[0].enabled = true;
					buttonObjects[1].enabled = false;
				}
				
				bb1.labels = buttonObjects;
			
			});
			
			
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
			
			// create and add toolbar
			var toolbar1 = Titanium.UI.createToolbar({
				items:[flexSpace,bb1,flexSpace],
				bottom:0,
				borderTop:true,
				borderBottom:false,
				backgroundColor:DEFAULT_BAR_COLOR
			});	
			

			Titanium.UI.currentWindow.add(toolbar1);

			
			var btnSearch = Titanium.UI.createButton({
				title:'Search Videos',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});


			var search = Titanium.UI.createSearchBar({
				barColor:'#000', 
				showCancel:true,
				height:43,
				top:0
			});

			Titanium.UI.currentWindow.rightNavButton = btnSearch;

			btnSearch.addEventListener('click',function()
			{
				search.visible = true;
			
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
			
			});
			search.addEventListener('return', function(e)
			{
			//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
			 	search.blur();
				search.visible = false;
				
				doYouTubeSearch (currentChannel,e.value);
				
			});
			search.addEventListener('focus', function(e)
			{
			   	Titanium.API.info('search bar: focus received');
			});
			search.addEventListener('blur', function(e)
			{
			   	Titanium.API.info('search bar:blur received');
			});


			Titanium.UI.currentWindow.add(search);
			search.visible = false;
		}
	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'No videos were found for this search.'}).show();
	
	
	}
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
};


if (Titanium.UI.currentWindow.channel)
{
	doYouTubeSearch(Titanium.UI.currentWindow.channel,'');

}
else if (Titanium.UI.currentWindow.search)
{
	
	doYouTubeSearch(currentChannel,Titanium.UI.currentWindow.search);
	
}
else
{
	
	doYouTubeSearch(currentChannel,'');
	
}