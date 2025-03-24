let eventCodeToggle = false;

function displayEventInfo() {
  // Get eventID from params
  let params = new URL(window.location.href);
  let eventID = params.searchParams.get("docID");

  // Get event info from database
  db.collection("events")
    .doc(eventID)
    .get()
    .then((doc) => {
      eventName = doc.data().name;
      eventLocation = doc.data().location;
      eventDate = doc.data().date;
      eventTime = doc.data().time;
      eventDescription = doc.data().description;
      
      selectedTime = doc.data().selectedTime;

      // Populate html with info
      document.getElementById("event-title").innerHTML = eventName;
      document.getElementById("event-date").innerHTML = "Date:	" + eventDate;
      // document.getElementById("event-time").innerHTML = "Time:	" + eventTime;
      document.getElementById("event-time").innerHTML = "Time:	" + selectedTime;
      document.getElementById("event-location").innerHTML =
        "Location:	" + eventLocation;
      document.getElementById("description").innerHTML = eventDescription;
	  showPlannerTools(doc);

      // select dates which match the eventDate list from the database and hightlight them
      let eventDateList = eventDate.split(" "); // split the date string into an array
      let eventDays = eventDateList[1].split(","); // split the day from the month
      eventDays.pop(); // Renove the last element, which is an empty string

	  
	
    });
}
displayEventInfo();

document
  .getElementById("generateCodeButton")
  .addEventListener("click", function () {
    eventCodeToggle = !eventCodeToggle;
    if (eventCodeToggle) {
      document.getElementById("eventCode").style.visibility = "visible";
    } else {
      document.getElementById("eventCode").style.visibility = "hidden";
    }
  });


function showPlannerTools(doc){
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			eventPlanner = doc.data().hostId;
			eventCode = doc.data().eventCode;
			console.log(user.uid); // Let's know who the logged-in user is by logging their UID
			console.log("Event Planner " + eventPlanner);
			if (user.uid == eventPlanner){
				console.log($('#plannerTools').load('./text/invite-code.html'));
				document.addEventListener('DOMContentLoaded', function() {
					document.getElementById("eventCode").style.visibility = "hidden";
      				document.getElementById("eventCode").innerHTML = eventCode;
				});
				
			}
			
		} else {
			console.log("No user is logged in."); // Log a message when no user is logged in
		}
	});
}
