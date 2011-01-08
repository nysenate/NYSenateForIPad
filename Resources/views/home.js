Ti.include("../globals.js");


//
// SETUP WINDOW STYLES
//
Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;
var win = Ti.UI.currentWindow;


win.backgroundImage = "../img/bg/wood.jpg";

var cover = Titanium.UI.createView({
	backgroundImage:DEFAULT_BG,
	zIndex:5
});
win.add(cover);

var senLogo = Titanium.UI.createImageView({
				image:'../img/nysenate-logo-large.png',
				top:15,
				left:15,
				width:150,
				height:150
			});

win.add(senLogo);

var data = [

	{title:'Play Movie'},

	{title:'Camera'}

];

// tableview object
var tableView = Titanium.UI.createTableView({
	top:180,
	left:15,
	width:300,
	height:300,
	backgroundImage: "../img/bg/wood.jpg",
	data:data,
	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(tableView);



// tableview object
var tableView2 = Titanium.UI.createTableView({
	top:180,
	right:15,
	width:300,
	height:300,
	backgroundImage: "../img/bg/wood.jpg",
	data:data,
	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

win.add(tableView2);

/*
var videoView = Titanium.UI.createView({
			bottom:300,
			left:0,
			right:0,
			height:200,
			width:768,
		});
		
win.add(videoView);
*/

var xhr = Ti.Network.createHTTPClient();


xhr.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};

var homeItems;

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

checkOnline(Ti.Network.online);

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

var scrollView;

function loadFeatures (featuresJSON)
{		
		
		
		Titanium.API.info("got features data");

	
		homeItems = JSON.parse(featuresJSON).nodes;

		var BASEPATH = "http://nysenate.gov/";
		
		
		scrollView = Titanium.UI.createView({
			top:800,
			left:50,
			right:0,
			height:130,
			width:768
		});
		
		//var sViews = [homeItems.length];
		var ciLeft = 10;
		
		for (var c=0;c<3;c++)
		{
			var item = homeItems[c];
			
			var imageUrl = BASEPATH + item.files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
			Titanium.API.info("LOADING IMAGE " +imageUrl);
		
			
			var imageView = Titanium.UI.createImageView({
				image:imageUrl,
				visible:true,
				canScale:true,
				width:210,
				height:115,
				left:ciLeft,
				borderColor:"#ffffff",
				borderWidth:5
			});
			
			ciLeft += 235;
			
			imageView.nid = item.nid;
			imageView.ntitle = item.node_title;
			
			
			//sViews[c] = imageView;
			
			scrollView.add(imageView);
			
			imageView.addEventListener('singletap', function(e)
			{
			//	Titanium.API.info('singletap event: ' + e + " : " + e.source.nid);
				showNYSenateContent(e.source.ntitle,"http://nysenate.gov/node/" + e.source.nid, true);

			});
			
		
		}
		
		Titanium.API.info("adding scrollview!");
		
		/*
		scrollView = Titanium.UI.createScrollableView({
			views:sViews,
			showPagingControl:true,
			clipViews:true,
			bottom:20,
			left:0,
			right:0,
			height:360,
			width:768,
			layout:'horizontal',
			horizontalBounce:true,
			showHorizontalScrollIndicator:true
		});
		*/
		
	
		Ti.UI.currentWindow.add(scrollView);
		
		Titanium.API.info("fading cover");
		
		cover.animate({opacity:0,duration:2000});
		
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
		


		//xhrVideo.open("GET","http://www.nysenate.gov/front_video/json");
		//xhrVideo.send();

};


xhr.onload = function() {

	loadFeatures(this.responseText);
};



//Titanium.API.info("loading json...");

toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();
	
xhr.open("GET","http://nysenate.gov/front_carousel/json");
xhr.send();

Titanium.API.info("json request: " + xhr.status);


var xhrVideo = Ti.Network.createHTTPClient();


xhrVideo.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
		
};


xhrVideo.onload = function() {

	try
	{
		Titanium.API.info("got featured video data");

		var videoItem = JSON.parse(this.responseText).nodes[0];

		var BASEPATH = "http://nysenate.gov/";
	
		var imageUrlVideo = "http://img.youtube.com/vi/" + videoItem.node_data_field_video_field_video + "/0.jpg";
		
		Titanium.API.info("LOADING IMAGE " +imageUrlVideo);
	
		var imageViewVideo = Titanium.UI.createImageView({
			image:imageUrlVideo,
			visible:true,
			canScale:true,
			width:590,
			height:322,
			backgroundColor:"#000000",
			borderColor:"#ffffff",
			borderWidth:10,
		});
		
		var videoTitle = videoItem.node_title;
		var videoTitleMax = 18;
		if (videoTitle.length > videoTitleMax)
		{
			videoTitle = videoTitle.substring(0,videoTitleMax) + "...";
		}
			
		videoTitle = '"' + videoTitle + '"';
		
		
		
		imageViewVideo.addEventListener('singletap', function(e)
		{
			playYouTube("Featured Video",videoItem.node_data_field_video_field_video);
			
		});
		
		scrollView.addView(imageViewVideo);
		
	}
	catch (E)
	{
		Titanium.API.debug(E);
		alert("Error connecting to NYSenate.gov");		
	}
};





/*


var xhrBlog = Ti.Network.createHTTPClient();


xhrBlog.onreadystatechange = function () {
//	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};


xhrBlog.onload = function() {

	try
	{
	//	Titanium.API.info("got blog data: " + this.responseText);

		var jsonText = this.responseText;
		jsonText = jsonText.replace("\"1275497471\",","\"1275497471\"");
		
		var itemBlog = JSON.parse(jsonText).nodes[0];

		var BASEPATH = "http://nysenate.gov/";
	
	    if (itemBlog.files_node_data_field_feature_image_filepath)
	    {
			var imageUrl = BASEPATH + itemBlog.files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
		}
		else
		{
			imageUrl =  "../img/blog.jpg";
		}
	
		var imageViewBlog = Titanium.UI.createImageView({
			url:imageUrl,
			visible:true,
			canScale:true,
			width:140,
			height:120,
			right:10,
			backgroundColor:"#000000",
			borderColor:"#ffffff",
			borderWidth:3,
			top:220,
			opacity:0
		});
		
		
			var blogTitle = itemBlog.node_title;
			var blogTitleMax = 18;
			if (blogTitle.length > blogTitleMax)
			{
				blogTitle = blogTitle.substring(0,blogTitleMax) + "...";
			}

			blogTitle = '"' + blogTitle + '"';

			var messageView5 = Titanium.UI.createView({
				bottom:3,
				backgroundColor:'transparent',
				height:20,
				width:150,
				right:10,
				borderRadius:0,
				opacity:0.8
			});

			var messageLabel5 = Titanium.UI.createLabel({
				color:'#fff',
				text:blogTitle,
				textAlign:'center',
				font:{fontSize:14},
				top:0,
				left:0,
				width:150,
				height:'auto'
			});

			messageView5.add(messageLabel5);
			win.add(messageView5);
			
		imageViewBlog.addEventListener('singletap', function(e)
		{

			win.open(showNYSenateContent(itemBlog.node_title,BASEPATH + "node/" + itemBlog.nid),{animated:true});
		});
	
		Ti.UI.currentWindow.add(imageViewBlog);
		
		imageViewBlog.animate({opacity:1,duration:2000});
		
		
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
*/
