Ti.include("../globals.js");

var win = Ti.UI.currentWindow;


var	senatorView = Titanium.UI.createTableView({
});

Titanium.UI.currentWindow.add(senatorView);

var c;
var row;


row = Ti.UI.createTableViewRow({height:90});
row.title = 'Find Your Senator';
row.leftImage = '../img/tabs/search.png';
row.ilink = 'findsenator.js';

senatorView.appendRow(row);

row = Ti.UI.createTableViewRow({height:90});
row.title = 'Districts Map';
row.leftImage = '../img/tabs/world.png';
row.link = 'http://www.nysenate.gov/districts/map';
senatorView.appendRow(row);

/*
row = Ti.UI.createTableViewRow({height:90});
row.title = 'Senate Leadership';
row.leftImage = '../img/tabs/connections.png';
row.link = 'http://www.nysenate.gov/senate-leadership-list';
senatorView.appendRow(row);
*/



var SENATOR_THUMB_BASE = "http://nysenate.gov/files/imagecache/senator_teaser/profile-pictures/";
var SENATOR_FULL_BASE = "http://nysenate.gov/files/imagecache/teaser_featured_image/profile-pictures/";

var senatorItems = [];
var senatorRows = [];

var rowHeight = 40;

var senatorJsonUrl = "http://open.nysenate.gov/legislation/senators.json";

var xhr = Ti.Network.createHTTPClient();
xhr.setTimeout(30000);

var toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading Senators...';

var lastClickedRow;

	// click listener - when row is clicked
	senatorView.addEventListener('click',function(e)
	{


		if (e.row.link)
		{
				showNYSenateContent(e.row.title,e.row.link,win.detailView);

		}
		else if (e.row.ilink)
		{
			var subWin = Titanium.UI.createWindow({
				url:e.row.ilink,
				title:e.row.title,
				navBarHidden:false,
				detailView:win.detailView
			});

			subWin.barColor = DEFAULT_BAR_COLOR;
			
		
			win.detailView.open(subWin,{animated:true});
		}
		else
		{
			if (lastClickedRow)
				lastClickedRow.backgroundColor = "transparent";
				
			
			e.row.backgroundColor = "#aaaaaa";
			lastClickedRow = e.row;
			
			var senIndex = e.index - 2;
			
			var newWin = Titanium.UI.createWindow({
				url:'senator.js',
				title:senatorItems[senIndex].senator.name,
				nid:senatorItems[senIndex].senator.key,
				senatorUrl:senatorItems[senIndex].senator.url,
				senatorName:senatorItems[senIndex].senator.name,
				senatorImage:senatorItems[senIndex].senator.imageUrlLarge,
				senatorKey:senatorItems[senIndex].senator.name,
				senatorDistrict:senatorItems[senIndex].senator.district,
				backgroundImage:'../img/bg/wood.jpg',
				detailView:win.detailView
			});

		
			win.detailView.open(newWin,{animated:true});
		}
	
	});

	/*
	

	// click listener - when image is clicked
	senatorView.addEventListener('click',function(e)
	{
		Titanium.API.info("image clicked: "+e.index + ": nodeid=" + senatorItems[e.index].nid);

		var newWin = Titanium.UI.createWindow({
			url:'senator.js',
			title:senatorItems[e.index].senator.name,
			nid:senatorItems[e.index].senator.key,
			senatorUrl:senatorItems[e.index].senator.url,
			senatorName:senatorItems[e.index].senator.name,
			senatorImage:senatorItems[e.index].senator.imageUrlLarge,
			senatorKey:senatorItems[e.index].senator.name,
			senatorDistrict:senatorItems[e.index].senator.district,
			backgroundImage:'../img/bg/wood.jpg'
		
		});

		Titanium.UI.currentTab.open(newWin,{animated:true});
	
	});*/

	

Titanium.UI.currentWindow.add(senatorView);


	

function loadSenators()
{
	

	if (senatorItems && senatorItems.length > 0)
	{
		//Ti.API.debug("got cached senator items");
		
			senatorRows = [];
			
			for (i = 0; i < senatorItems.length; i++)
			{
				senatorRows[i] = loadSenatorRow (i, senatorItems[i].senator.name, senatorItems[i].senator.district, senatorItems[i].senator.imageUrl);
						senatorView.appendRow(senatorRows[i]);
			}
			
	}
	else
	{
		Ti.API.debug("loading senators...");
	
		
		xhr.onerror = function (e)
		{
			Titanium.API.debug("got xhr error: " + e);
			
			toolActInd.hide();
				
			//alert(e);
			Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the senator data. Please try again later.'}).show();
			
		};
		
		xhr.onload = function()
		{
		//	Titanium.API.debug("got resp: "  +this.responseText);
			toolActInd.hide();

			cacheFile("senatorsJson",this.responseText, function() {});

			parseSenatorResponse(this.responseText);
		}
		
		
		toolActInd.show();

		xhr.open("GET",senatorJsonUrl);
		xhr.send();

	}
}

