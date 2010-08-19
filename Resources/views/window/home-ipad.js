Ti.include("../../inc/globals.js");

//variables
var win = Ti.UI.currentWindow;
var screenWidth = win.size.width;
var topViewHeight = 430;
var splashScreen = '../../Default-Portrait.png';
var IMAGE_RESIZER = "http://nysenatemobile.appspot.com/servlet/ImageResizer?url=";

var scrollViewTopHeight = 400;
var detailView = win.detailView;

var xhrRSS = Ti.Network.createHTTPClient();
var xhrCalendar = Ti.Network.createHTTPClient();

var topViews = [];
var midViews = [];
			
var PRIMARY_RSS_FEED = "http://www.nysenate.gov/rss";
var CALENDAR_RSS_FEED = "http://www.nysenate.gov/calendar/rss/2010";
var PRIMARY_TWITTER_FEED = "http://twitter.com/statuses/user_timeline/20419776.rss";

Titanium.API.info("screenwidth: " + screenWidth);


var homeItems;

win.backgroundImage = '../../img/bg/nyss_bg.png';
//win.backgroundColor = '#ffffff';

/*
var cover = Titanium.UI.createView({
  backgroundImage:splashScreen,
	zIndex:5
});
win.add(cover);
*/

var senHeader = Titanium.UI.createImageView({
				image:'../../img/header/nyss_header_bg1.jpg',
				top:0,
				left:0,
				width:900,
				height:94,
				zindex:1
			});

win.add(senHeader);

var senLogo = Titanium.UI.createImageView({
				image:'../../img/header/nyss_logo.png',
				top:15,
				left:15,
				width:259,
				height:56,
				zindex:2
			});

win.add(senLogo);

var scrollViewHeader = Titanium.UI.createScrollableView({
			showPagingControl:false,
			clipViews:true,
			top:10,
			right:15,
			height:70,
			width:310,
			layout:'horizontal',
			backgroundColor:"#ffffff",
			opacity:.7
		});

win.add(scrollViewHeader);


var scrollViewBottom = Titanium.UI.createScrollView({
			top:779,
			left:0,
			height:200,
			backgroundColor:"#000000",
			width:screenWidth,
			contentWidth:'auto',
    contentHeight:196,
    showVerticalScrollIndicator:false,
    showHorizontalScrollIndicator:true
		});
win.add(scrollViewBottom);


var xhr = Ti.Network.createHTTPClient();

xhr.onreadystatechange = function () {};

function showTop ()
{
	
	var scrollViewTop = Titanium.UI.createScrollableView({
				views:topViews,
				
			showPagingControl:true,
			 pagingControlColor:'#999999',
   				 pagingControlHeight:30,
				top:125,
				left:0,
				height:scrollViewTopHeight,
				width:screenWidth,
				layout:'horizontal'
			});
	
	win.add(scrollViewTop);

	var labelTop = Ti.UI.createLabel({
					text:"NEWS FROM THE SENATE",
					left:15,
					top:93,
					height:'auto',
					font:{fontSize:24,fontFamily:'Helvetica Neue'},
					zindex:5,
					color:'#777777'
				});
	win.add(labelTop);
	


}

function showVideos ()
{
	Ti.API.debug("showing mid: views=" + midViews.length);
	
	var scrollViewMid = Titanium.UI.createScrollableView({
			views:midViews,
			showPagingControl:true,
			 pagingControlColor:'#000000',
   			pagingControlHeight:30,
			top:521,
			left:0,
			height:270,
			width:screenWidth,
			backgroundImage:'../../img/bg/black.png',
			layout:'horizontal'
		});
	
	win.add(scrollViewMid);
	
	
	var labelMid = Ti.UI.createLabel({
					text:"LATEST VIDEOS",
					left:13,
					top:531,
					height:'auto',
					font:{fontSize:24,fontFamily:'Helvetica Neue'},
					zindex:5,
					color:'#aaaaaa'
				});
	win.add(labelMid);
	
}

function checkOnline (onlineState)
{
	
	
	if (!onlineState)
	{
		var alertOff = Titanium.UI.createAlertDialog({
			title:'No Network',
			message:'You must be online to access the NY Senate site',
			 buttonNames: ['OK']
			
		});
		
		alertOff.show();
	}
	else
	{
		//no worries!
		
	}
}


Ti.Network.addEventListener('change',function(e) {
	
	checkOnline (e.online);
	
});

