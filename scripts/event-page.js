let eventCodeToggle = false;

function displayEventInfo() {
	console.log("displayEvents");
	let params = new URL(window.location.href);
	let eventID = params.searchParams.get("docID");
	console.log(eventID);

	db.collection("events").doc(eventID).get().then(doc => {
		eventName = doc.data().name;
		eventLocation = doc.data().location;
		eventDate = doc.data().date;
		eventTime = doc.data().time;
		eventDescription = doc.data().description;
		eventCode = doc.data().eventCode;

		document.getElementById("event-title").innerHTML = eventName;
		document.getElementById("event-date").innerHTML = "Date:	" + eventDate;
		document.getElementById("event-time").innerHTML = "Time:	" + eventTime;
		document.getElementById("event-location").innerHTML = "Location:	" + eventLocation;
		document.getElementById("description").innerHTML = eventDescription;
		document.getElementById("eventCode").style.visibility = "hidden";
		document.getElementById("eventCode").innerHTML = eventCode;
	})
}
displayEventInfo();

document.getElementById("generateCodeButton").addEventListener(
	"click",
	function () {
		eventCodeToggle = !eventCodeToggle;
		if (eventCodeToggle) {
			document.getElementById("eventCode").style.visibility = "visible";
		} else {
			document.getElementById("eventCode").style.visibility = "hidden";
		}
	},
);