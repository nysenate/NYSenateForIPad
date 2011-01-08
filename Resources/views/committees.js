var DEFAULT_BAR_COLOR = '#1B4E81';


var win = Titanium.UI.currentWindow;


var commTableView = Titanium.UI.createTableView();
// add table view to the window
win.add(commTableView);

var tdata = [
{title:'AGING', hasChild:true, className:'commRow'},
{title:'AGRICULTURE',hasChild:true, className:'commRow'},
{title:'BANKS',hasChild:true, className:'commRow'},
{title:'CHILDREN AND FAMILIES',hasChild:true, className:'commRow'},
{title:'CITIES',hasChild:true, className:'commRow'},
{title:'CIVIL SERVICE AND PENSIONS',hasChild:true, className:'commRow'},
{title:'CODES',hasChild:true, className:'commRow'},
{title:'COMMERCE, ECONOMIC DEVELOPMENT AND SMALL BUSINESS',hasChild:true, className:'commRow'},
{title:'CONSUMER PROTECTION',hasChild:true, className:'commRow'},
{title:'CORPORATIONS, AUTHORITIES AND COMMISSIONS',hasChild:true, className:'commRow'},
{title:'CRIME VICTIMS, CRIME AND CORRECTION',hasChild:true, className:'commRow'},
{title:'CULTURAL AFFAIRS, TOURISM, PARKS AND RECREATION',hasChild:true, className:'commRow'},
{title:'EDUCATION',hasChild:true, className:'commRow'},
{title:'ELECTIONS',hasChild:true, className:'commRow'},
{title:'ENERGY AND TELECOMMUNICATIONS',hasChild:true, className:'commRow'},
{title:'ENVIRONMENTAL CONSERVATION',hasChild:true, className:'commRow'},
{title:'FINANCE',hasChild:true, className:'commRow'},
{title:'HEALTH',hasChild:true, className:'commRow'},
{title:'HIGHER EDUCATION',hasChild:true, className:'commRow'},
{title:'HOUSING, CONSTRUCTION AND COMMUNITY DEVELOPMENT',hasChild:true, className:'commRow'},
{title:'INSURANCE',hasChild:true, className:'commRow'},
{title:'INVESTIGATIONS AND GOVERNMENT OPERATIONS',hasChild:true, className:'commRow'},
{title:'JUDICIARY',hasChild:true, className:'commRow'},
{title:'LABOR',hasChild:true, className:'commRow'},
{title:'LOCAL GOVERNMENT',hasChild:true, className:'commRow'},
{title:'MENTAL HEALTH AND DEVELOPMENTAL DISABILITIES',hasChild:true, className:'commRow'},
{title:'RACING, GAMING AND WAGERING',hasChild:true, className:'commRow'},
{title:'RULES',hasChild:true, className:'commRow'},
{title:'SOCIAL SERVICES',hasChild:true, className:'commRow'},
{title:'SOCIAL SERVICES, CHILDREN AND FAMILIES',hasChild:true, className:'commRow'},
{title:'TOURISM, RECREATION AND SPORTS DEVELOPMENT',hasChild:true, className:'commRow'},
{title:'TRANSPORTATION',hasChild:true, className:'commRow'},
{title:'VETERANS, HOMELAND SECURITY AND MILITARY AFFAIRS',hasChild:true, className:'commRow'}

];

for (i = 0; i < tdata.length; i++)
{

		var row = Ti.UI.createTableViewRow({height:100});
			
			row.hasChild = true;
			
			row.searchTerm = tdata[i].title;
			
			var labelTitle = Ti.UI.createLabel({
				text:tdata[i].title,
				left:5,
				top:0,
				height:80,
				font:{fontSize:24,fontFamily:'Helvetica Neue'},
				color:"#333333"
			});
			row.add(labelTitle);
			

		commTableView.appendRow(row);	
}

// create table view event listener
commTableView.addEventListener('click', function(e)
{
	var searchValue = e.row.searchTerm;
	
	var subWin = Titanium.UI.createWindow({
		url:'olsearch.js',
		title:'Search: ' + searchValue,
		barColor:DEFAULT_BAR_COLOR,
		olterm:searchValue,
		detailView:win.detailView		
	});
	
	win.detailView.open(subWin,{animated:true});
});
