Ti.include("../../inc/globals.js");

var win = Ti.UI.currentWindow;

	Titanium.API.debug("loading senators json");
	
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'senators.json');
	var contents = file.read();

	Titanium.API.debug("parsing senators json");
	
	var items = JSON.parse(contents.text).senators;
	 	
	Titanium.API.debug("got senators JSON: " + items.length);
	
	var	senatorView = Titanium.UI.createTableView({
	});

	Titanium.UI.currentWindow.add(senatorView);
	
	var c;
	var row;
	
	row = Ti.UI.createTableViewRow({height:90});
	row.title = 'Find Your Senator';
	row.leftImage = '../../img/tabs/search.png';
	row.ilink = '../../views/window/findsenator.js';
	
	senatorView.appendRow(row);
	
	row = Ti.UI.createTableViewRow({height:90});
	row.title = 'Districts Map';
	row.leftImage = '../../img/tabs/world.png';
	row.link = 'http://www.nysenate.gov/districts/map';
	senatorView.appendRow(row);
	
	row = Ti.UI.createTableViewRow({height:90});
	row.title = 'Senate Leadership';
	row.leftImage = '../../img/tabs/connections.png';
	row.link = 'http://www.nysenate.gov/senate-leadership-list';
	senatorView.appendRow(row);
	
	

	
	
	for (c=0; c<items.length; c++)
	{
	
		//Titanium.API.debug("adding senator: " + c);

		row = Ti.UI.createTableViewRow({height:90});
		row.className = 'senrow';
		var title = "Sen. " + items[c].name;
		var summary = "District " + items[c].district;
	
		var thumbnail = "../../img/senators/small/" + items[c].key + ".jpg";
	
		var labelTitle = Ti.UI.createLabel({
			text:title,
			left:75,
			top:10,
			height:'auto',
			width:200,
			font:{fontSize:18}
		});
		row.add(labelTitle);
		
		var labelSummary = Ti.UI.createLabel({
			text:summary,
			left:75,
			top:35,
			font:{fontSize:14}
		});
		row.add(labelSummary);
	
		var img = Ti.UI.createImageView({
			image:thumbnail,
			left:0,
			height:90,
			width:60
		});
		row.add(img);
		
		row.hasDetail = true;
		
		senatorView.appendRow(row);
	
		
	}

	


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
			
			var senIndex = e.index - 3;
			
			var newWin = Titanium.UI.createWindow({
				url:'senator.js',
				title:items[senIndex].name,
				senatorName:items[senIndex].name,
				senatorImage:"../../img/senators/" + items[senIndex].key + ".jpg",
				senatorKey:items[senIndex].key,
				senatorDistrict:items[senIndex].district,
				twitter:items[senIndex].twitter,
				facebook:items[senIndex].facebook,
				backgroundImage:'../../img/bg/wood.jpg',
				barColor:DEFAULT_BAR_COLOR,
				detailView:win.detailView
			});
	
			win.detailView.open(newWin,{animated:true});
		}
	
	});

	

