function (doc) {
	if ((doc._id.substr(0,5) === "task_") && (doc.category.substr(0,8) === "Personal")) {
		emit(doc._id, {
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