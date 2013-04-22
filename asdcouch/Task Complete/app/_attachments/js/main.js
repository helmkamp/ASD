// Andrew Helmkamp
// ASD 1304
// Main Project JS File



$(document).on('pagebeforechange', function (e, data) {
    if (typeof data.toPage === "string") {
        var urlData = $.mobile.path.parseUrl(data.toPage);
        console.log(urlData);
        // displayTasks();
    }
});

$('#display').on('pagecreate', function () {
    // function displayTasks () {
    $.couch.db("tasks").view("tm/tasks", {
        success: function (response) {
            console.log(response);
            var list = $('#list');
            $.each(response.rows, function (index, val) {
                var name = val.value.itemName,
                    sDate = val.value.startDate,
                    eDate = val.value.endDate,
                    cat = val.value.category,
                    comm = val.value.comments;
                list.append($('<li>')
                    .append($('<h2>').text(name))
                    .append($('<p>').text("Start Date: " + sDate))
                    .append($('<p>').text("End Date: " + eDate))
                    .append($('<p>').text("Category: " + cat))
                    .append($('<p>').text("Comments: " + comm)));
            });
            list.listview('refresh');
        }
    });
    console.log("Display Page!");
    // }
});

$('#displayWork').on('pageinit', function () {
    $.ajax({
        url: '_view/work',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            var list = $('#listWork');
            $.each(response.rows, function (index, val) {
                var name = val.value.itemName,
                    sDate = val.value.startDate,
                    eDate = val.value.endDate,
                    cat = val.value.category,
                    comm = val.value.comments;
                list.append($('<li>')
                    .append($('<h2>').text(name))
                    .append($('<p>').text("Start Date: " + sDate))
                    .append($('<p>').text("End Date: " + eDate))
                    .append($('<p>').text("Category: " + cat))
                    .append($('<p>').text("Comments: " + comm)));
            });
            list.listview('refresh');
        }
    });
});

$('#addpage').on('pageinit', function () {
    $('#todoForm :input').prop('disabled', true);
});