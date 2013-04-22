function (doc) {
	if ((doc._id.substr(0,5) === "task_") && (doc.category.substr(0,6) === "School")) {
		emit(doc._id, {
			"itemName": doc.itemName,
			"startDate": doc.startDate,
			"endDate": doc.endDate,
			"category": doc.category,
			"comments": doc.comments
		});
	}
};