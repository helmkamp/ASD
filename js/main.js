// Andrew Helmkamp
// ASD 1304
// Main Project JS File


//-- CRUD --//
// Create
var storeData = function(data, key) {
		var id = typeof key !== 'undefined' ? key : Math.floor(Math.random() * 1000000001);
		data[4].value = typeof data[4].value !== 'undefined' ? data[4].value : "";

		//Gather data from form and store in an object
		//Object properties contain array with the form label and value
		var item = {};
		item.startDate = ["Start Date:", data[0].value];
		item.endDate = ["End Date:", data[1].value];
		item.itemName = ["Item Name:", data[2].value];
		item.category = ["Category:", data[3].value];
		item.comments = ["Comments:", data[4].value];

		//Save data into local storage using Stringify
		localStorage.setItem(id, JSON.stringify(item));
		$('<div>').simpledialog2({
			mode: 'blank',
			headerText: 'Task Saved',
			zindex: 1000,
			blankContent :
				"<ul data-role='listview'><li>The task has been saved successfully!</li>"+
				"<a rel='close' data-role='button' href='#'>Close</a>",
			callbackClose: refreshPage
		});
	};

$('#addpage').on('pageinit', function () {
	var myForm = $('#todoForm');
	myForm.validate({
		invalidHandler: function(form, validator) {},
		submitHandler: function() {
			var data = myForm.serializeArray();
			storeData(data);
		}
	});
});

// Read
$('#displaypage').on('pageinit', function () {
	$('#items').html('<li>'+localStorage.length+'</li>');
	for(var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i),
			value = localStorage.getItem(key),
			obj = $.parseJSON(value);

		console.log(obj);
	}
	$('#clearAll').on('click', function () {
		localStorage.clear();
		refreshPage();
	});
});

// Update



// Delete



//-- End CRUD --//

// This function was created by Scott W. Bradley
// http://scottwb.com/blog/2012/06/29/reload-the-same-page-without-blinking-on-jquery-mobile/
function refreshPage() {
	$.mobile.changePage(
	window.location.href, {
		allowSamePageTransition: true,
		transition: 'none',
		showLoadMsg: false,
		reloadPage: true
	});
}

var autofillData = function() {
		//The JSON data used for this is in the json.js file
		for(var n in json) {
			var id = Math.floor(Math.random() * 1000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};

$('#homepage').on('pagebeforeshow', function() {
	if (localStorage.length === 0) {
		$('<div>').simpledialog2({
			mode: 'button',
			headerText: 'No Data',
			zindex: 1000,
			buttonPrompt: 'You have nothing to do. Would you like to load sample data?',
			buttons : {
				'OK': { click: function () {
						autofillData();
					}
				},
				'Cancel': { click: function () {
						this.close();
					},
					icon: "delete",
					theme: "c"
				}
			}
		});
	}
});

