
Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;
win.backgroundImage="../../img/bg/black.png";

var screenWidth = win.size.width;

var scrollView;

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
				backgroundColor:DEFAULT_BAR_COLOR,
				zIndex:10
			});	
			

			win.add(toolbar1);

var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading videos...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

var xhr = Ti.Network.createHTTPClient();


var currentChannel = 'nysenate';

function doYouTubeSearch (channel, searchTerm)
{
	
	if (scrollView)
	{
		win.remove(scrollView);
	
	}
	
	scrollView = Titanium.UI.createScrollView({
		contentWidth:656,
		contentHeight:'auto',
		top:0,
		left:0,
		showVerticalScrollIndicator:true,
		showHorizontalScrollIndicator:false,
		scrollType:'vertical'
	});

	win.add(scrollView);
	
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
			
		}
		
		var rTop = 30;
		var rLeft = 30;
		
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
			
			var row = Titanium.UI.createView({
			height:250,
			width:200,
			borderSize:0,
			top:rTop,
			left:rLeft
			});
			
			
			rLeft += 225;
			
			if ((rLeft+200) > screenWidth)
			{
				rLeft = 30;
				rTop += 275;
			}
			
			scrollView.add(row);
			
			
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:160,
				height:'auto',
				font:{fontSize:18},
				color:'#eeeeee'
			});
			row.add(labelTitle);
			
			
		
			var img = Ti.UI.createImageView({
				image:thumbnail,
				left:5,
				top:0,
				height:160,
				width:200,
				borderSize:1,
				borderColor:"#ccc"
			});
			
			img.guid = guid;
			img.videotitle = title;
			
			row.add(img);
			
		
			img.addEventListener('click',function(e)
			{
				
					playYouTube(e.source.videotitle,e.source.guid);
			
			});
			
		}
		
		
		
	
		
			var btnSearch = Titanium.UI.createButton({
				title:'Search',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});


			var search = Titanium.UI.createSearchBar({
				barColor:'#000', 
				showCancel:true,
				height:43,
				top:0
			});

			win.rightNavButton = btnSearch;

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
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'No videos were found for this search.'}).show();
	
	
	}
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
};


if (win.channel)
{
	doYouTubeSearch(win.channel,'');

}
else if (win.search)
{
	
	doYouTubeSearch(currentChannel,win.search);
	
}
else
{
	
	doYouTubeSearch(currentChannel,'');
	
}