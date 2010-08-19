Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;

var geoInProgress = false;

win.backgroundColor = "#333333";

var sWidth = Titanium.UI.currentWindow.size.width;
var sHeight = Titanium.UI.currentWindow.size.height;
	
//
//  CREATE FIELD ONE
//
var lblAddress = Titanium.UI.createLabel({
	text:'Street Address',
	top:10,
	left:30,
	width:sWidth*.75,
	height:'auto',
	color:"#ffffff"
});

win.add(lblAddress);

var txtAddress = Titanium.UI.createTextField({
	hintText:'Your New York State Address',
	height:35,
	top:35,
	left:30,
	width:sWidth*.75,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(txtAddress);

//
//  CREATE FIELD TWO
//
var lblZipcode = Titanium.UI.createLabel({
	text:'Zipcode',
	top:75,
	left:30,
	width:100,
	height:'auto',
	color:"#ffffff"
});

win.add(lblZipcode);

var txtZipcode = Titanium.UI.createTextField({
	hintText:'Your New York State Zipcode',
	top:100,
	left:30,
	width:250,
	height:35,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(txtZipcode);

//
// CREATE BUTTON
//
var btnSearch = Titanium.UI.createButton({
	title:'Search by Address',
	top:160,
	left:30,
	width:250,
	height:50,
	color:"#ffffff",
	backgroundImage:'../../img/btn/BUTT_grn_off.png',
	backgroundSelectedImage:'../../img/btn/BUTT_grn_on.png',
	backgroundDisabledImage: '../../img/btn/BUTT_drk_off.png'
	}
	);
win.add(btnSearch);

var btnGeo = Titanium.UI.createButton({
	title:'Search by GPS Location',
	top:240,
	left:30,
	width:250,
	height:50,
	color:"#333333",
	backgroundImage:'../../img/btn/BUTT_gry_off.png',
	backgroundSelectedImage:'../../img/btn/BUTT_gry_on.png',
	backgroundDisabledImage: '../../img/btn/BUTT_drk_off.png'
});
win.add(btnGeo);


function searchByAddress()
{
	Titanium.API.info("starting address search");
	
	
		var toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Searching by address...';
		win.setToolbar([toolActInd],{animated:true});
		toolActInd.show();
	
		var valZip = txtZipcode.value;
		var valAddress = txtAddress.value;
		
		var searchUrl = "http://nysenatemobile.appspot.com/data/senatorbyaddress.jsp?street=" + escape(valAddress) + "&zip=" + escape(valZip);
		
		Titanium.API.info("searching: " + valAddress + " " + valZip + ": " + searchUrl);
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(30000);
		
		xhr.onload = function()
		{
			
			try
			{
				Titanium.API.info("senator lookup resp: " + this.responseText);
				
				var senatorKey = this.responseText;
				senatorKey = senatorKey.replace(/^\s+/, '');
   				senatorKey = senatorKey.replace(/\s+$/, '');
				
				var items = getSenatorJSON ().senators;
				var senator;
				
				for (i = 0; i < items.length; i++)
				{
					//Titanium.API.info("checking senator: " + items[i].key + "==" + senatorKey);
					
					if (String(items[i].key) == String(senatorKey))
					{
						Titanium.API.info("MATCH!");
						
						senator = items[i];
						break;
					}
				}
				
				if (!senator)
				{
						var a = Titanium.UI.createAlertDialog({
							title:'Senator Lookup',
							message:'We could not find a Senator for that address'
						});
						a.show();
				}
				else
				{
					Titanium.API.info("parsed senator json");
				
					var senImage = "../../img/senators/" + senator.key + ".jpg";
				
					var newWin = Titanium.UI.createWindow({
						url:'senator.js',
						title:senator.name,
						senatorName:senator.name,
						senatorImage:senImage,
						senatorKey:senator.key,
						senatorDistrict:senator.district,
						twitter:senator.twitter,
						facebook:senator.facebook,
						barColor:DEFAULT_BAR_COLOR,
						backgroundImage:'../../img/bg/wood.jpg',
						detailView:win.detailView
	
	
					});
						
					win.detailView.open(newWin,{animated:true});
				}
			}
			catch (E)
			{
				//alert("There was an error during lookup.");
				alert(E);
			}
			
					toolActInd.hide();
					win.setToolbar(null,{animated:true});
		};
		
		xhr.onerror = function ()
		{
				var a = Titanium.UI.createAlertDialog({
					title:'Senator Lookup',
					message:'We could not find a Senator for that address'
				});
				a.show();
		};
		
		xhr.open("GET",searchUrl);
		xhr.send();
	
	
}

	var longitude = null;
	var latitude = null;
	var altitude = null;
	var heading = null;
	var accuracy = null;
	var speed = null;
	var timestamp  = null;
	var altitudeAccuracy = null;
	
		var toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Finding your location...';


	function handleLocation (e)
	{
			
			toolActInd.hide();
			win.setToolbar(null,{animated:true});
		
		
			if (e.error)
			{
				//currentLocation.text = 'error: ' + JSON.stringify(e.error);

				Titanium.UI.createAlertDialog({title:'NY Senate', message:'We could not find your location. Please try again later'}).show();
				return;
			}

			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			altitude = e.coords.altitude;
			heading = e.coords.heading;
			accuracy = e.coords.accuracy;
			speed = e.coords.speed;
			timestamp = e.coords.timestamp;
			altitudeAccuracy = e.coords.altitudeAccuracy;

		//	currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;

			Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);

				// reverse geo
				Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
				{
					var places = evt.places;
				//	reverseGeo.text = places[0].address;
					Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));

					for (n = 0; n < places.length; n++)
					{
						if (places[n].street)
						{
							Ti.API.info("got place street: " + places[n].street);
						
							Ti.API.info("location: " + places[n].street + ", " + places[n].zipcode);
								
							txtAddress.value = places[n].street;
							txtZipcode.value = places[n].zipcode;
							
							searchByAddress();
							
							break;
						}
						else if (places[n].address)
						{
						
							Ti.API.info("got place address: " + places[n].address);
						
							var address = places[n].address;
							//15 Warren St, New York, NY 10007, USA
							
							var addressTokens = address.split(",");
							
							var street = addressTokens[0];
							Ti.API.info("got street: " + street);
								
							var city = trim(addressTokens[1]);
							
							Ti.API.info("got city: " + city);
							
							var stateZip = trim(addressTokens[2]).split(" ");
							
							var state = stateZip[0];
							Ti.API.info("got state: " + state);
							
							var zipcode = stateZip[1];
							Ti.API.info("got zip: " + zipcode);
							
							Ti.API.info("location: " + street + ", " + zipcode);
							
							txtAddress.value = street;
							txtZipcode.value = zipcode;
							
							searchByAddress();
							
							break;
						}
					}
					//txtZipcode
					
				//	searchByAddress();

				});


				
	}
	
function getGeo ()
{
	
		win.setToolbar([toolActInd],{animated:true});
		toolActInd.show();
		
	
	//
	//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
	//
	if (Titanium.Geolocation.locationServicesEnabled==false)
	{
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'Your device has geo turned off - turn it on.'}).show();
	}
	else
	{
	
	

		//
		//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
		//
		// Titanium.Geolocation.ACCURACY_BEST
		// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
		// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
		// Titanium.Geolocation.ACCURACY_KILOMETER
		// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
		//
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HUNDRED_METERS;
		//Titanium.Geolocation.distanceFilter = 10;

		//
		//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
		//  THIS VALUE IS IN METERS
		//
		//Titanium.Geolocation.distanceFilter = 10;

	
		//
		// GET CURRENT POSITION - THIS FIRES ONCE
		//
		Titanium.Geolocation.getCurrentPosition(function(e)
		{
			handleLocation(e);
		});

		//
		// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
		//
		Titanium.Geolocation.addEventListener('location',function(e)
		{
		//	handleLocation(e);
		
		});

	
	}

}

btnSearch.addEventListener('click',function()
{
	searchByAddress();
	
});

btnGeo.addEventListener('click',function()
{
    geoInProgress = true;
	getGeo();
});
