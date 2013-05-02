// Andrew Helmkamp
// ASD 1304
// Main Project JS File


var urlVars = function(u) {
    var urlData = typeof u !== 'undefined' ? u : $($.mobile.activePage).data('url'),
        urlParts = urlData.split('?'),
        urlPairs = urlParts[1].split('&'),
        urlValues = {};

    for (var pair in urlPairs) {
        var keyValue = urlPairs[pair].split('='),
            key = decodeURIComponent(keyValue[0]),
            value = decodeURIComponent(keyValue[1]);
        urlValues[key] = value;
    };

    return urlValues;
};

$(document).on('pageshow', '#display', function () {
    var viewName = urlVars()['viewCategory'];
    $.couch.db("tasks").view("tm/" + viewName, {
        success: function (response) {
            console.log(response);
            var list = $('#list');
            $.each(response.rows, function (index, val) {
                var name = val.value.itemName,
                    s = new Date(val.value.startDate),
                    sDate = s.toLocaleDateString(),
                    e = new Date(val.value.endDate),
                    eDate = e.toLocaleDateString(),
                    cat = val.value.category,
                    comm = val.value.comments;
                    taskID = val.value.taskID,
                    taskRev = val.value.taskRev;
                list.append($('<li>')
                    .append($('<a>')
                        .attr('href', 'index.html#addpage?task=' + val.value.taskID)
                        //.attr('data-ajax', 'false')
                        .append($('<h2>').text(name))
                        .append($('<p>').text("Start Date: " + sDate))
                        .append($('<p>').text("End Date: " + eDate))
                        .append($('<p>').text("Category: " + cat))
                        .append($('<p>').text("Comments: " + comm))
                    )
                    .append($('<a>')
                        .attr('href', '#')
                        .attr('data-id', taskID)
                        .attr('data-rev', taskRev)
                        .attr('data-icon', 'delete')
                        .attr('class', 'deleteTask')
                        .attr('data-role', 'button')
                    ).on('click', deleteItem)
                );   
            });
            list.listview('refresh');
        }
    });
});

var storeData = function(data, key) {
    console.log(key);
    var id = typeof key !== 'undefined' ? key : Math.floor(Math.random() * 1000000001);
    data[4].value = typeof data[4].value !== 'undefined' ? data[4].value : " ",
    n = data[2].value,
    name = n.replace(/\s/g, "_");

    //Gather data from form and store in an object
    //Object properties contain array with the form label and value
    var item = {};
    item._id = "task_" + name;
    item.startDate = new Date(data[0].value);
    item.endDate = new Date(data[1].value);
    item.itemName = data[2].value;
    item.category = data[3].value;
    item.comments = data[4].value;

    //Save data into local storage using Stringify
    $.couch.db("tasks").saveDoc(item, {
        success: function (response) {
            console.log(response);
        }
    });

    //Display save confirmation dialog
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
        key = $('[data-id]').val();
        //console.log(key);
    myForm.validate({
        invalidHandler: function(form, validator) {},
        submitHandler: function() {
            var data = myForm.serializeArray();
            storeData(data, key);
            console.log(key+": "+data);
        }
    });
});

var deleteItem = function() {
    var doc = {
        _id: $(this).data('id'),
        _rev: $(this).data('rev')
    };
    console.log(doc);
    // $.couch.db(tasks).removeDoc(doc, {
    //     success : function() {
    //         //refreshPage();
    //         alert("Success");
    //     }
    // });
};

function refreshPage() {
    $.mobile.changePage($('#homepage'), {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: false,
            reloadPage: true
        });
}










