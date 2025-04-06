"use=strict";

let eventCodeToggle = false;
const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let suggestedDays = [];
let myAttendance = [];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function renderCalendar(month, year) {
  calendarDates.innerHTML = "";
  monthYear.textContent = `${months[month]} ${year}`;

  // Get the first day of the month
  const firstDay = new Date(year, month, 1).getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create blanks for days of the week before the first day
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarDates.appendChild(blank);
  }

  // Get today's date
  const today = new Date();

  // Populate the days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.classList.add("calendar-day");
    day.textContent = i;

    // Highlight today's date
    if (
      i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth()
    ) {
      day.classList.add("current-date");
    }

    calendarDates.appendChild(day);
  }
  suggestedDays = document.getElementsByClassName("suggested-day");
}

// Initial render
renderCalendar(currentMonth, currentYear);

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
      eventDays = doc.data().dateDay;
      eventTime = doc.data().time;
      eventDescription = doc.data().description;
      selectedTime = doc.data().selectedTime;
      eventCode = doc.data().eventCode;
      eventImgString = doc.data().eventImage;

      if (eventImgString == null) {
        document.getElementById("event-image").src =
          "./images/SweetSpot_Logo_1.0.png";
      } else {
        document.getElementById("event-image").src =
          "data:image/png;base64," + eventImgString;
      }

      if (!doc.data().dateConfirmed) {
        dateIcon =
          "<span class='material-icons icon-text-align'>date_range</span>";
      } else {
        dateIcon = "<span class='material-icons icon-text-align'>today</span>";
      }

      // Populate html with info
      document.getElementById("event-title").innerHTML = eventName;
      document.getElementById("event-date").innerHTML =
        dateIcon + "<b>Date Range:</b> &nbsp" + eventDate;
      // document.getElementById("event-time").innerHTML = "Time:	" + eventTime;
      document.getElementById("event-time").innerHTML =
        "<span class='material-icons icon-text-align'>schedule</span><b>Time:</b> &nbsp" +
        selectedTime;
      document.getElementById("event-location").innerHTML =
        "<span class='material-icons icon-text-align'>pin_drop</span><b>Location:</b> &nbsp" +
        eventLocation;
      document.getElementById("event-about").innerHTML =
        "Get Excited About " + eventName + "!";
      document.getElementById("description").innerHTML = eventDescription;
      showPlannerTools(doc);

      // Old code to get the eventDays from the eventDate string
      // Before we had dateDay in the database
      // let eventDateList = eventDate.split(" "); // split the date string into an array
      // let eventDays = eventDateList[1].split(","); // split the day from the month
      // eventDays.pop(); // Renove the last element, which is an empty string

      // highlight the dates from eventDays in the calendar
      let calendarDates = document.getElementsByClassName("calendar-dates");
      let calendarDays = calendarDates.item(0).children; // gets an array of elements containing all the calendar days for that month

      // on click function to be attached to each of the suggested day elements
      const addDayToAttendance = (e) => {
        // Adds or removes the date from the myAttendance array and updates the class of the element
        if (!myAttendance.includes(e.target.textContent)) {
          // If the date is not already in the array, add it and change the class
          myAttendance.push(e.target.textContent);
          myAttendance.sort(); // Sort the array to keep it in order
          e.target.classList.add("selected-day"); // Highlight the selected date
          console.log("Date selected: " + myAttendance);
        } else {
          // If the date is already in the array, remove it and change the class
          myAttendance.splice(myAttendance.indexOf(e.target.textContent), 1);
          e.target.classList.remove("selected-day"); // Remove the highlight from the date
          console.log("Date removed: " + myAttendance);
        }
        // Update the attendance list in the HTML
        document.getElementById("my-attendance-list").textContent =
          myAttendance;
      };

      // select dates which match the eventDate list from the database and hightlight them
      for (let i = 0; i < calendarDays.length; i++) {
        let day = calendarDays[i];
        if (eventDays.includes(day.textContent)) {
          day.classList.add("suggested-day"); // Highlights the suggested dates
        }
        // Adds the click event listener to the suggested days
        if (day.classList.contains("suggested-day")) {
          day.addEventListener("click", addDayToAttendance);
        }
      }
    });
}
displayEventInfo();

