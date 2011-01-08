
var win = Titanium.UI.currentWindow;
var tableview;
// create table view data object
var data = [];

var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading videos...';
toolActInd.show();

var xhr = Ti.Network.createHTTPClient();


function doYouTubeSearch (channel, searchTerm)
{
	var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?alt=rss&author=' + escape(channel) + '&q=' + escape(searchTerm) + "&orderby=published&max-results=25&v=2";
	toolActInd.show();
	
	Ti.API.debug("youtube: " + searchUrl);
	
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
			
			var row = Ti.UI.createTableViewRow({height:80});
		
			row.url = link;
			row.guid = guid;
			row.videotitle = title;
			row.backgroundColor="#000000";
			row.color ="#ffffff";
			
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:105,
				top:10,
				height:40,
				font:{fontSize:16},
				color:"#ffffff"
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:105,
				top:45,
				font:{fontSize:12},
				color:"#ffffff"
			});
			row.add(labelSummary);
		
			var img = Ti.UI.createImageView({
				url:thumbnail,
				left:0,
				height:80,
				width:100
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
			data:data,
			backgroundColor:"#000000",
			separatorColor:"#000000",
			top:45
			});
			
			Titanium.UI.currentWindow.add(tableview);
			tableview.addEventListener('click',function(e)
			{
				
					playYouTube(e.row.videotitle,e.row.guid);
			
			});
			
			var btnSearch = Titanium.UI.createButton({
				title:'Search',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});


			var search = Titanium.UI.createSearchBar({
				barColor:'#000', 
				showCancel:false,
				hintText:'enter keywords to search',
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
				Titanium.API.info('search bar: you type ' + e.value + ' act val ' + search.value);

			});
			search.addEventListener('cancel', function(e)
			{
				Titanium.API.info('search bar cancel fired');
			    search.blur();
				//search.visible = false;
			
			});
			search.addEventListener('return', function(e)
			{
				var searchText = search.value;
				
			//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
			 	search.blur();
			//	search.visible = false;
				
				doYouTubeSearch ('NYSenate',searchText);
				
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
		}
	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'Video Search', message:'No videos were found for this search.'}).show();
	
	
	}
	
		toolActInd.hide();
};


doYouTubeSearch('NYSenate','');
