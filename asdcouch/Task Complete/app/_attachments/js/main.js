// Andrew Helmkamp
// ASD 1304
// Main Project JS File


var urlVars = function(u) {
    var urlData = typeof u !== 'undefined' ? u : $($.mobile.activePage).data('url');

    if (urlData.indexOf('?') > -1) {
        var urlParts = urlData.split('?'),
            urlPairs = urlParts[1].split('&'),
            urlValues = {};

        for (var pair in urlPairs) {
            var keyValue = urlPairs[pair].split('='),
                key = decodeURIComponent(keyValue[0]),
                value = decodeURIComponent(keyValue[1]);
            urlValues[key] = value;
        }
        return urlValues;
    } else {
        return false;
    }
};

function displayPage(u) {
    var urlObj = u.hash.replace(/.*viewCategory=/, ""),
        pageSelector = u.hash.replace(/\?.*$/, ""),
        $page = $(pageSelector),
        $content = $page.children(":jqmData(role=content)");
    // console.log(urlObj);
    $.couch.db("tasks").view("tm/" + urlObj, {
        success: function(response) {
            // console.log(response);
            var markup = "<ul id='categoryView' data-role='listview' data-inset='true' data-filter='true'>";
            $.each(response.rows, function(index, val) {
                var name    = val.value.itemName,
                    s       = new Date(val.value.startDate),
                    sDate   = s.toLocaleDateString(),
                    e       = new Date(val.value.endDate),
                    eDate   = e.toLocaleDateString(),
                    cat     = val.value.category,
                    comm    = val.value.comments,
                    taskID  = val.value.taskID,
                    taskRev = val.value.taskRev;
                markup += "<li><a href='display.html?task=" + taskID + "&taskRev=" + taskRev + "'><h1>" + name + "</h1>";
                markup += "<p>Start Date: " + sDate + "</p>";
                markup += "<p>End Date: " + eDate + "</p>";
                markup += "<p>Category: " + cat + "</p>";
                markup += "<p>Comments: " + comm + "</p>";
                markup += "</a>";
                markup += "<a href='#delItem?taskID=" + taskID + "&taskRev=" + taskRev + "' data-icon='delete' data-theme='d'></a>";
                markup += "</li>";
            });
            markup += "</ul>";
            $content.html(markup);
            $page.page();
            $content.find(":jqmData(role=listview)").listview();
            $.mobile.changePage($('#display'));
        }
    });
}

$(document).on('pageshow', '#editpage', function() {
    var viewName = urlVars();
    //console.log(viewName);
    if (viewName.task) {
        $.couch.db("tasks").openDoc(viewName.task, {
            success: function(response) {
                // console.log(response);
                $('#start').val(response.startDate);
                $('#end').val(response.endDate);
                $('#name').val(response.itemName);
                $('input[name="category"][value="' + response.category + '"]').prop('checked', true);
                $('#comments').val(response.comments);
            }
        });
    }
});

var storeData = function(data, keys) {
    // console.log(keys);
    data[4].value = typeof data[4].value !== 'undefined' ? data[4].value : " ";
    var n = data[2].value,
        name = n.replace(/\s/g, "_");

    // Gather data from form and store in an object
    // Object properties contain array with the form label and value
    var item = {};
    item._id = typeof keys.taskID !== 'undefined' ? keys.taskID : "task_" + name;
    if (keys.taskRev) {
        item._rev = keys.taskRev;
    }
    item.startDate = data[0].value;
    item.endDate = data[1].value;
    item.itemName = data[2].value;
    item.category = data[3].value;
    item.comments = data[4].value;
    console.log(item);
    //Save data into local storage using Stringify
    $.couch.db("tasks").saveDoc(item, {
        success: function(response) {
            //Display save confirmation dialog
            $('<div>').simpledialog2({
                mode: 'blank',
                headerText: 'Task Saved',
                zindex: 1000,
                blankContent: "<ul data-role='listview'><li>The task has been saved successfully!</li>" + "<a rel='close' data-role='button' href='#'>Close</a>",
                callbackClose: refreshPage
            });
        }
    });


};

$(document).on('pageshow', '#editpage', function() {
    var urlObj = urlVars();
    var myForm = $('#todoForm'),
        keys = {
            taskID: urlObj.task,
            taskRev: urlObj.taskRev
        };
    // alert("Edit Page");
    //console.log(keys);
    myForm.validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            var data = myForm.serializeArray();
            storeData(data, keys);
            // console.log(keys);
        }
    });
});

// Listen for any attempts to call changePage() for display and delete.
$(document).on("pagebeforechange", function(e, data) {
    if (typeof data.toPage === "string") {
        var u = $.mobile.path.parseUrl(data.toPage),
            re = /\?viewCategory/,
            reTwo = /^#delItem/;
        if (u.hash.search(re) !== -1) {
            displayPage(u);
            e.preventDefault();
        }
        if (u.hash.search(reTwo) !== -1) {
            deleteItem(u);
            e.preventDefault();
        }
    }
});

var deleteItem = function(u) {
    var urlObj = urlVars(u.href);
    var doc = {
        _id: urlObj.taskID,
        _rev: urlObj.taskRev
    };
    $.couch.db("tasks").removeDoc(doc, {
        success: function() {
            //Display delete confirmation dialog
            $('<div>').simpledialog2({
                mode: 'blank',
                headerText: 'Task Deleted!',
                zindex: 1000,
                blankContent: "<ul data-role='listview'><li>The task has been deleted successfully!</li>" + "<a rel='close' data-role='button' href='#'>Close</a>",
                callbackClose: refreshPage
            });
        }
    });
};

function refreshPage() {
    $.mobile.changePage($('#homepage'), {
        allowSamePageTransition: true,
        transition: 'none',
        showLoadMsg: false,
        reloadPage: true
    });
}