function showPlannerTools(doc) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      eventPlanner = doc.data().hostId;
      // Lets us know who the logged-in user is by logging their UID
      console.log("Current User: " + user.uid);
      console.log("Event Planner: " + eventPlanner);
      if (user.uid == eventPlanner) {
        console.log("User is the event planner.");
        $("#plannerTools").load("./text/planner-tools.html", function () {
          console.log("Planner tools loaded.");
          let sweetMap = generateSweetMap(doc);
          document.getElementById("sweetmapPlaceholder").innerHTML = sweetMap;
          document.getElementById("eventCode").style.visibility = "hidden";
          document.getElementById("eventCode").innerHTML = eventCode;
          document
            .getElementById("toggleButton")
            .addEventListener("click", () => {
              eventCodeToggle = !eventCodeToggle;
              if (eventCodeToggle) {
                document.getElementById("eventCode").style.visibility =
                  "visible";
              } else {
                document.getElementById("eventCode").style.visibility =
                  "hidden";
              }
            });
          document
            .getElementById("delete-event")
            .addEventListener("click", (e) => {
              let params = new URL(window.location.href);
              let eventID = params.searchParams.get("docID");
              deleteEventConfirmation(eventID);
            });
        });
        document.addEventListener("DOMContentLoaded", function () {});
      }
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

// Function that gets the Dates voted on by attendees and returns a string with the most popular dates
function generateSweetMap(doc) {
  //Getting the necessary data from the database
  let attendeeDateVotes = doc.data().attendeeDateVotes || [];
  let month = doc.data().dateMonth;
  let consensusDate = [];
  let consensusCount = [];

  // Loop that goes through the dates and adds them to a list if they're new
  // and increases the count if they're already in the list
  for (let i = 0; i < attendeeDateVotes.length; i++) {
    if (consensusDate.includes(attendeeDateVotes[i])) {
      consensusCount[consensusDate.indexOf(attendeeDateVotes[i])]++;
    } else {
      consensusDate.push(attendeeDateVotes[i]);
      consensusCount.push(1);
    }
  }

  // Sorting the dates by the number of votes
  for (let i = 0; i < consensusDate.length; i++) {
    for (let j = 0; j < consensusDate.length - 1; j++) {
      if (consensusCount[j] < consensusCount[j + 1]) {
        // Use temporary variables for swapping
        let tempCount = consensusCount[j];
        consensusCount[j] = consensusCount[j + 1];
        consensusCount[j + 1] = tempCount;

        let tempDate = consensusDate[j];
        consensusDate[j] = consensusDate[j + 1];
        consensusDate[j + 1] = tempDate;
      }
    }
  }

  // Concatenating the top 3 position dates with the same number of votes
  let chosenDateCount = [consensusCount[0]];
  let chosenDates = [consensusDate[0]];
  let valueCount = 0;
  for (let i = 1; i < consensusCount.length; i++) {
    if (consensusCount[i] == chosenDateCount[valueCount]) {
      chosenDates[valueCount] += ", " + consensusDate[i];
    } else {
      valueCount++;
      chosenDateCount.push(consensusCount[i]);
      chosenDates.push(consensusDate[i]);
    }
  }

  // Creating the Ordered List with the most popular dates
  let sweetMap = "The most ideal days for the event are:<br><ol>";
  for (let i = 0; i < chosenDates.length; i++) {
    console.log(chosenDates[i] + " | " + chosenDateCount[i]);
    sweetMap +=
      '<li class="listItem">' +
      month +
      " " +
      chosenDates[i] +
      " with " +
      chosenDateCount[i] +
      " votes.</li>";
  }
  sweetMap += "</ol>";
  return attendeeDateVotes.length ? sweetMap : "No votes yet.";
}

document.getElementById("submit-attendance").addEventListener("click", (e) => {
  let params = new URL(window.location.href);
  let eventID = params.searchParams.get("docID");
  console.log("Submitting attendance for event ID: " + eventID);
  db.collection("events")
    .doc(eventID)
    .get()
    .then((doc) => {
      let existingAttendance = doc.data().attendeeDateVotes || [];
      let updatedAttendance = [...existingAttendance, ...myAttendance];

      db.collection("events")
        .doc(eventID)
        .update({
          attendeeDateVotes: updatedAttendance, // Updates the array with duplicates allowed
        })
        .then(() => {
          console.log("Attendance submitted", myAttendance);
        });
    });
});

const deleteEventConfirmation = async (eventId) => {
  // show delete confirmation dialog
  const confirmation = confirm(
    "Are you sure you want to delete this event? This action cannot be undone."
  );
  confirmation ? deleteEvent(eventId) : console.log("Event deletion canceled.");
};

const deleteEvent = async (eventId) => {
  db.doc(`events/${eventId}`)
    .delete()
    .then(function (doc) {
      console.log("Document successfully deleted!");
      // Redirect to events page after deletion
      window.location.href = "main.html";
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
      alert("Error deleting event. Please try again.");
    });
};
