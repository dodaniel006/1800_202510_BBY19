"use=strict";
const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const selectedDate = document.getElementById("selected-date");
// const generateCodeButton = document.getElementById("generateCodeButton");
// const inviteContainer = document.getElementById("invite-container");
const inviteCode = document.getElementById("eventCode");
let selectedDateFormItem;

const submitBtn = document.getElementById("submit-event");

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

calendarDates.addEventListener("click", (e) => {
  if (e.target.classList.contains("calendar-day")) {
    selectedDate.textContent = `Date Selected: ${e.target.textContent} ${months[currentMonth]} ${currentYear}`;
    selectedDateFormItem = e.target.textContent;
  }
});

function addEvent(e) {
  const auth = firebase.auth();

  let eventName = document.getElementById("event-name");
  let eventDetails = document.getElementById("event-details");
  let selectedDay = selectedDateFormItem;
  let selectedMonth = months[currentMonth];
  let selectedYear = currentYear;
  let selectedTime = document.querySelector('input[name="time"]:checked').value;
  let location = document.getElementById("event-location");
  // let eventCode = generateCode();
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
    hostID: hostID,
    // eventCode: eventCode,
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            event.host = doc.data().name;
            event.hostId = user.uid;
            console.log("final event: ", event);

            db.collection("events")
              .add(event)
              .then((docRef) => {
                console.log("Event added with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding event: ", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error adding event: ", error);
        });
    }
  });
}

// function generateCode() {
//   let codeString = "";
//   for (let i = 0; i < 5; i++) {
//     codeString += String.fromCharCode(65 + Math.floor(Math.random() * 25));
//   }
//   return codeString;
// }

// generateCodeButton.addEventListener(
//   "click",
//   function () {
//     let codeString = generateCode();
//     inviteCode.innerHTML = codeString;
//   },
//   { once: true }
// );

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