xhr.onerror = function ()
{
		var alertOff = Titanium.UI.createAlertDialog({
			title:'Network Error',
			message:'Unable to connect to NYSenate.gov.\nPlease try again later.',
			 buttonNames: ['OK']
			
		});
		
		alertOff.show();
	
};

function loadFeatures (featuresJSON)
{		
		
		
		
		Titanium.API.info("got features data");

		homeItems = JSON.parse(featuresJSON).nodes;

		var BASEPATH = "http://nysenate.gov/";
		
		
		
		//var sViews = [homeItems.length];
		var ciLeft = 0;
		
		for (var c=0;c<homeItems.length;c++)
		{
			var item = homeItems[c];
			
			var imageUrl = BASEPATH + item.files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
			imageUrl = IMAGE_RESIZER + escape(imageUrl);


			var cachedImage = getCachedFile(imageUrl);
			
			if (!cachedImage)
			{
				cacheFile(imageUrl);
				cachedImage = imageUrl;
			}
			
			
			
			var imageView = Titanium.UI.createImageView({
				image:cachedImage,
				visible:true,
				canScale:true,
				width:300,
				height:196,
				top:0,
				left:ciLeft
			});
			
			
		
			
			ciLeft += 300;
			
			imageView.nid = item.nid;
			imageView.ntitle = item.node_title;
			
			
			scrollViewBottom.add(imageView);
			
			
			imageView.addEventListener('singletap', function(e)
			{
			//	Titanium.API.info('singletap event: ' + e + " : " + e.source.nid);
				showNYSenateContent(e.source.ntitle,"http://nysenate.gov/node/" + e.source.nid, win.detailView);

			});
			
		
		}
		
		
		

};


var featuresUrl = "http://nysenate.gov/front_carousel/json";
var cachedData = getCachedFile(featuresUrl);

if (!cachedData)
{
	cacheFile(featuresUrl);

}
else
{
	loadFeatures(cachedData.read());
}


xhr.onload = function() {


	
	loadFeatures(this.responseText);
};

	
xhr.open("GET",featuresUrl);
xhr.send();


var xhrBlog = Ti.Network.createHTTPClient();
xhrBlog.onreadystatechange = function () {};

var currentViewTop =  Titanium.UI.createView({
			height:topViewHeight,
			width:screenWidth,
			left:15
		});
		
topViews[topViews.length] = currentViewTop;

var divLineVert = Titanium.UI.createView({
				height:topViewHeight-45,
				width:1,
				top:20,
				left:screenWidth/2-15,
				backgroundColor:"#aaaaaa",
				zindex:5
			});
			
	currentViewTop.add(divLineVert);
	
	var divLineHoriz = Titanium.UI.createView({
				height:1,
				width:screenWidth/2-30,
				top:200,
				left:screenWidth/2,
				backgroundColor:"#aaaaaa",
				zindex:5
			});
			
	currentViewTop.add(divLineHoriz);


function addBlogLines ()
{
	var divLineVert = Titanium.UI.createView({
				height:topViewHeight-45,
				width:1,
				top:20,
				left:screenWidth/2-20,
				backgroundColor:"#aaaaaa",
				zindex:5
			});
			
	currentViewTop.add(divLineVert);
	
	var divLineHoriz = Titanium.UI.createView({
				height:1,
				width:screenWidth-30,
				top:215,
				left:0,
				backgroundColor:"#aaaaaa",
				zindex:5
			});
			
	currentViewTop.add(divLineHoriz);
}


xhrBlog.onload = function() {

	try
	{
	//Titanium.API.debug('got JSON blog response: ' + this.responseText);
	
	var blogPostWidth = screenWidth / 2-30;
	
		var jsonText = this.responseText;
		jsonText = jsonText.replace("\"1275497471\",","\"1275497471\"");
		
		var itemBlog = JSON.parse(jsonText).nodes[0];
	
		var blogTitle = itemBlog.node_title;
		var blogText = itemBlog.node_revisions_teaser.replace(/<.*?>/g, '');
			
		var labelBlogTitle = Ti.UI.createLabel({
			text:blogTitle,
			left:0,
			top:5,
			width:blogPostWidth,
			height:180,
			font:{fontSize:32},
			color:'#333333',
			nodetitle:blogTitle,
			nodeid:itemBlog.nid
		});
		
		labelBlogTitle.addEventListener('singletap',function(e)
			{
				
				showNYSenateContent(e.source.nodetitle,'http://www.nysenate.gov/node/' + e.source.nodeid , detailView);
					
			
			});
		
		var labelBlogText  = Ti.UI.createLabel({
			text:blogText,
			left:5,
			top:155,
			width:blogPostWidth,
			height:'200',
			font:{fontSize:16},
			color:'#555555'
		});
		
		currentViewTop.add(labelBlogTitle);
		currentViewTop.add(labelBlogText);

		xhrRSS.open("GET",PRIMARY_RSS_FEED);
		xhrRSS.send();

		xhrCalendar.open("GET",CALENDAR_RSS_FEED);
		xhrCalendar.send();
		
	}
	catch (E)
	{
		Titanium.API.debug(E);
		alert("Error connecting to NYSenate.gov");	
	}
};


