Ti.include("../../inc/globals.js");

var OL_ITEM_BASE = 'http://open.nysenate.gov/api/1.0/mobile/';

var win = Titanium.UI.currentWindow;

var toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Searching legislative data...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

// create table view data object
var data =[];

var listUrl = "http://open.nysenate.gov/legislation/search/?";

if (Titanium.UI.currentWindow.oltype)
{
	var oltype = Titanium.UI.currentWindow.oltype;
	listUrl += "&type=" + oltype;
}
else
{
	listUrl += "&type=";

}

if (Titanium.UI.currentWindow.olterm)
{
	var olterm = Titanium.UI.currentWindow.olterm;
	listUrl += "&term=" + escape(olterm);
}
else
{
	listUrl += "&term=";

}

/*
var pageIdx = "1";
var pageSize = "50";

if (Titanium.UI.currentWindow.pageIdx)
{
	pageIdx = Titanium.UI.currentWindow.pageIdx + "";
}

if (Titanium.UI.currentWindow.pageSize)
{
	pageSize = Titanium.UI.currentWindow.pageSize + "";
}

listUrl += "&format=json&sort=when&sortOrder=true&pageIdx=" + pageIdx + "&pageSize=" + pageSize;
*/

listUrl += "&format=json&sort=when&sortOrder=true&pageIdx=1&pageSize=50";

var xhr = Ti.Network.createHTTPClient();
xhr.setTimeout(30000);

xhr.onerror = function (e)
{
	Titanium.API.debug("got xhr error: " + e);
	
	toolActInd.hide();
	win.setToolbar(null,{animated:true});
		
	//alert(e);
	Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();
	
};

xhr.onload = function()
{
	
	try
	{
		Titanium.API.debug("got xhr resp for: " + listUrl);
		
		var items = JSON.parse('{"results":' + this.responseText + '}').results;
		
		var c;
		var x = 0;

		var greyBg = false;
		
		if (items.length == 0)
		{
			var row = Ti.UI.createTableViewRow({height:80});
			row.hasDetail = false;
			row.title = "No results";
			row.text = "No results";
			data[x++] = row;
		}
		
		for (c in items)
		{
			var item = items[c];
			
			var	itemType = item.type;
			
			var title = '';
			
			if (itemType == "bill")
			{
				title += item.id;
			}
			else if (itemType == "action")
			{
				title += item.billno;
			}
			else
			{
				title += item.type.toUpperCase();
			}
			
			title += ": " + item.title;
			var itemId = item.id;
			var summary = item.summary;
		
			var media = "../../img/btn/" + itemType + ".png";
			
			var row = Ti.UI.createTableViewRow({height:100});
			row.hasDetail = true;
			row.className = 'olrow';
			
			
			if (itemType == "action" || itemType == "vote")
			{
				itemType = "bill";
				itemId = item.billno;
			}
				
			row.url = "http://open.nysenate.gov/legislation/api/1.0/mobile/" + itemType + "/" + escape(itemId);
			row.pageTitle = title;
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:0,
				height:25,
				font:{fontSize:20,fontFamily:'Helvetica Neue'},
				color:"#333333"
			});
			row.add(labelTitle);
			
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:5,
				top:20,
				height:50,
				font:{fontSize:18},
				color:"#777777"
				});
			row.add(labelSummary);
			
			
			data[x++] = row;
			
		}
		
		Titanium.API.debug("creating table view");

		var tableview = Titanium.UI.createTableView({
			data:data
		});
			
		Titanium.UI.currentWindow.add(tableview);
		
		tableview.addEventListener('click',function(e)
		{
			
			var wTitle = e.row.pageTitle;
			var wUrl = e.row.url;
			
			showWebModal(wTitle,wUrl,win.detailView);
		
		
		});
	}
	catch(E)
	{
		Titanium.API.debug("got xhr error processing response: " + E);
		
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();
	
	}
	
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
};


xhr.open("GET",listUrl);
xhr.send();




