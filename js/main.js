// Andrew Helmkamp
// ASD 1304
// Main Project JS File

//AJAX Setup
$.ajaxSetup({
	timeout: 10000,
	error: function(err) {
		console.log("Error ", err);
	}
});

//-- CRUD --//
// Create
var storeData = function(data, key) {
	console.log(key);
    var id = typeof key !== 'undefined' ? key : Math.floor(Math.random() * 1000000001);
    data[4].value = typeof data[4].value !== 'undefined' ? data[4].value : " ";

    //Gather data from form and store in an object
    //Object properties contain array with the form label and value
    var item = {};

    item.startDate = data[0].value;
    item.endDate = data[1].value;
    item.itemName = data[2].value;
    item.category = data[3].value;
    item.comments = data[4].value;

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
	var myForm = $('#todoForm'),
		key = $('#hiddenKey').val();
		console.log(key);

	myForm.validate({
		invalidHandler: function(form, validator) {},
		submitHandler: function() {
			var data = myForm.serializeArray();
			storeData(data, key);
			console.log(key+": "+data);
		}
	});
});

//Read functionality is in browseByCategory.js

// Listen for any attempts to call changePage() for edit and delete.
$(document).on("pagebeforechange", function(e, data) {
	if(typeof data.toPage === "string") {
		var u = $.mobile.path.parseUrl(data.toPage),
			re = /^#delItem/,
			reTwo = /^#editItem/;

		if(u.hash.search(re) !== -1) {
			deleteItem(u, data.options);
			e.preventDefault();
		}
		if(u.hash.search(reTwo) !== -1) {
			editItem(u, data.options);
			e.preventDefault();
		}
	}
});

// Update
var editItem = function(urlObj, options) {

    var itemKey = urlObj.hash.replace(/.*edit=/, ""),
        pageSelector = urlObj.hash.replace(/\?.*$/, ""),
        //Get data from our item from local storage
        value = localStorage.getItem(itemKey),
        item = JSON.parse(value);
        //console.log(item);
    //populate with current values
    $('#start').val(item.startDate);
    $('#end').val(item.endDate);
    $('#name').val(item.itemName);
    $('input[name="category"][value="'+item.category+'"]').prop('checked', true);
    $('#comments').val(item.comments);
    $('#hiddenKey').val(itemKey);

    $.mobile.changePage($('#addpage'));
};


// Delete
var deleteItem = function(urlObj, options) {
    var itemKey = urlObj.hash.replace(/.*delete=/, ""),
        pageSelector = urlObj.hash.replace(/\?.*$/, "");
    $('<div>').simpledialog2({
        mode: 'button',
        headerText: 'Delete Task',
        zindex: 1000,
        buttonPrompt: "<ul data-role='listview'><li><img src='img/warning.png' />Are you sure you want to delete this task?</li>",
        buttons : {
            'OK': { click: function () {
                    localStorage.removeItem(itemKey);
                    refreshPage();
                }
            },
            'Cancel': { click: function () {
                    this.close();
                    refreshPage();
                },
                icon: "delete",
                theme: "c"
            }
        }
    });
};


//-- End CRUD --//


function refreshPage() {
	$.mobile.changePage($('#homepage'));
}

var autofillJson = function() {
		$.ajax({
			url: 'xhr/data.json',
			type: 'GET',
			dataType: 'json',
			success: function(response) {

				$.each(response.tasks, function(index) {
					var id = Math.floor(Math.random() * 1000000001);
					localStorage.setItem(id, JSON.stringify(response.tasks[index]));
				});
			}
		});
	};

var autofillYaml = function () {
	$.ajax({
			url: 'xhr/data.yaml',
			type: 'GET',
			dataType: 'text',
			success: function(response) {
				var doc = jsyaml.load(response);

				$.each(doc.tasks, function(index) {
					var id = Math.floor(Math.random() * 1000000001);
					localStorage.setItem(id, JSON.stringify(doc.tasks[index]));
				});
			}
		});
	};

$('#homepage').on('pagebeforeshow', function() {
	if (localStorage.length === 0) {
		$('<div>').simpledialog2({
			mode: 'button',
			headerText: 'No Data',
			zindex: 1000,
			buttonPrompt: 'You have nothing to do. Would you like to load sample data?',
			buttons : {
				'Load JSON Data': { click: function () {
						autofillJson();
					}
				},
				'Load YAML Data': { click: function () {
						autofillYaml();
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

$('#browse-by').on('pageinit', function() {

	$('#deleteAll').on('click', function() {
		$('<div>').simpledialog2({
			mode: 'button',
			headerText: 'Delete All',
			zindex: 1000,
			buttonPrompt: "<ul data-role='listview'><li><img src='./img/warning.png' />Are you sure you want to delete all tasks?</li>",
			buttons : {
				'OK': { click: function () {
						localStorage.clear();
						refreshPage();
					}
				},
				'Cancel': { click: function () {
						this.close();
						refreshPage();
					},
					icon: "delete",
					theme: "c"
				}
			}
		});
	});
});

$('#reset').on('click', function () {
	$('#todoForm').find('input:text, input:hidden, textarea').val('');
    $('#todoForm').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
});

