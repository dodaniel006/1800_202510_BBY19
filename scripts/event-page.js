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

      // highlight the dates from eventDays in the calendar
      let calendarDates = document.getElementsByClassName("calendar-dates");
      let calendarDays = calendarDates.item(0).children; // gets an array of elements containing all the calendar days for that month

      // on click function to be attached to each of the suggested day elements
      const addDayToAttendance = (e) => {
        // prevent multiple same day from being addded
        if (!myAttendance.includes(e.target.textContent)) {
          myAttendance.push(e.target.textContent);
          e.target.classList.add("my-attendance");
          console.log(myAttendance);
          document.getElementById("my-attendance-list").textContent =
            myAttendance;
        }
      };

      for (let i = 0; i < calendarDays.length; i++) {
        let day = calendarDays[i];
        if (eventDays.includes(day.textContent)) {
          day.classList.add("suggested-day"); // Highlights the selected date

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
      eventCode = doc.data().eventCode;
      console.log(user.uid); // Let's know who the logged-in user is by logging their UID
      console.log("Event Planner " + eventPlanner);
      if (user.uid == eventPlanner) {
        console.log($("#plannerTools").load("./text/invite-code.html"));
        document.addEventListener("DOMContentLoaded", function () {
          document.getElementById("eventCode").style.visibility = "hidden";
          document.getElementById("eventCode").innerHTML = eventCode;
        });
      }
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}

document.getElementById("submit-attendance").addEventListener("click", (e) => {
  let params = new URL(window.location.href);
  let eventID = params.searchParams.get("docID");

  db.collection("events")
    .doc(eventID)
    .get()
    .then((doc) => {
      let existingAttendance = doc.data().attendance || [];
      let updatedAttendance = [...existingAttendance, ...myAttendance];

      db.collection("events")
        .doc(eventID)
        .update({
          attendance: updatedAttendance, // Updates the array with duplicates allowed
        })
        .then(() => {
          console.log("Attendance submitted", myAttendance);
        });
    });
});
