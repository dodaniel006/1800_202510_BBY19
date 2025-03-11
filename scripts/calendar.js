"use=strict";
const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const selectedDate = document.getElementById("selected-date");
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

  console.log("selectedDay: ", selectedDay);

  let event = {
    name: eventName.value,
    details: eventDetails.value,
    dateYear: selectedYear,
    dateMonth: selectedMonth,
    dateDay: selectedDay,
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

// timeAm.addEventListener("click", selectTime());
// timePm.addEventListener("change", selectTime());

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEvent(e);
});
