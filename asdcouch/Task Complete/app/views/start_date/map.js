function (doc) {
	if ((doc._id.substr(0,5) === "task_") && (doc.startDate)) {
		emit(doc.startDate, {
			"id": doc._id,
			"rev": doc._rev,
			"itemName": doc.itemName,
			"startDate": doc.startDate,
			"endDate": doc.endDate,
			"category": doc.category,
			"comments": doc.comments
		});
	}
};