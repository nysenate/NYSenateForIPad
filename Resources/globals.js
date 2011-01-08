

var DEFAULT_BAR_COLOR = '#1B4E81';
var DEFAULT_BG = '../../img/bg/nysenatebglight.png';

var BG_BLACK = '../../img/bg/bg.png';
var BG_SPLASH = '../../img/bg/Default.png';
var BG_LIGHT = '../../img/bg/nysenatebglight.png';

var webModal;
var webModalView;

var webPopupModal;
var webPopupModalView;

var toolActInd;
var currentLink;
		
var btnSearch = Titanium.UI.createButton({
	title:'Open in Browser',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

btnSearch.addEventListener('click',function()
{
	Titanium.Platform.openURL(currentLink);
	
});



var senatorJson;

function getSenatorJSON ()
{
	if (!senatorJson)
	{
		Titanium.API.info("loading senators json");
		
		var cachedFeed = getCachedFile("senatorsJson");

	//	Titanium.API.info("parsing senators json: " + cachedFeed);

		if (cachedFeed)
		{
			senatorJson = JSON.parse('{"data":' + cachedFeed + '}').data;

		}
	 	
	}

	return senatorJson;
}


function processHtml (rawHTML)
{
	rawHTML=rawHTML.replace(/<br>/gi, " ");
	rawHTML=rawHTML.replace(/  /gi, " ");
	rawHTML=rawHTML.replace(/&nbsp;/gi, " ");
	rawHTML=rawHTML.replace(/&amp;/gi, " & ");
	rawHTML=rawHTML.replace(/<p.*>/gi, "");
	rawHTML=rawHTML.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, "");
	rawHTML=rawHTML.replace(/<(?:.|\s)*?>/g, "");
	rawHTML=rawHTML.replace(/^\s*|\s*$/g,'');
	
	rawHTML = rawHTML.replace(/(\r\n|\n|\r)/gm," ");


	return rawHTML;
}

function processNYSenateHtml (rawHTML)
{

	var respText = rawHTML;

	
	var baseHref = "http://www.nysenate.gov";

	
	var contentIdx = respText.indexOf('id="content">');
	
	if (contentIdx != -1)
	{
		respText = respText.substring(contentIdx+13);
		
		respText = respText.substring(0, respText.indexOf('<!-- /#content-inner') );
		
		respText = respText.replace("<div>","");
		respText = respText.replace("</div>","");
		
		respText = respText.replace("target=\"_blank\"","");
		
		
			respText = '<html><head><style>#emvideo-youtube-flash-1, .group-video, object {display:none;} .links, .share_links { display: none;} body {font-family:"Helvetica Neue"; font-size:120%; color:"#555555"; background-image:url(http://open.nysenate.gov/legislation/img/bg.png);background-repeat:repeat-x;} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body style="">'
			+ '<base href="' + baseHref + '"/>'
			+ respText + '</body></html>';

	}

	return respText;
}


function createWebView ()
{
	
	
		
			webModal = Ti.UI.createWindow({
				
				barColor:DEFAULT_BAR_COLOR	
				
			});
			
		
			
			webModalView = Ti.UI.createWebView();
			webModalView.scalesPageToFit = true;
			webModalView.backgroundImage = '../../img/bg/nyss_bg.png';
	
			
			webModal.add(webModalView);

				toolActInd = Titanium.UI.createActivityIndicator();
			toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
			toolActInd.color = 'white';
			toolActInd.message = 'Loading...';
		

			webModalView.addEventListener('beforeload',function(e)
			{
				Ti.API.debug("beforeload: " + e.url);
				
				webModal.setToolbar([toolActInd],{animated:true});
				toolActInd.show();
	
			});
				
			webModalView.addEventListener('load',function(e)
			{
				
				Ti.API.debug("load: " + e.url);
				
				toolActInd.hide();
				webModal.setToolbar(null,{animated:true});
	
			});
		
		
	
}

function createPopupView ()
{
	
	
		if (!webModal)
		{
		
			webPopupModal = Ti.UI.createWindow({
				
				barColor:DEFAULT_BAR_COLOR	
				
			});
			
		
			
			webPopupModalView = Ti.UI.createWebView();
			webPopupModalView.scalesPageToFit = true;
			webPopupModal.add(webPopupModalView);


		
		
		}
	
}

function showWebModal(wTitle, wUrl, detailView)
{
		Titanium.API.info("loading modal web view for: " + wUrl);
		
		currentLink = wUrl;
		webModal = null;
		
		createWebView();
		
		
		webModal.title = wTitle;
		
		detailView.open(webModal,{animated:true});
		webModalView.html = null;
		webModalView.url = wUrl;
	
	
};

function playYouTube (vtitle, vguid)
{
	
	var ytVideoSrc = "http://www.youtube.com/v/" + vguid;
	var thumbPlayer = '<html><head><style type="text/css"> body { background-color: black;color: white;} </style></head><body style="margin:0"><br/><br/><center><embed id="yt" src="' + ytVideoSrc + '" type="application/x-shockwave-flash" width="100%" height="75%"></embed></center></body></html>';
	showHTMLContent(vtitle,'http://www.youtube.com/watch?v=' + vguid,thumbPlayer, true, 600, 400, Ti.UI.currentWindow.detailView);

}

function showYouTubeVideo (wTitle, wYouTube)
{
	
	var wYouTubeId = wYouTube.substring(wYouTube.indexOf("v=")+2);
	
	if (wYouTubeId.indexOf("&") != -1)
	{
		wYouTubeId = wYouTubeId.substring(0,wYouTubeId.indexOf("&"));
	}
	
	Titanium.API.info("loading youtube page: " + wYouTubeId + " / " + wYouTube);
	
	var youTubePlayer = '<html><body><center><div id="emvideo-youtube-flash-wrapper-1"><object type="application/x-shockwave-flash" height="350" width="425" data="http://www.youtube.com/v/' + wYouTubeId + '&amp;rel=0&amp;fs=1" id="emvideo-youtube-flash-1" allowFullScreen="true"> <param name="movie" value="http://www.youtube.com/v/' + wYouTubeId + '&amp;rel=0&amp;fs=1" />  <param name="allowScriptAcess" value="sameDomain"/>  <param name="quality" value="best"/>  <param name="allowFullScreen" value="true"/>  <param name="bgcolor" value="#FFFFFF"/>  <param name="scale" value="noScale"/> <param name="salign" value="TL"/> <param name="FlashVars" value="playerMode=embedded" /> <param name="wmode" value="transparent" /> <a href="http://www.youtube.com/watch?v=' + wYouTubeId + '">	<img src="http://img.youtube.com/vi/' + wYouTubeId + '/0.jpg" width="480" height="360" alt="[Video title]" />YouTube Video</a></object></div></center></body></html>';

		showHTMLContent(wTitle, '', youTubePlayer);
	
}

function showHTMLContent(wTitle, wUrl, wHTMLContent, isPopup, wWidth, wHeight, detailView)
{
		
		currentLink = wUrl;
		
	
		if (isPopup)
		{
		
				
				createPopupView();
		
		
				webPopupModal.title = wTitle;
		
				webPopupModalView.html = wHTMLContent;
			
			
				var w = Titanium.UI.createWindow({
					backgroundColor:'#333333',
					borderWidth:10,
					borderColor:'#333',
					height:wHeight,
					width:wWidth,
					borderRadius:10,
					opacity:0.92
					
					//transform:t
				});
			
				// create a button to close window
				var b = Titanium.UI.createButton({
					title:'X',
					height:30,
					width:30,
					top:10,
					left:10
				});
				w.add(b);
				b.addEventListener('click', function()
				{
					Titanium.UI.currentWindow.opacity = 1;
					var t3 = Titanium.UI.create2DMatrix();
					t3 = t3.scale(0);
					w.close({transform:t3,duration:300});
					
					webPopupModalView.html = "<html><body></body></html";
				});
			
				webPopupModalView.top = 43;
				webPopupModalView.left = 10;
				
				w.add(webPopupModalView);
				
				Titanium.UI.currentWindow.opacity = .5;
				
				w.open({});
	
		}
		else
		{
		
			createWebView();
		
		
			webModal.title = wTitle;
		
			webModalView.html = wHTMLContent;
			detailView.open(webModal,{animated:true});
		}
};

function showPopup (w, wWidth, wHeight)
{
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	w.height = wHeight;
	w.width = wWidth;
	w.borderColor = '#333';
	w.borderWidth = 10;
	w.transform = t;
	
	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix();
	t1 = t1.scale(1.1);
	var a = Titanium.UI.createAnimation();
	a.transform = t1;
	a.duration = 200;

	// when this animation completes, scale to normal size
	a.addEventListener('complete', function()
	{
		Titanium.API.info('here in complete');
		var t2 = Titanium.UI.create2DMatrix();
		t2 = t2.scale(1.0);
		w.animate({transform:t2, duration:200});

	});

	// create a button to close window
	var b = Titanium.UI.createButton({
		title:'X',
		height:30,
		width:30,
		top:10,
		left:10
	});
	w.add(b);
	b.addEventListener('click', function()
	{
	Titanium.UI.currentWindow.opacity = 1;
	
		var t3 = Titanium.UI.create2DMatrix();
		t3 = t3.scale(0);
		w.close({transform:t3,duration:300});
	});

	webModalView.top = 43;
	webModalView.left = 10;
	
	Titanium.UI.currentWindow.opacity = .5;
	
	w.open(a);
	

}


function showNYSenateContent(wTitle, wUrl,detailView)
{

		currentLink = wUrl;
		
		webModal = null;
		
		createWebView();
		
		webModal.title = wTitle;
		webModalView.url = wUrl;
		
		detailView.open(webModal,{animated:true});
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(30000);
		xhr.open("GET",wUrl);

		xhr.onload = function()
		{
		
			webModalView.html = processNYSenateHtml(this.responseText);				
			toolActInd.hide();
			webModal.setToolbar(null,{animated:true});
				
		};
		
	
		xhr.send();
		
};

function getCachedFile (cacheUrl)
{

		
		var filename = Titanium.Utils.md5HexDigest(cacheUrl);

		try
		{
		//	Ti.API.debug('looking for cached file md5: ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			if (f)
			{
			//	Ti.API.debug('found cached file: ' + f.nativePath);
				return f.read();
			}
			else
				return null;
		}
		catch (E)
		{
			//Ti.API.debug('no cache for: ' + cacheUrl);
			return null;
		}	
		
		
		return null;

}

function cacheFile (fileUrl, fileData, fileCallbackFunction)
{

	if (fileData)
	{
		var filename = Titanium.Utils.md5HexDigest(fileUrl);
			
			//Ti.API.debug('saving file ' + fileUrl + ' as : ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			f.write(fileData);
			
			if(fileCallbackFunction)
				fileCallbackFunction(fileUrl,f);
	
	}
	else
	{
		var c = Titanium.Network.createHTTPClient();
		
		c.setTimeout(30000);
		
		c.onload = function()
		{
			var filename = Titanium.Utils.md5HexDigest(fileUrl);
			
			//Ti.API.info('saving file ' + fileUrl + ' as : ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			f.write(this.responseData);
			
			if(fileCallbackFunction)
				fileCallbackFunction(fileUrl,f);

		};
		
		c.ondatastream = function(e)
		{
			//ind.value = e.progress ;
			//Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
		};
		
		c.error = function(e)
		{
			//Ti.UI.createAlertDialog({title:'XHR', message:'Error: ' + e.error}).show();
			//Ti.API.debug('ONDATASTREAM1 - ERROR: ' + e.error);
		};
		
		c.open('GET', fileUrl);
		
		// send the data
		c.send();
	}	
}


function trim(s) 
{ 
    var l=0; var r=s.length -1; 
    while(l < s.length && s[l] == ' ') 
    {     l++; } 
    while(r > l && s[r] == ' ') 
    {     r-=1;     } 
    return s.substring(l, r+1); 
} 

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

