"use=strict";

const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
let params = new URL(window.location.href);
let eventID = params.searchParams.get("docID");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let eventCodeToggle = false;
let finalDateSelected = false;
let dateSelected = 0;

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
        document.getElementById("event-image").src = "./images/SweetSpot_Logo_1.0.png"
      } else {
        document.getElementById("event-image").src = "data:image/png;base64," + eventImgString;
      }

      if (!doc.data().dateConfirmed) {
        dateIcon = "<span class='material-icons icon-text-align'>date_range</span>";
        dateSelected = "<b>Date:</b>&nbspTBD";
      } else {
        dateIcon = "<span class='material-icons icon-text-align'>today</span>";
        dateSelected = "<b>Date:</b> &nbsp" + eventDate;
      }

      // Populate html with info
      document.getElementById("event-title").innerHTML = eventName;
      document.getElementById("event-date").innerHTML = dateIcon + dateSelected;
      // document.getElementById("event-time").innerHTML = "Time:	" + eventTime;
      document.getElementById("event-time").innerHTML =
        "<span class='material-icons icon-text-align'>schedule</span><b>Time:</b> &nbsp" + selectedTime;
      document.getElementById("event-location").innerHTML =
        "<span class='material-icons icon-text-align'>pin_drop</span><b>Location:</b> &nbsp" + eventLocation;
      document.getElementById("event-about").innerHTML = "Get Excited About " + eventName + "!";
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
        document.getElementById("my-attendance-list").textContent = myAttendance;
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
        $("#plannerTools").load("./text/planner-tools.html", function () {
          let sweetMap = generateSweetMap(doc);
          document.getElementById("date-select-placeholder").innerHTML = sweetMap;
          document.getElementById("eventCode").style.visibility = "hidden";
          document.getElementById("eventCode").innerHTML = eventCode;
          if (doc.data().dateConfirmed) {
            document.getElementById("date-select-header-2").innerText = "Select a different day for your event:";
          } else {
            document.getElementById("date-select-header-2").innerText = "Select the date for your event:";
          }
          document.getElementById("toggleButton").addEventListener("click", () => {
            eventCodeToggle = !eventCodeToggle;
            if (eventCodeToggle) {
              document.getElementById("eventCode").style.visibility = "visible";
            } else {
              document.getElementById("eventCode").style.visibility = "hidden";
            }
          });
        });
        document.addEventListener("DOMContentLoaded", function () {
        });
      }
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

// Function that gets the Dates voted on by attendees and returns a string with the most popular dates
function generateSweetMap(doc) {
  //Getting the necessary data from the database
  let attendeeDateVotes = doc.data().attendeeDateVotes;
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
    // if (consensusCount[i] == chosenDateCount[valueCount]) {
    //   chosenDates[valueCount] += ", " + consensusDate[i]; }
    if (consensusCount[i] != chosenDateCount[valueCount]) {
      chosenDateCount.push(consensusCount[i]);
      chosenDates.push(consensusDate[i]);
    }
  }

  // Creating the Ordered List with the most popular dates
  let sweetMap = "";
  for (let i = 0; i < (chosenDates.length < 5 ? chosenDates.length : 5); i++) {
    console.log(chosenDates[i] + " | " + chosenDateCount[i]);
    sweetMap += "<button onclick=\"setFinalDate(" + chosenDates[i] + ")\" id=\"date-"
      + chosenDates[i] + "\" class=\"btn sweet-button my-1\">" + months[currentMonth]
      + " " + chosenDates[i] + " with " + chosenDateCount[i] + " votes." + "</button>";
  }
  sweetMap += "</ol>";
  return sweetMap;
}

function setFinalDate(date) {
  if (!finalDateSelected) {
    finalDateSelected = true;
    dateSelected = date;
    document.getElementById("date-" + date).classList.add("selected-day"); // Highlight the selected date
  } else if (finalDateSelected && dateSelected == date) {
    finalDateSelected = false;
    document.getElementById("date-" + date).classList.remove("selected-day"); // Highlight the selected date
  }
}

function submitFinalDate() {
  if (finalDateSelected) {
    db.collection("events")
      .doc(eventID)
      .update({
        dateConfirmed: true,
        date: months[currentMonth] + " " + dateSelected + ", " + currentYear,
      })
      .then(() => {
        alert("Final date submitted: " + months[currentMonth] + " " + dateSelected + ", " + currentYear);
        window.location.reload(); // Reload the page to update the event info
      });
  } else {
    alert("Please select a date before submitting.");
  }
}

document.getElementById("submit-attendance").addEventListener("click", (e) => {
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
          window.location.reload(); // Reload the page to update the event info
        });
    });
});
