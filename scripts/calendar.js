"use=strict";
const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const selectedDate = document.getElementById("selected-date");
let selectedDateFormArray = [];

const submitBtn = document.getElementById("submit-event");
const submitMobileBtn = document.getElementById("submit-event-mobile");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

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
      // pre-select current day
      selectedDate.textContent = `Date Selected: ${today.getDate()} 
        ${months[today.getMonth()]} ${today.getFullYear()}`;
      selectedDateFormArray.push(today.getDate());
    }

    calendarDates.appendChild(day);
  }
}

// Initial render
renderCalendar(currentMonth, currentYear);

prevMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

// CLICK event for selecting a date
calendarDates.addEventListener("click", (e) => {
  if (e.target.classList.contains("calendar-day")) {
    selectedDate.textContent = `Date Selected: ${e.target.textContent} ${months[currentMonth]} ${currentYear}`;
    // Replace everything in array with the singular clicked date
    selectedDateFormArray.splice(0, selectedDateFormArray.length);
    selectedDateFormArray.push(e.target.textContent);

    // Removes the highlight from the previously selected date
    Array.from(e.target.parentNode.children).filter((el) =>
      el !== e.target ? el.classList.remove("current-date") : null
    );
    e.target.classList.add("current-date"); // Highlights the selected date
  }
});

let mouseIsDown = false;
calendarDates.addEventListener("mousedown", (e) => {
  // mouseIsDown to true and clear previous date array
  mouseIsDown = true;
  selectedDateFormArray.splice(0, selectedDateFormArray.length);
  // Capture the initial date held down on
  selectedDateFormArray.push(e.target.textContent);
  selectedDate.textContent = `Dates Selected: ${selectedDateFormArray.join(
    ", "
  )} ${months[currentMonth]} ${currentYear}`;
  e.target.classList.add("current-date"); // Highlights the selected dates
  // Removes the highlight from all previously selected dates
  Array.from(e.target.parentNode.children).filter((el) =>
    el !== e.target ? el.classList.remove("current-date") : null
  );
});
calendarDates.addEventListener("mouseup", (e) => {
  mouseIsDown = false;
});
calendarDates.addEventListener("mouseover", (e) => {
  if (!mouseIsDown) return;
  if (e.target.classList.contains("calendar-day")) {
    if (!selectedDateFormArray.includes(e.target.textContent)) {
      selectedDateFormArray.push(e.target.textContent);
      selectedDate.textContent = `Dates Selected: ${selectedDateFormArray.join(
        ", "
      )} ${months[currentMonth]} ${currentYear}`;
      e.target.classList.add("current-date"); // Highlights the selected dates
    }
  }
});

function addEvent(e) {
  const auth = firebase.auth();

  let eventName = document.getElementById("event-name");
  let eventDetails = document.getElementById("event-details");

  let selectedDay = selectedDateFormArray;
  let selectedMonth = months[currentMonth];
  let selectedYear = currentYear;
  let selectedTime = document.querySelector('input[name="time"]:checked').value;
  let location = document.getElementById("event-location");
  let eventCode = generateCode();
  let hostID = db.collection("users").doc(auth.currentUser.uid);

  console.log("selectedDay: ", selectedDay);

  let event = {
    name: eventName.value,
    description: eventDetails.value,
    dateYear: selectedYear,
    dateMonth: selectedMonth,
    dateDay: selectedDay,
    selectedTime: selectedTime,
    date: `${selectedMonth} ${selectedDay}, ${selectedYear}`,
    location: location.value,
    planner: hostID,
    eventCode: eventCode,
  };

  function generateCode() {
    let codeString = "";
    for (let i = 0; i < 5; i++) {
      codeString += String.fromCharCode(65 + Math.floor(Math.random() * 25));
    }
    return codeString;
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      // First get the user's name to add to the event
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            event.host = doc.data().name;
            event.hostId = user.uid;

            // Then add the event to the events collection
            db.collection("events")
              .add(event)
              .then((docRef) => {
                console.log("Event added with ID: ", docRef.id);

                // Add a reference to the created event in the user's subcollection
                db.collection("users")
                  .doc(user.uid)
                  .collection("events")
                  .doc(docRef.id)
                  .set({
                    eventRef: docRef,
                  })
                  .then(() => {
                    console.log(
                      "Event reference added to user's subcollection"
                    );
                  })
                  .catch((error) => {
                    console.error(
                      "Error adding event reference to user's subcollection: ",
                      error
                    );
                  });
              });
          }
        })
        .catch((error) => {
          console.log("EVENT NOT ADDED");
          console.error("Error adding event: ", error);
        });
    }
  });
}

document.getElementById("time-am").addEventListener("click", () => {
  swapActiveTime();
});
document.getElementById("time-pm").addEventListener("click", () => {
  swapActiveTime();
});

function swapActiveTime() {
  let timeAmBtn = document.getElementById("time-am");
  let amInput = document.getElementById("time-am-input");
  let timePmBtn = document.getElementById("time-pm");
  let pmInput = document.getElementById("time-pm-input");
  if (timeAmBtn.classList.contains("btn-active")) {
    // remove active from AM and add to PM
    timeAmBtn.classList.add("btn-inactive");
    timeAmBtn.classList.remove("btn-active");
    amInput.checked = false;

    timePmBtn.classList.add("btn-active");
    timePmBtn.classList.remove("btn-inactive");
    pmInput.checked = true;
    console.log("time-am-input: ", timeAmBtn);
  } else {
    // remove active from PM and add to AM
    timeAmBtn.classList.add("btn-active");
    timeAmBtn.classList.remove("btn-inactive");
    amInput.checked = true;

    timePmBtn.classList.add("btn-inactive");
    timePmBtn.classList.remove("btn-active");
    pmInput.checked = false;
  }
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEvent(e);
});

submitMobileBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEvent(e);
});
