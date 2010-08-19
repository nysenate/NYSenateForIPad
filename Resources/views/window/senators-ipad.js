Ti.include("../../inc/globals.js");


var win = Titanium.UI.currentWindow;


var senatorsTableList;
 
	Titanium.API.debug("loading senators json");
	
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'senators.json');
	var contents = file.read();

	Titanium.API.debug("parsing senators json");
	
	var items = JSON.parse(contents.text).senators;
	 	
	Titanium.API.debug("got senators JSON: " + items.length);
	
	var data = [];
	var c;
	
	for (c=0; c<items.length; c++)
	{
	
		//Titanium.API.debug("adding senator: " + c);

		var row = Ti.UI.createTableViewRow({height:80});
		var title = "Sen. " + items[c].name;
		var summary = "District " + items[c].district;
	
		var thumbnail = "../../img/senators/small/" + items[c].key + ".jpg";
	
		var labelTitle = Ti.UI.createLabel({
			text:title,
			left:60,
			top:10,
			height:25,
			font:{fontSize:18}
		});
		row.add(labelTitle);
		
		var labelSummary = Ti.UI.createLabel({
			text:summary,
			left:60,
			top:35,
			font:{fontSize:14}
		});
		row.add(labelSummary);
	
		var img = Ti.UI.createImageView({
			url:thumbnail,
			left:0,
			height:80,
			width:55
		});
		row.add(img);
		
		data[c] = row;
		
	}

	senatorsTableList = Titanium.UI.createTableView({
	    data:data
	});

	
	if (Titanium.Platform.name == 'iPhone OS')
	{

	var btnSearch = Titanium.UI.createButton({
		title:'By Address'
	});


	btnSearch.addEventListener('click',function()
	{
		var winSearch = Titanium.UI.createWindow({
			url:'findsenator.js',
			title:'Senator Search',
			barColor:DEFAULT_BAR_COLOR,
			backgroundImage:'../../img/bg/wood.jpg'

		});

		nav.open(winSearch,{animated:true});
	
	});
			
	Titanium.UI.currentWindow.rightNavButton = btnSearch;

}
else
{
	var menu = Titanium.UI.Android.OptionMenu.createMenu();
 
	var item1 = Titanium.UI.Android.OptionMenu.createMenuItem({
		title : 'Search by Address'
	});
	 
	item1.addEventListener('click', function(){
		var winSearch = Titanium.UI.createWindow({
			url:'findsenator.js',
			title:'Senator Search',
			barColor:DEFAULT_BAR_COLOR,
			backgroundImage:'../../img/bg/wood.jpg'

		});

		Titanium.UI.currentTab.open(winSearch,{animated:true});
	});
	
	menu.add(item1);

	Titanium.UI.Android.OptionMenu.setMenu(menu);

}


	
	// click listener - when image is clicked
	senatorsTableList.addEventListener('click',function(e)
	{
		Titanium.API.info("image clicked: "+e.index);

		var newWin = Titanium.UI.createWindow({
			url:'senator.js',
			title:items[e.index].name,
			senatorName:items[e.index].name,
			senatorImage:"../../img/senators/" + items[e.index].key + ".jpg",
			senatorKey:items[e.index].key,
			senatorDistrict:items[e.index].district,
			twitter:items[e.index].twitter,
			facebook:items[e.index].facebook,
			backgroundImage:'../../img/bg/wood.jpg'
		
		});

		nav.open(newWin,{animated:true});

	});

	

var senWebWindow = Ti.UI.createWindow({
			
			barColor:DEFAULT_BAR_COLOR	
	
		});

/*
var senWebView = Ti.UI.createWebView();
senWebView.scalesPageToFit = true;		
senWebView.url = "http://www.nysenate.gov/senate-leadership-list";
senWebWindow.add(senWebView);
*/

var nav = Ti.UI.iPhone.createNavigationGroup({
   window: win
});


navLeft.add();

var splitwin = Ti.UI.iPad.createSplitWindow({
    detailView:nav,
    masterView:senatorsTableList
});

 
splitwin.addEventListener('visible',function(e)
{
    if (e.view == 'detail')
    {
        e.button.title = "Senators";
        win.leftNavButton = e.button;
    }
    else if (e.view == 'master')
    {
        win.leftNavButton = null;
    }
});

 
splitwin.open();



