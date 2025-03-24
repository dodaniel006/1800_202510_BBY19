"use=strict";
const calendarDates = document.querySelector(".calendar-dates");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const selectedDate = document.getElementById("selected-date");
let selectedDateFormArray = [];

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