Titanium.API.info("loading json...");

xhrBlog.open("GET","http://www.nysenate.gov/front_content/blog/json");
xhrBlog.send();


var xhrvideo = Ti.Network.createHTTPClient();

function getYouTubeVideos()
{
	var channel = 'NYSenate';
	var searchTerm = '';
	var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?alt=rss&author=' + escape(channel) + '&q=' + escape(searchTerm) + "&orderby=published&max-results=20&v=2";	
	xhrvideo.open("GET",searchUrl);
	xhrvideo.send();
	
//	Ti.API.debug('fetching youtube: ' + searchUrl);
}

xhrvideo.onload = function()
{
	try
	{
			var doc;
	
		//Titanium.API.debug("got youtube video response");
	
		if (!this.responseXML)
		{
		//	Titanium.API.debug("got plaintext");
	
			doc = Titanium.XML.parseString(this.responseText).documentElement;
		}
		else
		{
		
		//	Titanium.API.debug("got XML");
			doc = this.responseXML.documentElement;
		}

		var items = doc.getElementsByTagName("item");
		var x = 0;
		var c;
		
		var rTop = 10;
		
		var vWidth = 160;
		var vHeight = 120;
		var vHorizSpacing = 30;
		
		if (screenWidth < 768)
			vHorizSpacing = 5;
		
		var rLeft = 15;
		var vContainerHeight = 200;
		var vLabelHeight = 70;
		
		var currentView =  Titanium.UI.createView({
					
					height:vContainerHeight,
					width:screenWidth,
					top:30
				});
		
		midViews[0] = currentView;

				
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
			
		//	Ti.API.debug("youtube link: " + link);
			
			
			
			var guid = link.substring(link.indexOf("?v=")+3);
			guid = guid.substring(0,guid.indexOf("&"));
			
			var thumbnail = "http://i.ytimg.com/vi/" + guid + "/2.jpg";
			
			
			
			if ((rLeft+vWidth) > screenWidth)
			{
				
				rLeft = 15;
				
				currentView =  Titanium.UI.createView({
					height:vContainerHeight,
					width:screenWidth,
					top:30
				});
				
				midViews[midViews.length] = currentView;
				
			}
		
				
			var row = Titanium.UI.createView({
				height:vContainerHeight-50,
				width:vWidth,
				borderSize:0,
				top:rTop,
				left:rLeft
			});
				
				
			rLeft += (vWidth+vHorizSpacing);

			currentView.add(row);
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:(vHeight),
				height:vLabelHeight,
				font:{fontSize:16},
				color:'#eeeeee'
			});
			row.add(labelTitle);
			
			
			var cachedImage = getCachedFile(thumbnail);
			
			if (!cachedImage)
			{
				cacheFile(thumbnail);
				cachedImage = thumbnail;
			}
			
			
		
			var img = Ti.UI.createImageView({
				image:cachedImage,
				left:0,
				top:0,
				height:vHeight,
				width:vWidth,
				borderSize:1,
				borderColor:"#aaa"
			});
			
			img.guid = guid;
			img.videotitle = title;

			row.add(img);
			
			img.addEventListener('singletap',function(e)
			{
				
					playYouTube(e.source.videotitle,e.source.guid);
			
			});
			

			
		}
		
		
		showVideos();
	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'No videos were found for this search.'}).show();
	}
	
};


getYouTubeVideos();


var x = 0;
	var c;
	var item;
	// create table view data object
	var data = [];

	
	var cTop = 30;
	var cLeft = screenWidth/2;
	
