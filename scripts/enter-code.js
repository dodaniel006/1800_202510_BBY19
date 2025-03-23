document.getElementById("join-btn").addEventListener("click", (e) => {
  const code = document.getElementById("inviteCode").value;

  if (new RegExp("^[A-Z]{5}$").test(code)) {
    console.log("JOINING EVENT");

    // redirect to a specific event page with the code from "code" variable
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userID = user.uid;
        db.collection("events")
          .where("hostId", "==", userID)
          .get()
          .then((allEvents) => {
            if (!allEvents.empty) {
              allEvents.forEach((event) => {
                if (event.data().eventCode === code) {
                  console.log("Event found:", event.id);

                  // Redirect to the event page with the event ID
                  window.location.href = 'event-page.html?docID=' + event.id;
                } else {
                  console.log("No event found with the provided code.");
                  alert("No event found with the provided code.");
                  // Optionally, display a message to the user
                }
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching events:", error);
          });

      } else {
        console.log("No user is logged in.");
      }
    });
  } else {
    alert("Invalid code. Please enter a valid code.");
  }

});