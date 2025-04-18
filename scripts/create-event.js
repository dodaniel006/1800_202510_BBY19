const submitBtn = document.getElementById("submit-event");
const submitMobileBtn = document.getElementById("submit-event-mobile");

// Gets event details from forms and calendar element and submits to firebase
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
  let eventImg = document
    .querySelector("#event-image-preview")
    .src.split(",")[1];

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
    eventImage: eventImg,
    dateConfirmed: false, // For use when confirmed the event (and provide highlight onto events)
  };

  function generateCode() {
    let codeString = "";
    for (let i = 0; i < 5; i++) {
      codeString += String.fromCharCode(65 + Math.floor(Math.random() * 25));
    }
    return codeString;
  }

  // Add to events collection and an eventRef to user's subcollection
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

document
  .getElementById("event-image")
  .addEventListener("change", function (file) {
    const imgPrev = document.querySelector("#event-image-preview");
    const image = file.target.files[0];
    console.log(image);
    if (image) {
      var readFile = new FileReader();

      readFile.onload = function (f) {
        imgPrev.src = f.target.result;
      };
      readFile.readAsDataURL(image);
    }
  });

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEvent(e);

  // Shoot confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Redirect to main after 1 sec, so the confetti can play a bit
  setTimeout(() => {
    window.location.href = "main.html";
  }, 1000);
});

submitMobileBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addEvent(e);

  // Shoot confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Redirect to main after 1 sec, so the confetti can play a bit
  setTimeout(() => {
    window.location.href = "main.html";
  }, 1000);
});

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
      window.location.replace("./index.html");
    })
    .catch((error) => {
      console.log("firebase auth logout fail");
    });
}