function parseSenatorResponse (responseText)
{

	senatorItems = JSON.parse('{"data":' + responseText + '}').data;
		
	//Titanium.API.debug("got senator items: " + senatorItems.length);

	
	for (i = 0; i < senatorItems.length; i++)
	 {
	 
	 	var imageUrl = senatorItems[i].senator.imageUrl;
	 	
	 	var idx = imageUrl.lastIndexOf("/");
	 	imageUrl = imageUrl.substring(idx+1);
	 	senatorItems[i].senator.imageFileName = imageUrl;
	 	senatorItems[i].senator.imageUrl = SENATOR_THUMB_BASE + escape(imageUrl);
		senatorItems[i].senator.imageUrlLarge = SENATOR_FULL_BASE + escape(imageUrl);

		senatorItems[i].senator.district = senatorItems[i].senator.district.split(' ')[3];
	
		
	//	Ti.API.debug("senator " + i + ": " + 	senatorItems[i].senator.name);
		senatorRows[i] = loadSenatorRow (i, senatorItems[i].senator.name, senatorItems[i].senator.district, "../img/senators/" + escape(senatorItems[i].senator.imageFileName));
								senatorView.appendRow(senatorRows[i]);

		
	}


}

function loadSenatorRow (rowIdx, name, district, thumbnail)
{
	
	var rowHeight = 70;
			
	var row = Ti.UI.createTableViewRow({height:rowHeight});
	
	var labelTitle = Ti.UI.createLabel({
		text:name,
		left:60,
		top:10,
		height:25,
		color:"#000000",
		font:{fontSize:18}
	});
	row.add(labelTitle);
	
	if (district.length > 0)
	{
		var labelSummary = Ti.UI.createLabel({
			text:"District " + district,
			left:60,
			top:35,
			color:"#333333",
			font:{fontSize:14}
		});
		row.add(labelSummary);
	}
	
	/*
	var cachedImage = null;//getCachedFile(thumbnail);
				
	if (!cachedImage)
	{
		Ti.API.debug("could not find cached file: " + thumbnail);
		
		cacheFile(thumbnail,null, function doit(fileUrl, savedFile)
		{
			Ti.API.debug("got cache file callback for: " + fileUrl);

			var img = Ti.UI.createImageView({
				url:savedFile.read(),
				left:0,
				width:55,
				height:rowHeight
			});
		
			row.add(img);
			senatorView.updateRow(i,row);
			
		});
	}
	else
	{*/
		//Ti.API.debug("loading image: " + thumbnail);
		var senatorImg = Ti.UI.createImageView({
			image:thumbnail,
			left:0,
			width:55,
			height:rowHeight
		});
		
		row.add(senatorImg);
	//}
		
	row.hasDetail = true;
	
	
	return row;

}
	
	
loadSenators();

/*
{"districtUrl":"http://www.nysenate.gov/district/20",
"senator":{
	"offices":[{"id":1,"zip":"","phone":"(518) 455-2431","lon":42.652855,"fax":"(518) 426-6856","officeName":"Albany Office","street":"188 State Street ","state":"NY","contact":"eadams@senate.state.ny.us","lat":-73.759091,"city":"Albany"},
	{"id":2,"zip":"","phone":"(718) 284-4700","lon":40.659736,"fax":"(718) 282-3585","officeName":"District Office","street":"572 Flatbush Avenue","state":"NY","contact":"eadams@senate.state.ny.us","lat":-73.960689,"city":"Brooklyn"}],
	"imageUrl":"http://www.nysenate.gov/files/imagecache/senator_teaser/profile-pictures/(02-04-09) Adams-HS-059NEW HEADSHOT_1.JPG",
	"social":{"flickr":"","twitter":"http://twitter.com/NYSSenAdams","faceBook":"http://www.facebook.com/pages/New-York-State-Senator-Eric-Adams/80559174013",
	"youtube":"","rss":"http://www.nysenate.gov/senator/eric-adams/content/feed",
	"contact":"eadams@senate.state.ny.us"},
	"name":"Eric Adams","district":"State Senate District 20",
	"contact":"eadams@senate.state.ny.us","key":"adams","url":"http://www.nysenate.gov/senator/eric-adams"},
	"district":"State Senate District 20"}
*/


	

