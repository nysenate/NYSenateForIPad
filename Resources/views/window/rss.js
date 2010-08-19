Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;

var listUrl = Titanium.UI.currentWindow.rss;


var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

var cachedFeed = getCachedFile(listUrl);

if (cachedFeed)
{
	
	var doc = Titanium.XML.parseString(cachedFeed.read().text).documentElement;
	
	parseDoc(doc);
		
}

	
	var xhr = Ti.Network.createHTTPClient();
	
	xhr.onerror = function ()
	{
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
	}
	
	xhr.onload = function()
	{
		cacheFile(listUrl, this.responseText);
		
		var doc = Titanium.XML.parseString(this.responseText).documentElement;
	
		parseDoc(doc);
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
		
	};
	
	
	xhr.open("GET",listUrl);
	xhr.send();



function parseDoc(doc)
{

	var items = doc.getElementsByTagName("item");
	var x = 0;
	var c;
	var item;
	// create table view data object
	var data = [];

	Titanium.API.debug("viewing items: " + items.length);

	var greyBg = false;
		
	for (c = 0; c < items.length; c++)
	{
		try
		{
			item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			
			title = title.replace(/<.*?>/g, '').replace(/^\s*/, "").replace(/\s*$/, "").replace('\n','');


			Titanium.API.debug("parsing item: " + title);

			var summary = "Published " + item.getElementsByTagName("pubDate").item(0).text;
			
			var row = Ti.UI.createTableViewRow({height:100});
			
			row.hasChild = true;
			row.htmlTitle = title;
			
			row.url = item.getElementsByTagName("link").item(0).text;
			row.htmlview = item.getElementsByTagName("description").item(0).text;
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:0,
				height:80,
				font:{fontSize:24,fontFamily:'Helvetica Neue'},
				color:"#333333"
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:5,
				top:65,
				font:{fontSize:11,fontFamily:'Helvetica Neue'},
				color:"#777777"
			});
			row.add(labelSummary);
			
			
				greyBg = !greyBg;
			/*
			 //		var media = thumbnails.item(0).getAttribute("url");

			var img = Ti.UI.createImageView({
				url:media,
				left:5,
				height:60,
				width:60
			});
			row.add(img);
			*/
			
			data[x++] = row;
		}
		catch (E)
		{
			Titanium.API.debug("error parsing item: " + E);

			alert(E);
		}
	}
	
	var tableview = Titanium.UI.createTableView({data:data});
	Titanium.UI.currentWindow.add(tableview);
	
	tableview.addEventListener('click',function(e)
	{
		
		if (e.row.url.indexOf('nysenate.gov')==-1)
		{
			var htmlData =  e.row.htmlview;
			htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.row.htmlTitle + '</h2>' + htmlData + '</body></html>';
			showHTMLContent(e.row.htmlTitle,e.row.url,htmlData,win.detailView);
		}
		else
		{
			showNYSenateContent(e.row.htmlTitle,e.row.url,win.detailView);

		}
	});

}






