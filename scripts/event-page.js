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
      eventCode = doc.data().eventCode;
      selectedTime = doc.data().selectedTime;

      // Populate html with info
      document.getElementById("event-title").innerHTML = eventName;
      document.getElementById("event-date").innerHTML = "Date:	" + eventDate;
      // document.getElementById("event-time").innerHTML = "Time:	" + eventTime;
      document.getElementById("event-time").innerHTML = "Time:	" + selectedTime;
      document.getElementById("event-location").innerHTML =
        "Location:	" + eventLocation;
      document.getElementById("description").innerHTML = eventDescription;
      document.getElementById("eventCode").style.visibility = "hidden";
      document.getElementById("eventCode").innerHTML = eventCode;

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