xhrRSS.onload = function()
{

	var doc;
	

	if (!this.responseXML)
	{
		doc = Titanium.XML.parseString(this.responseText).documentElement;
	}
	else
	{
		doc = this.responseXML.documentElement;
	}

	
	var items = doc.getElementsByTagName("item");
	
	
	for (c = 0; c < items.length; c++)
	{
		try
		{
			item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			var summary = item.getElementsByTagName("description").item(0).text;
			
			var cat = '';
			
			if (item.getElementsByTagName("category"))
				cat = item.getElementsByTagName("category").item(0).text;
				
			var url = item.getElementsByTagName("link").item(0).text;
			var pubDate =  new Date(item.getElementsByTagName("pubDate").item(0).text);
			
			summary = processHtml(summary);
			summary = pubDate.format('M jS') + " - " + summary;
			
				
			if (!currentViewTop)
			{
				
				currentViewTop =  Titanium.UI.createView({
						height:topViewHeight,
						width:screenWidth,
						left:15
					});
				topViews[topViews.length] = (currentViewTop);

				addBlogLines();
			}
			
			
			
			
			//var summary = "Published " + item.getElementsByTagName("pubDate").item(0).text;
			//row.htmlview = item.getElementsByTagName("description").item(0).text;
				
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:cLeft,
				top:cTop,
				height:50,
				color:'#333333',
				width:screenWidth/2-30,
				font:{fontSize:22,fontFamily:'Helvetica Neue'},
				blogtitle:title,
				blogurl:url
			});
			currentViewTop.add(labelTitle);
			
			
			labelTitle.addEventListener('singletap',function(e)
			{
				
				showNYSenateContent(e.source.blogtitle,e.source.blogurl, detailView);
					
			
			});
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:cLeft,
				top:cTop+55,
				width:screenWidth/2-30,
				height:100,
				color:'#555555',
				font:{fontSize:16}
			});
			
			currentViewTop.add(labelSummary);
			
			cTop+=200;
			
			if ((cTop + 200) > currentViewTop.height)
			{
				cTop = 30;
				cLeft += screenWidth/2;
			}
			
			if (cLeft > currentViewTop.width)
			{
				
				//Titanium.API.debug("adding new RSS pane");
						
				currentViewTop = null;
				cLeft = 0;
			}
			
		}
		catch (E)
		{
			Titanium.API.debug("error parsing item: " + E);

			
		}
		
		
		
		
	}
	

	showTop ();
	

	
};


xhrCalendar.onload = function()
{

	var doc;
	

	if (!this.responseXML)
	{
		doc = Titanium.XML.parseString(this.responseText).documentElement;
	}
	else
	{
		doc = this.responseXML.documentElement;
	}

	
	var items = doc.getElementsByTagName("item");
	var x = 0;
	var c;
	var item;
	
	
	for (c = 0; c < 1; c++)
	{
		try
		{
			item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			var summary = item.getElementsByTagName("description").item(0).text;
			var url = item.getElementsByTagName("link").item(0).text;
			var pubDate =  new Date(item.getElementsByTagName("pubDate").item(0).text);
			
			summary = summary.replace(/<.*?>/g, '').replace(/^\s*/, "").replace(/\s*$/, "").replace('\n','');

			var evtText = "Upcoming Event:\n" + title + "\n" + summary;
			
				var labelHeader = Ti.UI.createLabel({
				text:evtText,
				top:0,
				left:5,
				height:70,
				width:300,
				font:{fontSize:13,fontFamily:'Helvetica Neue'},
				color:'#333333'
			});
			
			labelHeader.addEventListener('click',function(e)
			{
				
				
			var subWin = Titanium.UI.createWindow({
				url:"today.js",
				title:"Senate Calendar",
				navBarHidden:false,
				detailView:detailView
			});

			subWin.barColor = DEFAULT_BAR_COLOR;
			
		
			detailView.open(subWin,{animated:true});	
			
			});
			scrollViewHeader.add(labelHeader);
			
		}
		catch (E)
		{
			Titanium.API.debug("error parsing item: " + E);

		}
		
		
		
	}
	
	
	
};

// Simulates PHP's date function
Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else {
			returnStr += curChar;
		}
	}
	return returnStr;
};
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { return "Not Yet Supported"; },
	// Week
	W: function() { return "Not Yet Supported"; },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { return "Not Yet Supported"; },
	// Year
	L: function() { return (((this.getFullYear()%4==0)&&(this.getFullYear()%100 != 0)) || (this.getFullYear()%400==0)) ? '1' : '0'; },
	o: function() { return "Not Supported"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return "Not Yet Supported"; },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	// Timezone
	e: function() { return "Not Yet Supported"; },
	I: function() { return "Not Supported"; },
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() % 60)); },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d") + "T" + this.format("H:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};
